/* Ruby Chan — Quick Access home cards */
(function(){
  'use strict';
  if(window.__rubyQuickAccess) return;
  window.__rubyQuickAccess=true;

  function install(){
    const home=document.getElementById('page-home');
    if(!home || home.querySelector('.ruby-quick-access')) return;

    const wrap=document.createElement('section');
    wrap.className='ruby-quick-access';
    wrap.innerHTML=`
      <div class="qa-head">
        <div>
          <div class="qa-kicker">QUICK ACCESS</div>
          <h2>Jump right in ✨</h2>
          <p>Everything you need, one tap away.</p>
        </div>
        <div class="qa-orb">✦</div>
      </div>
      <div class="qa-grid">
        <button type="button" class="qa-card" data-page="characters">
          <span class="qa-icon">👩🏻</span>
          <span class="qa-title">Characters</span>
          <span class="qa-text">Browse characters and discover their personalities.</span>
          <span class="qa-arrow">›</span>
        </button>
        <button type="button" class="qa-card" data-page="chat">
          <span class="qa-icon">💬</span>
          <span class="qa-title">Chat</span>
          <span class="qa-text">View your Telegram conversations and continue chatting.</span>
          <span class="qa-arrow">›</span>
        </button>
        <button type="button" class="qa-card" data-page="recharge">
          <span class="qa-icon">⚡</span>
          <span class="qa-title">Recharge</span>
          <span class="qa-text">Manage Energy and Gems whenever you need them.</span>
          <span class="qa-arrow">›</span>
        </button>
        <button type="button" class="qa-card" data-page="settings">
          <span class="qa-icon">⚙️</span>
          <span class="qa-title">Settings</span>
          <span class="qa-text">Account, plan and app preferences.</span>
          <span class="qa-arrow">›</span>
        </button>
      </div>`;

    const style=document.createElement('style');
    style.id='ruby-quick-access-style';
    style.textContent=`
      .ruby-quick-access{margin-top:2px;margin-bottom:22px;padding:20px;border-radius:24px;background:linear-gradient(145deg,#fff,#f8f5ff);border:1px solid rgba(124,58,237,.13);box-shadow:0 16px 42px rgba(60,40,120,.09)}
      .qa-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:17px}
      .qa-kicker{font-size:10px;font-weight:900;letter-spacing:1.8px;color:#7c3aed}
      .qa-head h2{margin:4px 0 4px;font-size:22px;color:#18181b}
      .qa-head p{font-size:12px;color:#77717f}
      .qa-orb{width:46px;height:46px;flex:0 0 46px;border-radius:16px;display:grid;place-items:center;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:22px;box-shadow:0 10px 24px rgba(124,58,237,.25)}
      .qa-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px}
      .qa-card{position:relative;min-height:126px;padding:15px;text-align:left;border:1px solid rgba(124,58,237,.10);border-radius:18px;background:#fff;cursor:pointer;box-shadow:0 7px 19px rgba(0,0,0,.035);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
      .qa-card:hover{transform:translateY(-2px);border-color:rgba(124,58,237,.28);box-shadow:0 12px 27px rgba(60,40,120,.10)}
      .qa-card:active{transform:scale(.98)}
      .qa-icon{display:grid;place-items:center;width:39px;height:39px;margin-bottom:10px;border-radius:12px;background:#f1eaff;color:#7c3aed;font-size:19px}
      .qa-title{display:block;font-size:15px;font-weight:850;color:#18181b}
      .qa-text{display:block;margin-top:4px;padding-right:12px;font-size:10.5px;line-height:1.4;color:#77717f}
      .qa-arrow{position:absolute;right:13px;bottom:12px;color:#7c3aed;font-size:19px;font-weight:700}
      @media(max-width:520px){.ruby-quick-access{padding:16px}.qa-grid{grid-template-columns:1fr 1fr}.qa-card{min-height:118px;padding:13px}.qa-head h2{font-size:20px}}
    `;
    document.head.appendChild(style);

    wrap.querySelectorAll('.qa-card').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const page=btn.dataset.page;
        if(typeof window.switchPage==='function') window.switchPage(page);
        if(page==='chat' && typeof window.rubyLoadChatHistory==='function') setTimeout(window.rubyLoadChatHistory,0);
      });
    });

    const hero=home.querySelector('.hero');
    if(hero) hero.insertAdjacentElement('afterend',wrap); else home.prepend(wrap);
  }

  function boot(){install();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
