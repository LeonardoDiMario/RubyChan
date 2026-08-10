import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const KINDROID_KEY = Deno.env.get('KINDROID_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY')
const APP_URL = 'https://leonardodimario.github.io/RubyChan/'

const db = SERVICE_KEY ? createClient(SUPABASE_URL, SERVICE_KEY) : null
const authDb = ANON_KEY ? createClient(SUPABASE_URL, ANON_KEY) : db

async function telegram(method: string, payload: Record<string, unknown>) {
  if (!BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not configured')
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return await response.json()
}

function buttons(rows: Record<string, unknown>[][]) { return { inline_keyboard: rows } }
async function send(chatId: number, text: string, markup?: unknown) {
  return telegram('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', ...(markup ? { reply_markup: markup } : {}) })
}

async function linkTelegramProfile(req: Request, body: any) {
  if (!db) return Response.json({ ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY is not configured' }, { status: 500 })

  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim()
  const chatId = String(body?.telegram_chat_id || '').trim()
  const characterId = String(body?.character_id || '').trim()

  console.log('Telegram link request:', { hasToken: !!token, tokenLength: token.length, chatId, characterId })

  if (!token) return Response.json({ ok: false, error: 'Missing authorization' }, { status: 401 })
  if (!chatId) return Response.json({ ok: false, error: 'Missing telegram_chat_id' }, { status: 400 })

  // Verify the browser session using a normal Supabase client when the anon/publishable
  // key is available. Fall back to the service-role client for projects that do not expose
  // a separate anon secret to Edge Functions.
  const { data: authData, error: authError } = await authDb!.auth.getUser(token)
  console.log('Telegram link auth result:', { userId: authData?.user?.id || null, authError: authError?.message || null })

  if (authError || !authData?.user) {
    console.error('Telegram link auth error:', authError)
    return Response.json({ ok: false, error: 'Invalid session' }, { status: 401 })
  }

  const userId = authData.user.id
  const { data: profile, error: profileError } = await db
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  console.log('Telegram link profile lookup:', { userId, profileId: profile?.id || null, profileError: profileError?.message || null })

  if (profileError) {
    console.error('Telegram profile lookup error:', profileError)
    return Response.json({ ok: false, error: 'Profile lookup failed' }, { status: 500 })
  }
  if (!profile) return Response.json({ ok: false, error: 'Profile not found', user_id: userId }, { status: 404 })

  const { data: updatedRows, error: updateError } = await db
    .from('profiles')
    .update({ telegram_chat_id: chatId, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select('id,telegram_chat_id')

  console.log('Telegram profile update result:', { updatedRows, updateError: updateError?.message || null })

  if (updateError) {
    console.error('Telegram profile update error:', updateError)
    return Response.json({ ok: false, error: 'Profile update failed' }, { status: 500 })
  }
  if (!updatedRows?.length) return Response.json({ ok: false, error: 'Profile update affected 0 rows', user_id: userId }, { status: 500 })

  if (characterId) {
    const { data: character } = await db.from('characters').select('id').eq('id', characterId).maybeSingle()
    if (character?.id) {
      const { error: sessionError } = await db
        .from('telegram_sessions')
        .upsert({ telegram_chat_id: chatId, character_id: character.id, updated_at: new Date().toISOString() }, { onConflict: 'telegram_chat_id' })
      if (sessionError) {
        console.error('Telegram character session update error:', sessionError)
        return Response.json({ ok: false, error: 'Character session update failed' }, { status: 500 })
      }
    }
  }

  console.log('Telegram account linked:', { userId, chatId, characterId: characterId || null })
  return Response.json({ ok: true, user_id: userId, telegram_chat_id: chatId })
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return new Response('OK')
    const update = await req.json()
    if (update?.action === 'link_telegram') return await linkTelegramProfile(req, update)

    const callback = update.callback_query
    const incoming = update.message
    const chatId = Number(callback?.message?.chat?.id ?? incoming?.chat?.id)
    if (!chatId) return new Response('OK')

    if (callback) {
      await telegram('answerCallbackQuery', { callback_query_id: callback.id })
      if (callback.data === 'choose') return Response.json(await send(chatId, '✨ <b>Choose your Ruby Chan character</b>\n\nOpen the app and choose your AI companion.', buttons([[{ text: '💜 Choose Characters', web_app: { url: `${APP_URL}?telegram=1&telegram_chat_id=${encodeURIComponent(String(chatId))}` } }]])))
      if (callback.data?.startsWith('character:')) {
        const characterId = callback.data.slice('character:'.length)
        if (db) await db.from('telegram_sessions').upsert({ telegram_chat_id: String(chatId), character_id: characterId, updated_at: new Date().toISOString() }, { onConflict: 'telegram_chat_id' })
        return Response.json(await send(chatId, '💜 <b>Character selected!</b>\n\nOpen Ruby Chan once to connect your account. Then you can chat here.', buttons([[{ text: '💜 Connect Ruby Chan', web_app: { url: `${APP_URL}?telegram=1&telegram_chat_id=${encodeURIComponent(String(chatId))}&character_id=${encodeURIComponent(characterId)}` } }]])))
      }
      if (callback.data === 'recharge') return Response.json(await send(chatId, '⚡ Your Energy is empty. Recharge in the Ruby Chan app.', buttons([[{ text: '💎 Recharge Energy', web_app: { url: `${APP_URL}#recharge` } }]])))
      return new Response('OK')
    }

    const text = String(incoming?.text ?? '').trim()
    if (text === '/start' || text.startsWith('/start ')) {
      const payload = text.substring(6).trim()
      const characterId = payload.startsWith('character_') ? payload.slice('character_'.length) : ''
      if (characterId && db) {
        const { data: character } = await db.from('characters').select('id,name,ai_id').eq('id', characterId).maybeSingle()
        if (character?.id) {
          await db.from('telegram_sessions').upsert({ telegram_chat_id: String(chatId), character_id: character.id, updated_at: new Date().toISOString() }, { onConflict: 'telegram_chat_id' })
          return Response.json(await send(chatId, `✨ <b>${character.name}</b>\n\nYour character is ready. 💜\n\nOpen Ruby Chan once to connect your account. After that, send your messages here on Telegram.`, buttons([[{ text: '💜 Connect Ruby Chan', web_app: { url: `${APP_URL}?telegram=1&telegram_chat_id=${encodeURIComponent(String(chatId))}&character_id=${encodeURIComponent(character.id)}` } }]])))
        }
      }
      return Response.json(await send(chatId, '🌸 <b>Welcome from Ruby Chan</b>\n\nMeet your AI companions and choose the one you want to chat with.', buttons([[{ text: '✨ Choose Characters', web_app: { url: `${APP_URL}?telegram=1&telegram_chat_id=${encodeURIComponent(String(chatId))}` } }]])))
    }

    if (text === '/help') { await send(chatId, '🌸 <b>Ruby Chan</b>\n\n✨ Choose a character\n⚡ 1 message = 1 Energy\n💎 Recharge when Energy reaches 0'); return new Response('OK') }
    if (!db) { await send(chatId, '⚠️ Telegram database connection is not configured.'); return new Response('OK') }

    const { data: session } = await db.from('telegram_sessions').select('character_id').eq('telegram_chat_id', String(chatId)).maybeSingle()
    if (!session?.character_id) { await send(chatId, '✨ Choose a character first.', buttons([[{ text: '💜 Choose Characters', callback_data: 'choose' }]])); return new Response('OK') }
    const { data: character } = await db.from('characters').select('id,name,ai_id').eq('id', session.character_id).maybeSingle()
    if (!character?.ai_id) { await send(chatId, '⚠️ This character is not connected to an AI yet.'); return new Response('OK') }
    const { data: profile } = await db.from('profiles').select('id,energy').eq('telegram_chat_id', String(chatId)).maybeSingle()
    if (!profile) { await send(chatId, '🔐 <b>Connect your Ruby Chan account first.</b>\n\nOpen Ruby Chan, login, and then come back here.', buttons([[{ text: '💜 Connect Ruby Chan', web_app: { url: `${APP_URL}?telegram=1&telegram_chat_id=${encodeURIComponent(String(chatId))}&character_id=${encodeURIComponent(String(character.id))}` } }]])); return new Response('OK') }
    const energy = Number(profile.energy ?? 0)
    if (energy <= 0) { await send(chatId, '⚡ <b>Your Energy is empty.</b>\n\nRecharge to continue chatting.', buttons([[{ text: '💎 Recharge Energy', web_app: { url: `${APP_URL}#recharge` } }]])); return new Response('OK') }
    if (!KINDROID_KEY) { await send(chatId, '⚠️ AI service is not configured.'); return new Response('OK') }
    await telegram('sendChatAction', { chat_id: chatId, action: 'typing' })
    const aiResponse = await fetch('https://api.kindroid.ai/v1/send-message', { method: 'POST', headers: { Authorization: `Bearer ${KINDROID_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ ai_id: character.ai_id, message: text, stream: false }) })
    const raw = await aiResponse.text()
    if (!aiResponse.ok) { console.error('Kindroid error:', raw); await send(chatId, '⚠️ Ruby Chan could not reach the AI right now. Your Energy was not used.'); return new Response('OK') }
    let reply = raw
    try { const parsed = JSON.parse(raw); reply = parsed.reply ?? parsed.message ?? parsed.response ?? parsed.text ?? raw } catch (_) {}
    const nextEnergy = Math.max(0, energy - 1)
    await db.from('profiles').update({ energy: nextEnergy, updated_at: new Date().toISOString() }).eq('id', profile.id)
    await send(chatId, `<b>${character.name}</b>\n\n${String(reply).trim()}`)
    if (nextEnergy === 0) await send(chatId, '⚡ <b>You are out of Energy.</b>\n\nRecharge to continue chatting.', buttons([[{ text: '💎 Recharge Energy', web_app: { url: `${APP_URL}#recharge` } }]]))
    return new Response('OK')
  } catch (error) {
    console.error('bright-api error:', error)
    return new Response(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : 'Unknown error' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
})
