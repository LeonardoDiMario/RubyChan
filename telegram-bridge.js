/* Ruby Chan — Telegram handoff + account linking */
(function () {
  'use strict';

  const BOT_USERNAME = String(window.RUBY_TELEGRAM_BOT_USERNAME || 'Rubby_Chan_Bot').replace(/^@/, '');
  const TELEGRAM_FUNCTION = 'https://hcbajvladlvhklelbxdr.supabase.co/functions/v1/telegram-bot';

  const getClient = () => window.supabaseClient || window.rubySupabase || null;

  function telegramWebApp() {
    try {
      return window.Telegram?.WebApp || null;
    } catch {
      return null;
    }
  }

  function getTelegramContext() {
    const params = new URLSearchParams(window.location.search);
    const tg = telegramWebApp();
    const tgUser = tg?.initDataUnsafe?.user;

    return {
      chatId: params.get('telegram_chat_id') || (tgUser?.id ? String(tgUser.id) : ''),
      characterId: params.get('character_id') || '',
      isTelegramWebApp: Boolean(tgUser?.id),
    };
  }

  async function getSession() {
    const client = getClient();
    if (!client?.auth?.getSession) return null;
    try {
      const { data, error } = await client.auth.getSession();
      if (error) console.warn('Telegram link: getSession', error);
      return data?.session || null;
    } catch (e) {
      console.warn('Telegram link: session error', e);
      return null;
    }
  }

  async function linkTelegramAccount() {
    const ctx = getTelegramContext();
    if (!ctx.chatId) return false;

    const session = await getSession();
    if (!session?.access_token) return false;

    try {
      const r = await fetch(TELEGRAM_FUNCTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'link_telegram',
          telegram_chat_id: ctx.chatId,
          character_id: ctx.characterId || null,
        }),
      });

      const result = await r.json().catch(() => ({}));
      console.log('Telegram account link:', r.status, result);

      if (!r.ok || !result?.ok) return false;

      localStorage.setItem('rubychan_telegram_linked', '1');
      localStorage.setItem('rubychan_telegram_chat_id', ctx.chatId);
      if (ctx.characterId) localStorage.setItem('rubychan_telegram_character_id', ctx.characterId);

      // When opened inside Telegram, tell Telegram to close the WebApp.
      // Do NOT navigate back to /start — that was causing the apparent loop.
      const tg = telegramWebApp();
      if (tg?.ready) tg.ready();

      return true;
    } catch (e) {
      console.warn('Telegram account link request failed:', e);
      return false;
    }
  }

  function openTelegram(character) {
    const id = character?.id || character?.character_id;
    if (!id) return;
    const payload = `character_${String(id).replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const url = `https://t.me/${BOT_USERNAME}?start=${encodeURIComponent(payload)}`;
    window.location.href = url;
  }

  async function characterFromCard(card) {
    const id = card.dataset.characterId || card.dataset.character || card.dataset.id;
    const name = card.dataset.characterName || card.getAttribute('data-character-name') || card.querySelector('h3')?.textContent?.trim() || '';
    if (id) return { id, name };

    const client = getClient();
    if (client?.from && name) {
      const { data } = await client.from('characters').select('id,name,ai_id').eq('name', name).maybeSingle();
      return data || null;
    }
    return null;
  }

  async function addButtons() {
    const cards = document.querySelectorAll('.character-card');
    for (const card of cards) {
      if (card.querySelector('.ruby-telegram-btn')) continue;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ruby-telegram-btn';
      btn.textContent = '✈️ Chat on Telegram';
      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const character = await characterFromCard(card);
        if (character?.id) openTelegram(character);
      };
      card.appendChild(btn);
    }
  }

  function init() {
    // Telegram WebApp gives us the real Telegram user/chat id. This is more
    // reliable than relying only on a URL query parameter.
    const tg = telegramWebApp();
    if (tg?.ready) tg.ready();
    if (tg?.expand) tg.expand();

    addButtons();

    // Auth may restore the Supabase session asynchronously. Keep trying until
    // the session exists, then link the current Telegram account exactly once.
    let attempts = 0;
    const tryLink = async () => {
      attempts++;
      const ok = await linkTelegramAccount();
      if (!ok && attempts < 12) setTimeout(tryLink, 1000);
    };
    tryLink();

    const client = getClient();
    if (client?.auth?.onAuthStateChange) {
      client.auth.onAuthStateChange(() => setTimeout(linkTelegramAccount, 150));
    }

    if (document.body) {
      new MutationObserver(addButtons).observe(document.body, { childList: true, subtree: true });
    }
  }

  window.rubyOpenTelegram = openTelegram;
  window.rubyTelegramUrl = id => `https://t.me/${BOT_USERNAME}?start=${encodeURIComponent('character_' + id)}`;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
