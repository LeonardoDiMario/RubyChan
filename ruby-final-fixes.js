/* Ruby Chan — final UI fixes */
(function(){
  'use strict';

  function hidePremiumSections(){
    const page=document.getElementById('page-characters');
    if(!page)return;
    page.querySelectorAll('*').forEach(el=>{
      const text=(el.textContent||'').trim().replace(/\s+/g,' ');
      if(text==='👑 Premium Characters 👑' || text==='Premium Characters' || text==='👑 Premium Items 👑' || text==='Premium Items'){
        el.style.display='none';
        const parent=el.parentElement;
        if(parent && parent.children.length<=4) parent.style.display='none';
      }
    });
  }

  function restoreWelcome(){
    const sb=window.supabaseClient||window.rubySupabase;
    const title=document.querySelector('#page-home .hero h2, .hero h2');
    if(!sb?.auth || !title)return;
    sb.auth.getSession().then(({data})=>paint(data?.session));
    sb.auth.onAuthStateChange((_event,session)=>setTimeout(()=>paint(session),0));

    function paint(session){
      if(!session?.user)return;
      const u=session.user.user_metadata||{};
      const name=u.full_name||u.name||u.username||session.user.email?.split('@')[0]||'Mario';
      title.textContent=`Welcome, ${name}`;
      title.dataset.rubyWelcome='1';
    }
  }

  function premiumBottomNav(){
    let best=null;
    document.querySelectorAll('nav, .bottom-nav, .bottom-navigation, .tab-bar, [class*="bottom-nav"], [class*="tab-bar"]').forEach(el=>{
      const cs=getComputedStyle(el), r=el.getBoundingClientRect();
      if((cs.position==='fixed'||cs.position==='sticky') && r.bottom>=innerHeight-8 && r.height>=45 && r.height<=120) best=el;
    });
    if(!best)return;
    best.classList.add('ruby-premium-nav');
    if(document.getElementById('ruby-premium-nav-style'))return;
    const s=document.createElement('style');
    s.id='ruby-premium-nav-style';
    s.textContent=`
      .ruby-premium-nav{height:78px!important;padding:8px 10px calc(8px + env(safe-area-inset-bottom))!important;display:flex!important;align-items:center!important;justify-content:space-around!important;gap:6px!important;background:rgba(255,255,255,.88)!important;backdrop-filter:blur(24px) saturate(150%)!important;-webkit-backdrop-filter:blur(24px) saturate(150%)!important;border-top:1px solid rgba(124,58,237,.16)!important;box-shadow:0 -10px 35px rgba(72,35,130,.12)!important;z-index:9990!important}
      .ruby-premium-nav>*{min-width:0;flex:1;max-width:92px;height:58px!important;border-radius:18px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:4px!important;color:#8b8198!important;background:transparent!important;border:0!important;transition:.18s ease!important}
      .ruby-premium-nav>*:hover{background:#f7f1ff!important;color:#7c3aed!important;transform:translateY(-1px)}
      .ruby-premium-nav>*[aria-current="page"],.ruby-premium-nav>*.active,.ruby-premium-nav>*.selected{color:#7c3aed!important;background:linear-gradient(145deg,#f4eaff,#fbf8ff)!important;box-shadow:0 5px 16px rgba(124,58,237,.13)!important}
      .ruby-premium-nav svg{width:23px!important;height:23px!important;stroke-width:1.8!important}
      .ruby-premium-nav span,.ruby-premium-nav label{font-size:10px!important;font-weight:750!important;letter-spacing:.1px!important}
      @media(max-width:520px){.ruby-premium-nav{height:74px!important;padding-left:6px!important;padding-right:6px!important}.ruby-premium-nav>*{height:55px!important;border-radius:16px!important}.ruby-premium-nav svg{width:22px!important;height:22px!important}}
    `;
    document.head.appendChild(s);
  }

  function boot(){
    hidePremiumSections();
    restoreWelcome();
    premiumBottomNav();
    const observer=new MutationObserver(()=>{
      hidePremiumSections();
      premiumBottomNav();
    });
    observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),30000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
