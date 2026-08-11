/* Ruby Chan — final UI fixes */
(function(){
  'use strict';

  const PREMIUM_WORDS = /premium\s*(characters?|items?)/i;

  function hidePremiumSections(){
    const page=document.getElementById('page-characters');
    if(!page)return;

    // Hide the heading and the complete containing section/card group.
    page.querySelectorAll('h1,h2,h3,h4,h5,h6,[role="heading"],p,span,div,section').forEach(el=>{
      const text=(el.textContent||'').trim().replace(/\s+/g,' ');
      if(!PREMIUM_WORDS.test(text))return;
      const headingMatch=/premium\s*(characters?|items?)/i.test(text) && text.length<80;
      if(!headingMatch)return;

      let target=el;
      // Prefer the nearest section/group that contains the premium heading.
      for(let i=0;i<4 && target.parentElement;i++){
        const p=target.parentElement;
        const pText=(p.textContent||'').trim().replace(/\s+/g,' ');
        if(pText.length<500 && (p.tagName==='SECTION'||p.children.length>=2)) target=p;
        if(pText.length>500)break;
      }
      target.style.setProperty('display','none','important');
      target.setAttribute('data-ruby-premium-hidden','1');
    });

    // Also remove individual cards whose visible text marks them as premium.
    page.querySelectorAll('[class*="premium"],[id*="premium"]').forEach(el=>{
      el.style.setProperty('display','none','important');
      el.setAttribute('data-ruby-premium-hidden','1');
    });
  }

  function welcomeName(session){
    const user=session?.user;
    if(!user)return '';
    const m=user.user_metadata||{};
    return String(m.full_name||m.name||m.username||user.email?.split('@')[0]||'Mario').trim();
  }

  function restoreWelcome(){
    const sb=window.supabaseClient||window.rubySupabase;
    if(!sb?.auth)return;

    const paint=async(session)=>{
      const title=document.querySelector('#page-home .hero h2, #page-home h2.hero-title, #page-home .hero [data-ruby-welcome], .hero h2');
      if(!title)return;

      if(session?.user){
        const name=welcomeName(session);
        title.textContent=`Welcome, ${name}`;
        title.dataset.rubyWelcome='1';
      }else{
        // Logged-out state should keep the login welcome copy.
        title.textContent='Welcome to Ruby Chan';
        title.dataset.rubyWelcome='0';
      }
    };

    sb.auth.getSession().then(({data})=>paint(data?.session));
    sb.auth.onAuthStateChange((_event,session)=>setTimeout(()=>paint(session),20));

    // platform-ui-v5 can repaint the hero later, so enforce the canonical
    // welcome title for a short startup window.
    let ticks=0;
    const guard=setInterval(async()=>{
      ticks++;
      const {data}=await sb.auth.getSession();
      await paint(data?.session);
      if(ticks>=40)clearInterval(guard);
    },250);
  }

  function premiumBottomNav(){
    let best=null;
    document.querySelectorAll('nav, .bottom-nav, .bottom-navigation, .tab-bar, [class*="bottom-nav"], [class*="tab-bar"]').forEach(el=>{
      const cs=getComputedStyle(el),r=el.getBoundingClientRect();
      if((cs.position==='fixed'||cs.position==='sticky')&&r.bottom>=innerHeight-8&&r.height>=45&&r.height<=120)best=el;
    });
    if(!best)return;
    best.classList.add('ruby-premium-nav');
    if(document.getElementById('ruby-premium-nav-style'))return;
    const s=document.createElement('style');s.id='ruby-premium-nav-style';
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
    setTimeout(()=>observer.disconnect(),60000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
