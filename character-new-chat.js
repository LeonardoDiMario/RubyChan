/* Ruby Chan — Character picker: Chat + New + Telegram */
(function () {
  'use strict';
  let installing = false, scheduled = false;
  function install() {
    if (installing) return; installing = true;
    try {
      document.querySelectorAll('.character-card:not(.premium-card)').forEach(function (card) {
        const name = card.querySelector('h3')?.textContent?.trim(); if (!name) return;
        let actions = card.querySelector('.ruby-character-actions');
        if (!actions) {
          actions = document.createElement('div'); actions.className = 'ruby-character-actions';
          actions.style.cssText = 'display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;';
          const originalChat = card.querySelector('.chat-btn');
          if (originalChat) {
            originalChat.classList.add('ruby-character-chat'); originalChat.textContent = 'Chat'; originalChat.removeAttribute('onclick');
            originalChat.onclick = function (event) { event.preventDefault(); if (typeof window.rubyShowCharacterHistory === 'function') window.rubyShowCharacterHistory(name); else if (typeof window.startChat === 'function') window.startChat(name); };
            actions.appendChild(originalChat);
          } else {
            const chat = document.createElement('button'); chat.type='button'; chat.className='chat-btn ruby-character-chat'; chat.textContent='Chat';
            chat.onclick=function(){ if(typeof window.rubyShowCharacterHistory==='function') window.rubyShowCharacterHistory(name); }; actions.appendChild(chat);
          }
          const newBtn = document.createElement('button'); newBtn.type='button'; newBtn.className='chat-btn ruby-character-new'; newBtn.textContent='New';
          newBtn.onclick=function(event){event.preventDefault();if(typeof window.rubyStartNewCharacterChat==='function')window.rubyStartNewCharacterChat(name);else if(typeof window.startChat==='function')window.startChat(name);};
          actions.appendChild(newBtn);
          const content = card.querySelector('.character-content') || card.querySelector('.card-content') || card; content.appendChild(actions);
        }
      });
      document.querySelectorAll('.premium-card').forEach(function (card) {
        card.querySelectorAll('.gem-buy-btn').forEach(function (button) { if (/unlocked.*chat/i.test(button.textContent)) button.textContent='✓ Unlocked — New'; });
      });
    } finally { installing=false; }
  }
  function scheduleInstall(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;install();});}
  function boot(){install();if(document.body)new MutationObserver(scheduleInstall).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();