import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BOT = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const APP_URL = 'https://leonardodimario.github.io/RubyChan/'
const DB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SECRET_KEY')
const db = DB_KEY ? createClient(Deno.env.get('SUPABASE_URL')!, DB_KEY) : null

async function tg(method: string, body: Record<string, unknown>) {
  const r = await fetch(`https://api.telegram.org/bot${BOT}/${method}`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body)
  })
  return await r.json()
}
const keyboard = (rows: unknown[][]) => ({ inline_keyboard: rows })
const send = (chat_id: number, text: string, reply_markup?: unknown) => tg('sendMessage', { chat_id, text, ...(reply_markup ? { reply_markup } : {}) })

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('ok')
  try {
    const update = await req.json()
    const q = update.callback_query
    if (q) {
      await tg('answerCallbackQuery', { callback_query_id: q.id })
      if (q.data === 'choose') {
        return new Response(JSON.stringify(await send(q.message.chat.id,
          '✨ Choose your Ruby Chan character\n\nOpen the Ruby Chan app and choose your AI companion:',
          keyboard([[{ text: '💜 Choose Characters', web_app: { url: APP_URL } }]]))), { headers: { 'content-type': 'application/json' } })
      }
      if (q.data === 'recharge') {
        return new Response(JSON.stringify(await send(q.message.chat.id, '⚡ Your Energy is empty. Recharge in Ruby Chan:',
          keyboard([[{ text: '💎 Recharge Energy', web_app: { url: APP_URL + '#recharge' } }]]))), { headers: { 'content-type': 'application/json' } })
      }
      return new Response('ok')
    }

    const message = update.message
    if (!message?.chat?.id) return new Response('ok')
    const chatId = Number(message.chat.id)
    const text = String(message.text || '').trim()

    if (text.startsWith('/start')) {
      return new Response(JSON.stringify(await send(chatId,
        '🌸 Welcome from Ruby Chan!\n\nYour AI companions are waiting for you. Choose a character to continue.',
        keyboard([[{ text: '✨ Choose Characters', callback_data: 'choose' }]]))), { headers: { 'content-type': 'application/json' } })
    }
    if (text === '/help') return new Response(JSON.stringify(await send(chatId,
      'Ruby Chan AI Chat\n\n✨ Choose a character in the app, then continue chatting here.\n⚡ Each message uses 1 Energy.')), { headers: { 'content-type': 'application/json' } })

    if (!db) {
      await send(chatId, '⚠️ Telegram server setup is incomplete.')
      return new Response('ok')
    }

    const { data: profile } = await db.from('profiles').select('id,energy').eq('telegram_chat_id', chatId).maybeSingle()
    const energy = Number(profile?.energy ?? 100)
    if (energy <= 0) {
      await send(chatId, '⚡ Energy 0\n\nRecharge to continue chatting.', keyboard([[{ text: '💎 Recharge Energy', web_app: { url: APP_URL + '#recharge' } }]]))
      return new Response('ok')
    }

    const { data: state } = await db.from('telegram_sessions').select('character_id').eq('telegram_chat_id', chatId).maybeSingle()
    if (!state?.character_id) {
      await send(chatId, 'Please choose a character first:', keyboard([[{ text: '✨ Choose Characters', callback_data: 'choose' }]]))
      return new Response('ok')
    }

    const { data: character } = await db.from('characters').select('id,name,ai_id').eq('id', state.character_id).single()
    if (!character?.ai_id) {
      await send(chatId, '⚠️ This character is not connected to an AI yet.')
      return new Response('ok')
    }

    await tg('sendChatAction', { chat_id: chatId, action: 'typing' })
    const ai = await fetch('https://api.kindroid.ai/v1/send-message', {
      method: 'POST',
      headers: { authorization: `Bearer ${Deno.env.get('KINDROID_API_KEY')}`, 'content-type': 'application/json' },
      body: JSON.stringify({ ai_id: character.ai_id, message: text, stream: false })
    })
    const reply = await ai.text()
    if (!ai.ok) {
      await send(chatId, '⚠️ AI service error. Please try again.')
      return new Response('ok')
    }

    const nextEnergy = Math.max(0, energy - 1)
    if (profile) await db.from('profiles').update({ energy: nextEnergy }).eq('id', profile.id)

    const extra = nextEnergy === 0 ? '\n\n⚡ Energy: 0\n💎 Recharge to continue.' : ''
    await send(chatId, reply + extra, nextEnergy === 0 ? keyboard([[{ text: '💎 Recharge Energy', web_app: { url: APP_URL + '#recharge' } }]]) : undefined)
    return new Response('ok')
  } catch (error) {
    console.error('telegram-bot error:', error)
    return new Response('ok')
  }
})
