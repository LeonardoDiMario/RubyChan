/* Ruby Chan — Telegram handoff */
(function () {
  'use strict';

  const BOT_USERNAME = String(
    window.RUBY_TELEGRAM_BOT_USERNAME || 'Rubby_Chan_Bot'
  ).replace(/^@/, '');

  // IMPORTANT: this must match the actual Supabase Edge Function name.
  // The Telegram function is named `telegram-bot`, not `bright-api`.
  const TELEGRAM_FUNCTION =
    'https://hcbajvladlvhklelbxdr.supabase.co/functions/v1/telegram-bot';

  function ensureStyles() {
    if (document.getElementById('ruby-telegram-bridge-style')) return;
    const style = document.createElement('style');
    style.id = 'ruby-telegram-bridge-style';
    style.textContent = `
      .ruby-telegram-btn{width:100%;margin-top:8px;padding:11px 13px;border:0;border-radius:12px;background:linear-gradient(135deg,#229ed9,#168acd);color:#fff;font-weight:800;cursor:pointer;box-shadow:0 8px 20px rgba(34,158,217,.22)}
      .ruby-telegram-btn:active{transform:scale(.98)}
      .ruby-telegram-handoff{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;background:rgba(8,7,15,.55);backdrop-filter:blur(12px);padding:20px}
      .ruby-telegram-handoff.show{display:flex}
      .ruby-telegram-box{width:min(390px,100%);padding:25px;border-radius:24px;background:linear-gradient(160deg,#fff,#faf5ff);box-shadow:0 24px 80px rgba(0,0,0,.28);text-align:center}
      .ruby-telegram-icon{font-size:42px;margin-bottom:8px}
      .ruby-telegram-box h3{font-size:21px;margin-bottom:6px}
      .ruby-telegram-box p{font-size:13px;color:#777;line-height:1.55;margin-bottom:18px}
    `;
    document.head.appendChild(style);
  }

  function getTelegramParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      chatId: params.get('telegram_chat_id') || '',
      characterId: params.get('character_id') || ''
    };
  }

  async function getSession() {
    try {
      const client = window.supabaseClient || window.supabase;
      if (!client?.auth?.getSession) return null;
      const { data } = await client.auth.getSession();
      return data?.session || null;
    } catch (error) {
      console.warn('Ruby Telegram: session lookup failed', error);
      return null;
    }
  }

  async function syncTelegramAccount() {
    const { chatId, characterId } = getTelegramParams();
    if (!chatId) return false;

    const session = await getSession();
    if (!session?.access_token) return false;

    try {
      const response = await fetch(TELEGRAM_FUNCTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'link_telegram',
          telegram_chat_id: chatId,
          character_id: characterId || null
        })
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.ok) {
        console.warn('Ruby Telegram: account link failed', result);
        return false;
      }

      localStorage.setItem('rubychan_telegram_linked', '1');
      return true;
    } catch (error) {
      console.warn('Ruby Telegram: account link request failed', error);
      return false;
    }
  }

  function handoff(character) {
    ensureStyles();

    let modal = document.getElementById('rubyTelegramHandoff');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'rubyTelegramHandoff';
      modal.className = 'ruby-telegram-handoff';
      modal.innerHTML = `
        <div class="ruby-telegram-box">
          <div class="ruby-telegram-icon">✈️</div>
          <h3>Continue on Telegram</h3>
          <p id="rubyTelegramText">Opening your character in Telegram…</p>
          <button id="rubyTelegramGo" class="ruby-telegram-btn" type="button">Open Telegram</button>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('show');
      });
    }

    const id = character?.id || character?.ai_id || character?.character_id;
    const name = character?.name || character?.character_name || 'your character';

    if (!id) {
      console.error('Ruby Telegram: character id is missing', character);
      return;
    }

    const payload = `character_${String(id).replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const url = `https://t.me/${BOT_USERNAME}?start=${encodeURIComponent(payload)}`;

    modal.querySelector('#rubyTelegramText').textContent =
      `${name} is ready. Continue the conversation in Telegram.`;

    modal.querySelector('#rubyTelegramGo').onclick = () => {
      window.location.href = url;
    };

    modal.classList.add('show');
  }

  window.rubyOpenTelegram = handoff;
  window.rubyTelegramUrl = id =>
    `https://t.me/${BOT_USERNAME}?start=${encodeURIComponent('character_' + id)}`;

  async function getCharacterForCard(card) {
    const id =
      card.dataset.characterId ||
      card.dataset.character ||
      card.dataset.id ||
      card.getAttribute('data-character-id');

    const name =
      card.dataset.characterName ||
      card.getAttribute('data-character-name') ||
      card.querySelector('h3')?.textContent?.trim() ||
      card.querySelector('.character-name')?.textContent?.trim() ||
      '';

    if (id) return { id, name };

    try {
      const client = window.supabaseClient || window.supabase;
      if (client?.from && name) {
        const { data, error } = await client
          .from('characters')
          .select('id,name,ai_id')
          .eq('name', name)
          .maybeSingle();
        if (!error && data?.id) return data;
      }
    } catch (error) {
      console.warn('Ruby Telegram: character lookup failed', error);
    }

    return null;
  }

  async function addButtons() {
    ensureStyles();
    const cards = document.querySelectorAll('.character-card');

    for (const card of cards) {
      if (card.querySelector('.ruby-telegram-btn')) continue;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ruby-telegram-btn';
      btn.textContent = '✈️ Chat on Telegram';
      btn.setAttribute('aria-label', 'Chat on Telegram');

      btn.onclick = async event => {
        event.preventDefault();
        event.stopPropagation();
        btn.disabled = true;
        const oldText = btn.textContent;
        btn.textContent = 'Opening…';

        try {
          const character = await getCharacterForCard(card);
          if (!character?.id) {
            btn.textContent = 'Character unavailable';
            setTimeout(() => {
              btn.textContent = oldText;
              btn.disabled = false;
            }, 1600);
            return;
          }
          handoff(character);
        } finally {
          btn.disabled = false;
          btn.textContent = oldText;
        }
      };

      card.appendChild(btn);
    }
  }

  function init() {
    ensureStyles();
    addButtons();

    // Telegram opens the app with chat_id + character_id. Once Supabase
    // restores the logged-in session, link the Telegram chat to that profile.
    syncTelegramAccount();

    const client = window.supabaseClient || window.supabase;
    if (client?.auth?.onAuthStateChange) {
      client.auth.onAuthStateChange(() => {
        setTimeout(syncTelegramAccount, 300);
      });
    }

    if (document.body) {
      const observer = new MutationObserver(() => addButtons());
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
