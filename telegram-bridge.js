/* Ruby Chan — Telegram handoff + account linking */
(function () {
  'use strict';

  const BOT_USERNAME = String(window.RUBY_TELEGRAM_BOT_USERNAME || 'Rubby_Chan_Bot').replace(/^@/, '');
  const TELEGRAM_LINK_FUNCTION = 'https://hcbajvladlvhklelbxdr.supabase.co/functions/v1/bright-api';
  const getClient = () => window.rubySupabase || window.supabaseClient || null;

  function telegramWebApp() { try { return window.Telegram?.WebApp || null; } catch { return null; } }

  function getTelegramContext() {
    const params = new URLSearchParams(window.location.search);
    const tgUser = telegramWebApp()?.initDataUnsafe?.user;
    return { chatId: params.get('telegram_chat_id') || (tgUser?.id ? String(tgUser.id) : ''), characterId: params.get('character_id') || '' };
  }

  async function getSession() {
    const client = getClient();
    if (!client?.auth?.getSession) return null;
    try { const { data } = await client.auth.getSession(); return data?.session || null; } catch { return null; }
  }

  function markLinked(ctx) {
    localStorage.setItem('rubychan_telegram_linked', '1');
    localStorage.setItem('rubychan_telegram_chat_id', ctx.chatId);
    if (ctx.characterId) localStorage.setItem('rubychan_telegram_character_id', ctx.characterId);
    telegramWebApp()?.ready?.();
  }

  async function linkTelegramAccount() {
    const client = getClient();
    const ctx = getTelegramContext();
    const session = await getSession();
    if (!client || !ctx.chatId || !session?.user?.id || !session?.access_token) return false;

    try {
      const r = await fetch(TELEGRAM_LINK_FUNCTION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'link_telegram', telegram_chat_id: ctx.chatId, character_id: ctx.characterId || null }),
      });
      const result = await r.json().catch(() => ({}));
      console.log('Telegram account link:', r.status, result);
      if (r.ok && result?.ok) { markLinked(ctx); return true; }
      console.warn('bright-api link failed; trying direct authenticated Supabase update');
    } catch (e) { console.warn('bright-api link failed:', e); }

    try {
      const { error: profileError } = await client.from('profiles').update({ telegram_chat_id: String(ctx.chatId), updated_at: new Date().toISOString() }).eq('id', session.user.id);
      if (profileError) { console.warn('Direct profile link failed:', profileError); return false; }

      if (ctx.characterId) {
        const { error: sessionError } = await client.from('telegram_sessions').upsert({ telegram_chat_id: String(ctx.chatId), character_id: ctx.characterId, updated_at: new Date().toISOString() }, { onConflict: 'telegram_chat_id' });
        if (sessionError) console.warn('Direct character link failed:', sessionError);
      }

      markLinked(ctx);
      console.log('Telegram account link: direct Supabase fallback succeeded');
      return true;
    } catch (e) { console.warn('Direct Supabase link failed:', e); return false; }
  }

  function telegramButtonStyles() {
    if (document.getElementById('ruby-telegram-style')) return;
    const style = document.createElement('style'); style.id = 'ruby-telegram-style';
    style.textContent = `.ruby-telegram-btn{position:relative;display:flex;align-items:center;justify-content:center;gap:9px;width:100%;margin-top:10px;padding:12px 16px;border:1px solid rgba(124,58,237,.22);border-radius:14px;background:linear-gradient(135deg,#6d28d9,#a855f7);color:#fff;font:800 13px/1.1 Arial,sans-serif;letter-spacing:.15px;box-shadow:0 8px 24px rgba(111,53,217,.22);cursor:pointer;overflow:hidden;transition:transform .18s ease,box-shadow .18s ease}.ruby-telegram-btn:hover{transform:translateY(-1px);box-shadow:0 12px 30px rgba(111,53,217,.30)}.ruby-telegram-btn .tg-plane{font-size:17px}`;
    document.head.appendChild(style);
  }

  function openTelegram(character) { const id = character?.id || character?.character_id; if (!id) return; window.location.href = `https://t.me/${BOT_USERNAME}?start=${encodeURIComponent('character_' + String(id).replace(/[^a-zA-Z0-9_-]/g, ''))}`; }
  function openTelegramHistory() { window.location.href = `https://t.me/${BOT_USERNAME}`; }

  async function characterFromCard(card) {
    const id = card.dataset.characterId || card.dataset.character || card.dataset.id;
    const name = card.dataset.characterName || card.getAttribute('data-character-name') || card.querySelector('h3')?.textContent?.trim() || '';
    if (id) return { id, name };
    const client = getClient();
    if (client?.from && name) { const { data } = await client.from('characters').select('id,name,ai_id').eq('name', name).maybeSingle(); return data || null; }
    return null;
  }

  async function addButtons() {
    telegramButtonStyles();
    for (const card of document.querySelectorAll('.character-card')) {
      if (card.querySelector('.ruby-telegram-btn')) continue;
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'ruby-telegram-btn';
      btn.innerHTML = '<span class="tg-plane">✈️</span><span>Chat on Telegram</span>';
      btn.onclick = async e => { e.preventDefault(); e.stopPropagation(); const character = await characterFromCard(card); if (character?.id) openTelegram(character); };
      card.appendChild(btn);
    }
  }

  function addHistoryStyles() {
    if (document.getElementById('ruby-unified-history-style')) return;
    const style = document.createElement('style');
    style.id = 'ruby-unified-history-style';
    style.textContent = `
      .ruby-history-source{display:inline-flex;align-items:center;gap:4px;margin-left:7px;padding:3px 7px;border-radius:999px;background:#f1eaff;color:#6d28d9;font-size:9px;font-weight:800;vertical-align:middle}
      .ruby-telegram-history{border-color:rgba(124,58,237,.16)!important}
      .ruby-telegram-history .chat-history-preview{color:#6d28d9}
    `;
    document.head.appendChild(style);
  }

  function buildUnifiedHistory() {
    addHistoryStyles();
    const list = document.querySelector('.chat-history-list');
    if (!list || list.dataset.rubyUnifiedHistory === '1') return;

    const platformItems = Array.from(list.querySelectorAll('.chat-history-item')).filter(item => !item.classList.contains('ruby-telegram-history'));
    if (!platformItems.length) return;

    list.dataset.rubyUnifiedHistory = '1';

    platformItems.forEach((item, index) => {
      const title = item.querySelector('.chat-history-name');
      if (title && !title.querySelector('.ruby-history-source')) {
        const source = document.createElement('span');
        source.className = 'ruby-history-source';
        source.textContent = 'Platform';
        title.appendChild(source);
      }

      const telegramItem = item.cloneNode(true);
      telegramItem.classList.add('ruby-telegram-history');
      telegramItem.dataset.rubyTelegramHistory = '1';
      telegramItem.removeAttribute('onclick');

      const tgTitle = telegramItem.querySelector('.chat-history-name');
      if (tgTitle) {
        tgTitle.childNodes.forEach(node => { if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.trim(); });
        const source = document.createElement('span');
        source.className = 'ruby-history-source';
        source.textContent = 'Telegram';
        tgTitle.appendChild(source);
      }

      const preview = telegramItem.querySelector('.chat-history-preview');
      if (preview) preview.textContent = 'Continue your Telegram conversation';

      const time = telegramItem.querySelector('.chat-history-time');
      if (time) time.textContent = '✈️';

      telegramItem.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        openTelegramHistory();
      });

      item.insertAdjacentElement('afterend', telegramItem);
    });
  }

  function init() {
    telegramWebApp()?.ready?.(); telegramWebApp()?.expand?.();
    addButtons();
    buildUnifiedHistory();
    let attempts = 0;
    const tryLink = async () => { attempts++; const ok = await linkTelegramAccount(); if (!ok && attempts < 20) setTimeout(tryLink, 1000); };
    tryLink();
    const client = getClient();
    if (client?.auth?.onAuthStateChange) client.auth.onAuthStateChange(() => setTimeout(linkTelegramAccount, 150));
    if (document.body) new MutationObserver(() => { addButtons(); buildUnifiedHistory(); }).observe(document.body, { childList: true, subtree: true });
  }

  window.rubyOpenTelegram = openTelegram;
  window.rubyOpenTelegramHistory = openTelegramHistory;
  window.rubyTelegramUrl = id => `https://t.me/${BOT_USERNAME}?start=${encodeURIComponent('character_' + id)}`;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
