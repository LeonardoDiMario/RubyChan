import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const KINDROID_KEY = Deno.env.get('KINDROID_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const APP_URL = 'https://leonardodimario.github.io/RubyChan/'

const db = SERVICE_KEY ? createClient(SUPABASE_URL, SERVICE_KEY) : null

async function telegram(method: string, payload: Record<string, unknown>) {
  if (!BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not configured')
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return await response.json()
}

function buttons(rows: Record<string, unknown>[][]) {
  return { inline_keyboard: rows }
}

async function send(chatId: number, text: string, markup?: unknown) {
  return telegram('sendMessage', {
    chat_id: chatId,
    text,
    ...(markup ? { reply_markup: markup } : {}),
  })
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return new Response('OK')

    const update = await req.json()
    const callback = update.callback_query
    const incoming = update.message
    const chatId = Number(callback?.message?.chat?.id ?? incoming?.chat?.id)

    if (!chatId) return new Response('OK')

    if (callback) {
      await telegram('answerCallbackQuery', { callback_query_id: callback.id })

      if (callback.data === 'choose') {
        return Response.json(await send(chatId,
          '✨ Choose your Ruby Chan character\n\nTap below to open the app and choose your AI companion.',
          buttons([[{ text: '💜 Choose Characters', web_app: { url: APP_URL } }]])
        ))
      }

      if (callback.data?.startsWith('character:')) {
        const characterId = callback.data.slice('character:'.length)
        if (db) {
          await db.from('telegram_sessions').upsert({
            telegram_chat_id: chatId,
            character_id: characterId,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'telegram_chat_id' })
        }
        return Response.json(await send(chatId,
          '💜 Character selected!\n\nYou can start chatting with your Ruby Chan AI here.',
        ))
      }

      if (callback.data === 'recharge') {
        return Response.json(await send(chatId,
          '⚡ Your Energy is empty. Recharge in the Ruby Chan app.',
          buttons([[{ text: '💎 Recharge Energy', web_app: { url: `${APP_URL}#recharge` } }]])
        ))
      }

      return new Response('OK')
    }

    const text = String(incoming?.text ?? '').trim()

    if (text === '/start' || text.startsWith('/start ')) {
      return Response.json(await send(chatId,
        '🌸 Welcome from Ruby Chan!\n\nMeet your AI companions and choose the one you want to chat with.',
        buttons([[{ text: '✨ Choose Characters', callback_data: 'choose' }]])
      ))
    }

    if (text === '/help') {
      return Response.json(await send(chatId,
        '🌸 Ruby Chan\n\n✨ Choose a character\n⚡ 1 message = 1 Energy\n💎 Recharge when Energy reaches 0'
      ))
    }

    if (!db) {
      await send(chatId, '⚠️ Telegram database connection is not configured.')
      return new Response('OK')
    }

    const { data: session } = await db
      .from('telegram_sessions')
      .select('character_id')
      .eq('telegram_chat_id', chatId)
      .maybeSingle()

    if (!session?.character_id) {
      await send(chatId,
        '✨ Choose a character first.',
        buttons([[{ text: '💜 Choose Characters', callback_data: 'choose' }]])
      )
      return new Response('OK')
    }

    const { data: character } = await db
      .from('characters')
      .select('id,name,ai_id')
      .eq('id', session.character_id)
      .maybeSingle()

    if (!character?.ai_id) {
      await send(chatId, '⚠️ This character is not connected to an AI yet.')
      return new Response('OK')
    }

    // Look for a Telegram-linked profile. If none exists, start at 100 Energy.
    let profile = null
    let energy = 100
    const profileResult = await db
      .from('profiles')
      .select('id,energy,telegram_chat_id')
      .eq('telegram_chat_id', chatId)
      .maybeSingle()

    if (profileResult.data) {
      profile = profileResult.data
      energy = Number(profile.energy ?? 100)
    }

    if (energy <= 0) {
      await send(chatId,
        '⚡ Energy 0\n\nYou have used all your Energy. Recharge to continue.',
        buttons([[{ text: '💎 Recharge Energy', web_app: { url: `${APP_URL}#recharge` } }]])
      )
      return new Response('OK')
    }

    if (!KINDROID_KEY) {
      await send(chatId, '⚠️ AI service is not configured.')
      return new Response('OK')
    }

    // Telegram shows “typing…” while Kindroid is generating the reply.
    await telegram('sendChatAction', { chat_id: chatId, action: 'typing' })

    const aiResponse = await fetch('https://api.kindroid.ai/v1/send-message', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KINDROID_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ai_id: character.ai_id,
        message: text,
        stream: false,
      }),
    })

    const reply = await aiResponse.text()

    if (!aiResponse.ok) {
      console.error('Kindroid error:', reply)
      await send(chatId, '⚠️ Ruby Chan could not reach the AI right now. Please try again.')
      return new Response('OK')
    }

    const nextEnergy = Math.max(0, energy - 1)

    if (profile?.id) {
      await db.from('profiles').update({ energy: nextEnergy }).eq('id', profile.id)
    }

    const suffix = nextEnergy === 0
      ? '\n\n⚡ Energy: 0\n💎 Recharge to continue chatting.'
      : ''

    await send(chatId, reply + suffix,
      nextEnergy === 0
        ? buttons([[{ text: '💎 Recharge Energy', web_app: { url: `${APP_URL}#recharge` } }]])
        : undefined
    )

    return new Response('OK')
  } catch (error) {
    console.error('bright-api error:', error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
