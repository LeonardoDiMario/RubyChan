/* Ruby Chan — Character picker: one Chat action + selectable personality */
(function () {
  'use strict';
  let installing = false, scheduled = false;

  const style = document.createElement('style');
  style.textContent = `
    .character-card.ruby-selected { border:2px solid #3b82f6 !important; box-shadow:0 0 0 3px rgba(59,130,246,.14),0 8px 24px rgba(59,130,246,.12) !important; }
    .character-card .ruby-personality { display:none; margin:10px 0 2px; padding:10px 12px; border-radius:12px; background:linear-gradient(135deg,#eff6ff,#f5f3ff); color:#374151; font-size:12px; line-height:1.5; text-align:left; }
    .character-card.ruby-selected .ruby-personality { display:block; }
    .ruby-character-actions { display:flex !important; gap:8px; margin-top:10px !important; }
    .ruby-character-chat { width:100%; }
  `;
  (document.head || document.documentElement).appendChild(style);

  function install() {
    if (installing) return;
    installing = true;
    try {
      document.querySelectorAll('.character-card').forEach(function (card) {
        const name = card.querySelector('h3')?.textContent?.trim();
        if (!name) return;
        if (!card.dataset.rubySelectable) {
          card.dataset.rubySelectable = '1';
          card.setAttribute('tabindex','0');
          const select = function(event) {
            if (event.target.closest('button,a,input')) return;
            document.querySelectorAll('.character-card.ruby-selected').forEach(c => { if(c !== card) c.classList.remove('ruby-selected'); });
            card.classList.toggle('ruby-selected');
          };
          card.addEventListener('click',select);
          card.addEventListener('keydown',function(event){ if(event.key==='Enter'||event.key===' '){event.preventDefault();select(event);} });
        }
        if (!card.querySelector('.ruby-personality')) {
          const source = card.querySelector('.character-ability') || card.querySelector('.character-description') || card.querySelector('.character-content p');
          const personality = document.createElement('div');
          personality.className='ruby-personality';
          personality.innerHTML='<strong>Personality</strong><br>'+(source ? source.textContent.trim() : 'Warm, engaging and character-driven conversation.');
          const content=card.querySelector('.character-content')||card.querySelector('.card-content')||card;
          content.appendChild(personality);
        }
        let actions=card.querySelector('.ruby-character-actions');
        if(!actions){
          actions=document.createElement('div'); actions.className='ruby-character-actions';
          const chat=document.createElement('button'); chat.type='button'; chat.className='chat-btn ruby-character-chat'; chat.textContent='Chat';
          chat.onclick=function(event){event.preventDefault();event.stopPropagation();if(typeof window.rubyShowCharacterHistory==='function')window.rubyShowCharacterHistory(name);else if(typeof window.startChat==='function')window.startChat(name);};
          actions.appendChild(chat);
          const content=card.querySelector('.character-content')||card.querySelector('.card-content')||card; content.appendChild(actions);
        }
        const oldNew=card.querySelector('.ruby-character-new'); if(oldNew) oldNew.remove();
      });
    } finally { installing=false; }
  }
  function scheduleInstall(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;install();});}
  function boot(){install();if(document.body)new MutationObserver(scheduleInstall).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();