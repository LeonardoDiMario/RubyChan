import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BOT = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SECRET_KEY')
const KINDROID_API_KEY = Deno.env.get('KINDROID_API_KEY')
const APP_URL = Deno.env.get('RUBY_CHAN_APP_URL') || 'https://leonardodimario.github.io/RubyChan/'

const db = SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY) : null

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function tg(method: string, body: Record<string, unknown>) {
  const r = await fetch(`https://api.telegram.org/bot${BOT}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  return await r.json()
}

const keyboard = (rows: unknown[][]) => ({ inline_keyboard: rows })

async function send(chat_id: number, text: string, reply_markup?: unknown) {
  return tg('sendMessage', {
    chat_id,
    text,
    parse_mode: 'HTML',
    ...(reply_markup ? { reply_markup } : {}),
  })
}

async function getAuthenticatedUser(req: Request) {
  if (!db) return null
  const header = req.headers.get('authorization') || req.headers.get('Authorization') || ''
  const token = header.replace(/^Bearer\s+/i, '').trim()
  if (!token) return null

  const { data, error } = await db.auth.getUser(token)
  if (error || !data?.user) {
    console.error('Authenticated user lookup failed:', error)
    return null
  }
  return data.user
}

async function linkTelegramAccount(req: Request, body: any) {
  if (!db) {
    return new Response(JSON.stringify({ ok: false, error: 'Server setup incomplete' }), {
      status: 500,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    })
  }

  const user = await getAuthenticatedUser(req)
  if (!user) {
    return new Response(JSON.stringify({ ok: false, error: 'Authentication required' }), {
      status: 401,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    })
  }

  const telegramChatId = String(body.telegram_chat_id || '').trim()
  const characterId = body.character_id ? String(body.character_id) : null

  if (!telegramChatId) {
    return new Response(JSON.stringify({ ok: false, error: 'telegram_chat_id is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    })
  }

  const { data: profile, error: profileLookupError } = await db
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (profileLookupError) {
    console.error('Profile lookup error:', profileLookupError)
    return new Response(JSON.stringify({ ok: false, error: 'Could not load profile' }), {
      status: 500,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    })
  }

  if (!profile) {
    return new Response(JSON.stringify({ ok: false, error: 'Ruby Chan profile not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    })
  }

  const { error: profileUpdateError } = await db
    .from('profiles')
    .update({
      telegram_chat_id: telegramChatId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (profileUpdateError) {
    console.error('Telegram profile connection error:', profileUpdateError)
    return new Response(JSON.stringify({ ok: false, error: 'Could not connect Telegram account' }), {
      status: 500,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    })
  }

  if (characterId) {
    const { data: character } = await db
      .from('characters')
      .select('id')
      .eq('id', characterId)
      .maybeSingle()

    if (character) {
      const { data: existingSession } = await db
        .from('telegram_sessions')
        .select('id')
        .eq('telegram_chat_id', telegramChatId)
        .maybeSingle()

      if (existingSession?.id) {
        await db
          .from('telegram_sessions')
          .update({
            character_id: character.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSession.id)
      } else {
        await db.from('telegram_sessions').insert({
          telegram_chat_id: telegramChatId,
          character_id: character.id,
        })
      }
    }
  }

  return new Response(JSON.stringify({ ok: true, linked: true }), {
    status: 200,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  })
}

async function saveTelegramCharacter(chatId: number, characterId: string) {
  if (!db) return false

  const chat = String(chatId)
  const { data: existing } = await db
    .from('telegram_sessions')
    .select('id')
    .eq('telegram_chat_id', chat)
    .maybeSingle()

  if (existing?.id) {
    const { error } = await db
      .from('telegram_sessions')
      .update({
        character_id: characterId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
    if (error) console.error('Telegram session update error:', error)
    return !error
  }

  const { error } = await db.from('telegram_sessions').insert({
    telegram_chat_id: chat,
    character_id: characterId,
  })
  if (error) console.error('Telegram session insert error:', error)
  return !error
}

async function getTelegramCharacter(chatId: number) {
  if (!db) return null
  const { data, error } = await db
    .from('telegram_sessions')
    .select('character_id')
    .eq('telegram_chat_id', String(chatId))
    .maybeSingle()

  if (error) console.error('Telegram session lookup error:', error)
  return data?.character_id || null
}

async function getProfile(chatId: number) {
  if (!db) return null
  const { data, error } = await db
    .from('profiles')
    .select('id, username, energy, gems, premium_plan, premium_expires_at')
    .eq('telegram_chat_id', String(chatId))
    .maybeSingle()

  if (error) console.error('Profile lookup error:', error)
  return data
}

async function handleStart(chatId: number, payload: string) {
  let characterId: string | null = null

  if (payload.startsWith('character_')) {
    characterId = payload.substring('character_'.length)
  }

  if (characterId) {
    const { data: character, error } = await db!
      .from('characters')
      .select('id, name, ai_id')
      .eq('id', characterId)
      .maybeSingle()

    if (!error && character) {
      await saveTelegramCharacter(chatId, character.id)
      await send(
        chatId,
        `✨ <b>${character.name}</b>\n\nYour character is ready. 💜\n\n` +
          `If your Ruby Chan account is already connected, you can start chatting now. ` +
          `Otherwise open Ruby Chan and login once to connect this Telegram account.`,
        keyboard([[
          {
            text: '💜 Open Ruby Chan',
            web_app: {
              url:
                `${APP_URL}?telegram=1` +
                `&telegram_chat_id=${encodeURIComponent(String(chatId))}` +
                `&character_id=${encodeURIComponent(character.id)}`,
            },
          },
        ]]),
      )
      return
    }
  }

  await send(
    chatId,
    `🌸 <b>Welcome from Ruby Chan</b>\n\n` +
      `Choose your AI character and start your private conversation. ✨`,
    keyboard([[
      {
        text: '✨ Choose Characters',
        web_app: {
          url: `${APP_URL}?telegram=1&telegram_chat_id=${encodeURIComponent(String(chatId))}`,
        },
      },
    ]]),
  )
}

async function handleMessage(chatId: number, text: string) {
  const profile = await getProfile(chatId)

  if (!profile) {
    await send(
      chatId,
      `🔐 <b>Connect your Ruby Chan account first.</b>\n\n` +
        `Open the app and login to your Ruby Chan account.`,
      keyboard([[
        {
          text: '💜 Open Ruby Chan',
          web_app: {
            url: `${APP_URL}?telegram=1&telegram_chat_id=${encodeURIComponent(String(chatId))}`,
          },
        },
      ]]),
    )
    return
  }

  const energy = Number(profile.energy ?? 0)
  if (energy <= 0) {
    await send(
      chatId,
      `⚡ <b>You're out of Energy.</b>\n\nRecharge your Energy in Ruby Chan to continue chatting. 💜`,
      keyboard([[
        {
          text: '💎 Recharge Energy',
          web_app: { url: `${APP_URL}?page=payment&telegram=1` },
        },
      ]]),
    )
    return
  }

  const characterId = await getTelegramCharacter(chatId)
  if (!characterId) {
    await send(
      chatId,
      `✨ <b>Choose a character first.</b>\n\nOpen Ruby Chan and select the AI character you want to chat with.`,
      keyboard([[
        {
          text: '✨ Choose Characters',
          web_app: { url: `${APP_URL}?telegram=1&telegram_chat_id=${encodeURIComponent(String(chatId))}` },
        },
      ]]),
    )
    return
  }

  const { data: character, error: characterError } = await db!
    .from('characters')
    .select('id, name, ai_id')
    .eq('id', characterId)
    .maybeSingle()

  if (characterError || !character) {
    console.error('Character lookup error:', characterError)
    await send(chatId, '❌ Character unavailable. Please choose another character.')
    return
  }

  if (!character.ai_id) {
    await send(chatId, `❌ <b>${character.name}</b> is not connected to an AI yet.`)
    return
  }

  if (!KINDROID_API_KEY) {
    console.error('KINDROID_API_KEY is missing')
    await send(chatId, '❌ AI service is currently unavailable.')
    return
  }

  await tg('sendChatAction', { chat_id: chatId, action: 'typing' })

  const aiResponse = await fetch('https://api.kindroid.ai/v1/send-message', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${KINDROID_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      ai_id: character.ai_id,
      message: text,
      stream: false,
    }),
  })

  const aiText = await aiResponse.text()
  if (!aiResponse.ok) {
    console.error('Kindroid API error:', aiText)
    await send(chatId, `❌ I couldn't reply right now.\n\nYour Energy was not used.`)
    return
  }

  let reply = aiText
  try {
    const parsed = JSON.parse(aiText)
    reply = parsed.reply ?? parsed.message ?? parsed.response ?? parsed.text ?? aiText
  } catch {
    // Plain text response.
  }

  reply = String(reply || '').trim()
  if (!reply) {
    await send(chatId, '❌ The AI returned an empty response.')
    return
  }

  const newEnergy = Math.max(0, energy - 1)
  const { error: energyError } = await db!
    .from('profiles')
    .update({
      energy: newEnergy,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profile.id)

  if (energyError) {
    console.error('Energy update error:', energyError)
  }

  await send(chatId, `<b>${character.name}</b>\n\n${reply}`)

  if (newEnergy <= 0) {
    await send(
      chatId,
      `⚡ <b>You're out of Energy.</b>\n\nRecharge to continue your conversation. 💜`,
      keyboard([[
        {
          text: '💎 Recharge Energy',
          web_app: { url: `${APP_URL}?page=payment&telegram=1` },
        },
      ]]),
    )
  }
}

async function handleUpdate(update: any) {
  const message = update?.message
  if (!message?.chat?.id) return

  const chatId = Number(message.chat.id)
  const text = String(message.text || '').trim()
  if (!text) return

  if (text === '/start' || text.startsWith('/start ')) {
    await handleStart(chatId, text.substring(6).trim())
    return
  }

  if (text.startsWith('/')) return
  await handleMessage(chatId, text)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'POST required' }), {
      status: 405,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    })
  }

  try {
    const body = await req.json()

    // The function must have JWT verification OFF because Telegram cannot
    // provide a Supabase JWT. App-to-function account linking is protected
    // here by validating the user's Bearer access token manually.
    if (body?.action === 'link_telegram') {
      return await linkTelegramAccount(req, body)
    }

    await handleUpdate(body)

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    })
  } catch (error) {
    console.error('telegram-bot error:', error)
    return new Response(JSON.stringify({ ok: false, error: 'Internal error' }), {
      status: 200,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    })
  }
})
