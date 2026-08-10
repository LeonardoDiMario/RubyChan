/* Ruby Chan — Character picker: New + Chat buttons */
(function () {
  'use strict';

  function install() {
    document.querySelectorAll('.character-card:not(.premium-card)').forEach(function (card) {
      const name = card.querySelector('h3')?.textContent?.trim();
      if (!name) return;

      // Remove/hide the old Telegram action from character cards.
      card.querySelectorAll('button,a').forEach(function (el) {
        const text = (el.textContent || '').trim().toLowerCase();
        const aria = (el.getAttribute('aria-label') || '').toLowerCase();
        if (text.includes('telegram') || aria.includes('telegram')) {
          el.remove();
        }
      });

      let actions = card.querySelector('.ruby-character-actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'ruby-character-actions';
        actions.style.cssText = 'display:flex;gap:8px;margin-top:8px;';

        const originalChat = card.querySelector('.chat-btn');
        if (originalChat) {
          originalChat.classList.add('ruby-character-chat');
          originalChat.textContent = 'Chat';
          originalChat.removeAttribute('onclick');
          originalChat.onclick = function (event) {
            event.preventDefault();
            if (typeof window.rubyShowCharacterHistory === 'function') {
              window.rubyShowCharacterHistory(name);
            } else if (typeof window.startChat === 'function') {
              window.startChat(name);
            }
          };
          actions.appendChild(originalChat);
        } else {
          const chat = document.createElement('button');
          chat.type = 'button';
          chat.className = 'chat-btn ruby-character-chat';
          chat.textContent = 'Chat';
          chat.onclick = function () {
            if (typeof window.rubyShowCharacterHistory === 'function') window.rubyShowCharacterHistory(name);
          };
          actions.appendChild(chat);
        }

        const newBtn = document.createElement('button');
        newBtn.type = 'button';
        newBtn.className = 'chat-btn ruby-character-new';
        newBtn.textContent = 'New';
        newBtn.onclick = function (event) {
          event.preventDefault();
          if (typeof window.rubyStartNewCharacterChat === 'function') {
            window.rubyStartNewCharacterChat(name);
          } else if (typeof window.startChat === 'function') {
            window.startChat(name);
          }
        };
        actions.appendChild(newBtn);

        const content = card.querySelector('.character-content') || card.querySelector('.card-content') || card;
        content.appendChild(actions);
      } else {
        const chat = actions.querySelector('.ruby-character-chat');
        const newBtn = actions.querySelector('.ruby-character-new');
        if (chat) {
          chat.textContent = 'Chat';
          chat.onclick = function (event) {
            event.preventDefault();
            if (typeof window.rubyShowCharacterHistory === 'function') window.rubyShowCharacterHistory(name);
          };
        }
        if (newBtn) {
          newBtn.textContent = 'New';
          newBtn.onclick = function (event) {
            event.preventDefault();
            if (typeof window.rubyStartNewCharacterChat === 'function') window.rubyStartNewCharacterChat(name);
          };
        }
      }
    });

    // Premium cards: keep their purchase/unlock flow, but remove Telegram actions.
    document.querySelectorAll('.premium-card').forEach(function (card) {
      card.querySelectorAll('button,a').forEach(function (el) {
        const text = (el.textContent || '').trim().toLowerCase();
        if (text.includes('telegram')) el.remove();
      });
      card.querySelectorAll('.gem-buy-btn').forEach(function (button) {
        if (/unlocked.*chat/i.test(button.textContent)) button.textContent = '✓ Unlocked — New';
      });
    });
  }

  // Re-run safely when other modules add characters. Disconnect while installing
  // so our own DOM changes cannot recursively trigger the observer forever.
  const observer = new MutationObserver(function () {
    observer.disconnect();
    try {
      install();
    } finally {
      if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    }
  });

  function boot() {
    observer.disconnect();
    install();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
