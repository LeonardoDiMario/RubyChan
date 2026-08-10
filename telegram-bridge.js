/* Ruby Chan — Telegram handoff
 * App selects a character, Telegram becomes the actual chat surface.
 * The bridge is intentionally independent from the app's existing chat button.
 */
(function () {
  'use strict';

  const BOT_USERNAME = String(
    window.RUBY_TELEGRAM_BOT_USERNAME || 'Rubby_Chan_Bot'
  ).replace(/^@/, '');

  function ensureStyles() {
    if (document.getElementById('ruby-telegram-bridge-style')) return;

    const style = document.createElement('style');
    style.id = 'ruby-telegram-bridge-style';
    style.textContent = `
      .ruby-telegram-btn{
        width:100%;
        margin-top:8px;
        padding:11px 13px;
        border:0;
        border-radius:12px;
        background:linear-gradient(135deg,#229ed9,#168acd);
        color:#fff;
        font-weight:800;
        cursor:pointer;
        box-shadow:0 8px 20px rgba(34,158,217,.22);
      }
      .ruby-telegram-btn:active{transform:scale(.98)}
      .ruby-telegram-handoff{
        position:fixed;
        inset:0;
        z-index:100000;
        display:none;
        align-items:center;
        justify-content:center;
        background:rgba(8,7,15,.55);
        backdrop-filter:blur(12px);
        padding:20px;
      }
      .ruby-telegram-handoff.show{display:flex}
      .ruby-telegram-box{
        width:min(390px,100%);
        padding:25px;
        border-radius:24px;
        background:linear-gradient(160deg,#fff,#faf5ff);
        box-shadow:0 24px 80px rgba(0,0,0,.28);
        text-align:center;
      }
      .ruby-telegram-icon{font-size:42px;margin-bottom:8px}
      .ruby-telegram-box h3{font-size:21px;margin-bottom:6px}
      .ruby-telegram-box p{font-size:13px;color:#777;line-height:1.55;margin-bottom:18px}
    `;
    document.head.appendChild(style);
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

    const cleanId = String(id).replace(/[^a-zA-Z0-9_-]/g, '');
    const payload = `character_${cleanId}`;
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

    // Best case: the card already exposes the database ID.
    if (id) return { id, name };

    // Fallback: resolve the card's displayed character name from Supabase.
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

      // Do NOT require .chat-btn. Some versions of Ruby Chan render
      // character cards without that button, which previously prevented
      // the Telegram button from appearing at all.
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
            console.error('Ruby Telegram: could not resolve character', card);
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

      // Put the Telegram action at the bottom of every character card.
      card.appendChild(btn);
    }
  }

  const observer = new MutationObserver(() => {
    addButtons();
  });

  function init() {
    ensureStyles();
    addButtons();

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
