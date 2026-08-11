/* Ruby Chan — final home polish */
(function(){
  'use strict';
  if(window.__rubyPlatformV5) return;
  window.__rubyPlatformV5 = true;

  const icons = {
    characters:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    chat:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H11l-4.5 3v-3H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
    recharge:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13.5 2-8 11h6l-1 9 8-11h-6l1-9Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
    settings:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8.2 3.5a7.9 7.9 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8.1 8.1 0 0 0-1.7-1L15.7 3h-4l-.4 3.1a8.1 8.1 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7.9 7.9 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8.1 8.1 0 0 0 1.7 1l.4 3.1h4l.4-3.1a8.1 8.1 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/></svg>`
  };

  function css(){
    if(document.getElementById('ruby-platform-v5-style')) return;
    const s=document.createElement('style');
    s.id='ruby-platform-v5-style';
    s.textContent=`
      #page-home .hero{padding:22px;margin-bottom:18px;border-radius:24px;background:linear-gradient(145deg,#ffffff 0%,#f8f2ff 52%,#f0eaff 100%);border:1px solid rgba(124,58,237,.13);box-shadow:0 18px 48px rgba(70,35,120,.10);}
      #page-home .hero h2{font-size:27px;color:#5b21b6;margin-bottom:7px;letter-spacing:-.5px;}
      #page-home .hero p{color:#6f6679;font-size:13px;line-height:1.6;}
      #page-home .quick-access{display:none!important;}
      #page-home .ruby-quick-access{margin:0 0 22px;padding:20px;border-radius:24px;background:linear-gradient(145deg,#fff,#f8f5ff);border:1px solid rgba(124,58,237,.13);box-shadow:0 16px 42px rgba(60,40,120,.09);}
      .ruby-quick-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:17px;}
      .ruby-quick-kicker{font-size:10px;font-weight:900;letter-spacing:1.8px;color:#7c3aed;}
      .ruby-quick-head h3{margin:4px 0;font-size:22px;color:#18181b;}
      .ruby-quick-head p{font-size:12px;color:#77717f;}
      .ruby-quick-orb{width:46px;height:46px;flex:0 0 46px;border-radius:16px;display:grid;place-items:center;background:linear-gradient(135deg,#6d28d9,#a855f7);color:#fff;box-shadow:0 10px 24px rgba(124,58,237,.25);}
      .ruby-quick-orb svg{width:21px;height:21px;}
      .ruby-quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px;}
      .ruby-quick-card{position:relative;min-height:122px;padding:15px;text-align:left;border:1px solid rgba(124,58,237,.10);border-radius:18px;background:#fff;color:#21172d;cursor:pointer;box-shadow:0 7px 19px rgba(0,0,0,.035);transition:.18s ease;}
      .ruby-quick-card:hover{transform:translateY(-2px);border-color:rgba(124,58,237,.25);box-shadow:0 12px 27px rgba(60,40,120,.10);}
      .ruby-quick-icon{display:grid;place-items:center;width:40px;height:40px;margin-bottom:10px;border-radius:12px;background:linear-gradient(145deg,#f3eaff,#fbf8ff);color:#6d28d9;border:1px solid rgba(124,58,237,.10);}
      .ruby-quick-icon svg{width:20px;height:20px;}
      .ruby-quick-title{display:block;font-size:15px;font-weight:850;}
      .ruby-quick-text{display:block;margin-top:4px;padding-right:13px;font-size:10.5px;line-height:1.4;color:#77717f;}
      .ruby-quick-arrow{position:absolute;right:13px;bottom:12px;color:#7c3aed;font-size:19px;font-weight:700;}
      @media(max-width:520px){.ruby-quick-grid{grid-template-columns:1fr 1fr}.ruby-quick-access{padding:16px}.ruby-quick-card{min-height:118px;padding:13px}.ruby-quick-head h3{font-size:20px}}
      @media(max-width:360px){.ruby-quick-grid{grid-template-columns:1fr}.ruby-quick-card{min-height:105px}}
    `;
    document.head.appendChild(s);
  }

  function welcome(){
    const home=document.getElementById('page-home');
    const hero=home?.querySelector('.hero');
    if(!home || !hero) return;
    hero.innerHTML=`<h2 id="rubyWelcomeTitle">Welcome, Mario</h2><p id="rubyWelcomeText">Your private AI character space. Choose a character, continue your conversations and manage your account from one place.</p>`;
    const sb=window.supabaseClient;
    if(sb?.auth){
      sb.auth.getSession().then(({data})=>{
        const u=data?.session?.user,m=u?.user_metadata||{};
        const name=m.full_name||m.name||m.username||'Mario';
        const title=document.getElementById('rubyWelcomeTitle');
        if(title) title.textContent=`Welcome, ${name}`;
      }).catch(()=>{});
    }
  }

  function quickAccess(){
    const home=document.getElementById('page-home');
    if(!home) return;
    home.querySelectorAll('.ruby-quick-access').forEach((x,i)=>{if(i>0)x.remove()});
    let wrap=home.querySelector('.ruby-quick-access');
    if(!wrap){
      wrap=document.createElement('section');
      wrap.className='ruby-quick-access';
      const hero=home.querySelector('.hero');
      if(hero) hero.insertAdjacentElement('afterend',wrap); else home.prepend(wrap);
    }
    wrap.innerHTML=`
      <div class="ruby-quick-head"><div><div class="ruby-quick-kicker">JUMP RIGHT IN</div><h3>Quick Access</h3><p>Everything important, right where you need it.</p></div><div class="ruby-quick-orb">${icons.characters}</div></div>
      <div class="ruby-quick-grid">
        <button class="ruby-quick-card" data-page="characters"><span class="ruby-quick-icon">${icons.characters}</span><span class="ruby-quick-title">Characters</span><span class="ruby-quick-text">Explore characters and their personalities.</span><span class="ruby-quick-arrow">›</span></button>
        <button class="ruby-quick-card" data-page="chat"><span class="ruby-quick-icon">${icons.chat}</span><span class="ruby-quick-title">Chat</span><span class="ruby-quick-text">View your Telegram conversation history.</span><span class="ruby-quick-arrow">›</span></button>
        <button class="ruby-quick-card" data-page="recharge"><span class="ruby-quick-icon">${icons.recharge}</span><span class="ruby-quick-title">Recharge</span><span class="ruby-quick-text">Manage your Energy and Gems.</span><span class="ruby-quick-arrow">›</span></button>
        <button class="ruby-quick-card" data-page="settings"><span class="ruby-quick-icon">${icons.settings}</span><span class="ruby-quick-title">Settings</span><span class="ruby-quick-text">Account and app preferences.</span><span class="ruby-quick-arrow">›</span></button>
      </div>`;
    wrap.querySelectorAll('.ruby-quick-card').forEach(btn=>btn.onclick=()=>{
      const page=btn.dataset.page;
      if(typeof window.switchPage==='function') window.switchPage(page);
      if(page==='chat' && typeof window.rubyLoadChatHistory==='function') setTimeout(window.rubyLoadChatHistory,0);
    });
  }

  function boot(){css();welcome();quickAccess();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
