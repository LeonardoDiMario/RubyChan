/* Ruby Chan — Telegram handoff + account linking */
(function () {
  'use strict';

  const BOT_USERNAME = String(window.RUBY_TELEGRAM_BOT_USERNAME || 'Rubby_Chan_Bot').replace(/^@/, '');
  const TELEGRAM_LINK_FUNCTION = 'https://hcbajvladlvhklelbxdr.supabase.co/functions/v1/bright-api';
  const getClient = () => window.rubySupabase || window.supabaseClient || null;

  function telegramWebApp() {
    try { return window.Telegram?.WebApp || null; } catch { return null; }
  }

  function getTelegramContext() {
    const params = new URLSearchParams(window.location.search);
    const tg = telegramWebApp();
    const tgUser = tg?.initDataUnsafe?.user;
    return {
      chatId: params.get('telegram_chat_id') || (tgUser?.id ? String(tgUser.id) : ''),
      characterId: params.get('character_id') || '',
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
      const r = await fetch(TELEGRAM_LINK_FUNCTION, {
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
      telegramWebApp()?.ready?.();
      return true;
    } catch (e) {
      console.warn('Telegram account link request failed:', e);
      return false;
    }
  }

  function premiumButtonStyles() {
    if (document.getElementById('ruby-telegram-premium-style')) return;
    const style = document.createElement('style');
    style.id = 'ruby-telegram-premium-style';
    style.textContent = `
      .ruby-telegram-btn{position:relative;display:flex;align-items:center;justify-content:center;gap:9px;width:100%;margin-top:10px;padding:12px 16px;border:1px solid rgba(255,220,120,.55);border-radius:14px;background:linear-gradient(135deg,#6d35d9 0%,#9a55e8 48%,#d9a63a 100%);color:#fff;font:800 13px/1.1 Arial,sans-serif;letter-spacing:.15px;box-shadow:0 8px 24px rgba(111,53,217,.32),inset 0 1px rgba(255,255,255,.3);cursor:pointer;overflow:hidden;transition:transform .18s ease,box-shadow .18s ease;}
      .ruby-telegram-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(110deg,transparent 25%,rgba(255,255,255,.28) 48%,transparent 68%);transform:translateX(-110%);transition:transform .65s ease;}
      .ruby-telegram-btn:hover{transform:translateY(-1px);box-shadow:0 12px 30px rgba(111,53,217,.42),inset 0 1px rgba(255,255,255,.35);}
      .ruby-telegram-btn:hover::before{transform:translateX(110%);}
      .ruby-telegram-btn .tg-crown{font-size:13px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.25));}
      .ruby-telegram-btn .tg-plane{font-size:17px;line-height:1;}
      .ruby-telegram-btn .tg-premium{font-size:9px;padding:3px 6px;border-radius:999px;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.35);letter-spacing:.7px;}
    `;
    document.head.appendChild(style);
  }

  function openTelegram(character) {
    const id = character?.id || character?.character_id;
    if (!id) return;
    const payload = `character_${String(id).replace(/[^a-zA-Z0-9_-]/g, '')}`;
    window.location.href = `https://t.me/${BOT_USERNAME}?start=${encodeURIComponent(payload)}`;
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
    premiumButtonStyles();
    const cards = document.querySelectorAll('.character-card');
    for (const card of cards) {
      if (card.querySelector('.ruby-telegram-btn')) continue;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ruby-telegram-btn';
      btn.innerHTML = '<span class="tg-plane">✈️</span><span>Chat on Telegram</span><span class="tg-premium">PREMIUM</span><span class="tg-crown">♛</span>';
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
    telegramWebApp()?.ready?.();
    telegramWebApp()?.expand?.();
    addButtons();
    let attempts = 0;
    const tryLink = async () => {
      attempts++;
      const ok = await linkTelegramAccount();
      if (!ok && attempts < 12) setTimeout(tryLink, 1000);
    };
    tryLink();
    const client = getClient();
    if (client?.auth?.onAuthStateChange) client.auth.onAuthStateChange(() => setTimeout(linkTelegramAccount, 150));
    if (document.body) new MutationObserver(addButtons).observe(document.body, { childList: true, subtree: true });
  }

  window.rubyOpenTelegram = openTelegram;
  window.rubyTelegramUrl = id => `https://t.me/${BOT_USERNAME}?start=${encodeURIComponent('character_' + id)}`;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
