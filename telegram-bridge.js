/* Ruby Chan — Telegram handoff
 * App selects a character, Telegram becomes the actual chat surface.
 * Set RUBY_TELEGRAM_BOT_USERNAME to the real Telegram bot username.
 */
(function () {
  const BOT_USERNAME = window.RUBY_TELEGRAM_BOT_USERNAME || '@Rubby_Chan_Bot';
  const APP_URL = window.location.origin + window.location.pathname;

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
      .ruby-telegram-icon{font-size:42px;margin-bottom:8px}.ruby-telegram-box h3{font-size:21px;margin-bottom:6px}.ruby-telegram-box p{font-size:13px;color:#777;line-height:1.55;margin-bottom:18px}
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
      modal.innerHTML = `<div class="ruby-telegram-box"><div class="ruby-telegram-icon">✈️</div><h3>Continue on Telegram</h3><p id="rubyTelegramText">Opening your character in Telegram…</p><button id="rubyTelegramGo" class="ruby-telegram-btn" type="button">Open Telegram</button></div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });
    }
    const id = character?.id || character?.ai_id || character?.character_id;
    const name = character?.name || character?.character_name || 'your character';
    const payload = id ? `ruby_${String(id).replace(/[^a-zA-Z0-9_-]/g, '')}` : 'ruby';
    const url = `https://t.me/${BOT_USERNAME}?start=${encodeURIComponent(payload)}`;
    modal.querySelector('#rubyTelegramText').textContent = `${name} is ready. Continue the conversation in Telegram.`;
    modal.querySelector('#rubyTelegramGo').onclick = () => { window.location.href = url; };
    modal.classList.add('show');
  }

  window.rubyOpenTelegram = handoff;
  window.rubyTelegramUrl = id => `https://t.me/${BOT_USERNAME}?start=${encodeURIComponent('ruby_' + id)}`;

  function addButtons() {
    const cards = document.querySelectorAll('.character-card');
    cards.forEach(card => {
      if (card.querySelector('.ruby-telegram-btn')) return;
      const chatButton = card.querySelector('.chat-btn');
      if (!chatButton) return;
      const id = card.dataset.characterId || card.dataset.character || card.dataset.id;
      const name = card.dataset.characterName || card.querySelector('h3')?.textContent?.trim();
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ruby-telegram-btn';
      btn.textContent = '✈️ Chat on Telegram';
      btn.onclick = async () => {
        let character = { id, name };
        try {
          if (window.supabaseClient && id) {
            const { data } = await window.supabaseClient.from('characters').select('id,name').eq('id', id).maybeSingle();
            if (data) character = data;
          }
        } catch (_) {}
        handoff(character);
      };
      chatButton.insertAdjacentElement('afterend', btn);
    });
  }

  const observer = new MutationObserver(addButtons);
  function init() {
    ensureStyles();
    addButtons();
    observer.observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
