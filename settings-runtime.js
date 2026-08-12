(()=>{
  const TERMS=`By using Ruby Chan, you agree to use the service lawfully and responsibly. Ruby Chan is an AI companion platform for adults. AI responses may be inaccurate, incomplete, fictional, or inappropriate for some situations and are not professional medical, legal, financial, or emergency advice. You are responsible for activity performed through your account and connected Telegram session. Do not use the service for harassment, threats, exploitation, impersonation, unlawful activity, abuse, or attempts to compromise the service or another user's account. Any sexual content involving minors is strictly prohibited. Premium, Energy, Gems and other digital features are subject to the package information shown at purchase and may change. Service availability and features may change for maintenance, security or technical reasons. Ruby Chan may restrict access when necessary to protect users, the service, or comply with law. These terms may be updated as the platform evolves.`;
  const PRIVACY=`Ruby Chan may process account identifiers, Telegram identifiers needed for integration, device/session information, preferences, usage data, character selections, conversation records and information required to operate and secure the platform. Conversation data may be stored so supported AI conversations and Chat History can work. Some conversations may have automatic deletion rules shown by the app. Authentication and session data may be used to establish and protect access. Telegram, Supabase, AI, hosting, analytics and payment providers may process information as required to deliver their services and their own policies may apply. Do not submit passwords, OTPs, PINs, private keys, banking credentials or other highly sensitive secrets into chat. Ruby Chan is for adults aged 18 and above and is not intended for minors. For privacy questions, use Support & Feedback and the official owner contact configured by the service owner.`;
  const AGE=`Ruby Chan is strictly 18+ and intended only for adults who are at least 18 years old. You must truthfully confirm your age before entering the platform. Anyone under 18 must not access or use the service. Sexual content involving minors, exploitation, trafficking, coercion or other illegal sexual material is prohibited. If you are not 18 or older, choose Exit and do not continue.`;
  const SUPPORT=`Use Support & Feedback for account problems, bug reports, feature issues, Premium/Payment problems and suggestions. When reporting a payment or Premium issue, include only the relevant receipt or transaction reference. Never send your banking password, PIN or OTP. The official owner Telegram username is configured separately by the owner and is intentionally not invented here.`;

  const boot=()=>{
    const addStyle=()=>{if(document.getElementById('ruby-settings-clean-css'))return;const s=document.createElement('style');s.id='ruby-settings-clean-css';s.textContent=`
      #ruby-page-title{font-size:28px;font-weight:950;letter-spacing:.18em;color:#9b5d7c;margin:2px 0 12px}
      .ruby-settings-extra{display:grid;gap:10px;margin-top:12px}.ruby-settings-extra h3{margin:4px 2px;font-size:11px;letter-spacing:.16em;color:#b46a91}.ruby-settings-action{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px;border-radius:16px;border:1px solid rgba(223,163,195,.28);background:rgba(255,255,255,.42);color:#714e65;text-align:left;cursor:pointer}.ruby-settings-action b{font-size:13px}.ruby-settings-action small{display:block;margin-top:4px;color:#9b788b;font-size:10px}.ruby-settings-action strong{font-size:20px;color:#b46a91}
      #rubyLegalModal,#rubySupportModal{position:fixed;inset:0;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(65,35,55,.22);backdrop-filter:blur(10px);z-index:9000}#rubyLegalModal.open,#rubySupportModal.open{display:flex}.ruby-modal-card{width:min(620px,100%);max-height:82vh;overflow:auto;border-radius:22px;border:1px solid rgba(255,255,255,.82);background:rgba(255,248,252,.98);box-shadow:0 30px 80px rgba(105,54,82,.28);padding:20px;color:#704c64}.ruby-modal-card h3{margin:0 0 12px;color:#9e4f79;font-size:20px}.ruby-modal-body{white-space:pre-line;font-size:11px;line-height:1.72;color:#8b6b7b}.ruby-modal-close{margin-top:16px;border:0;border-radius:999px;padding:9px 15px;background:linear-gradient(135deg,#ff70ad,#aa82ff);color:#fff;font-weight:800;cursor:pointer}
    `;document.head.appendChild(s)};
    addStyle();

    const findSettings=()=>document.querySelector('#settings')||document.querySelector('#page-settings')||document.querySelector('[data-page="settings"]');
    const cleanAndBuild=()=>{
      const root=findSettings(); if(!root)return;
      const textNodes=[...root.querySelectorAll('.settings-section,.setting,.ios-row,.settings-row,.row')];
      textNodes.forEach(el=>{const t=(el.textContent||'').trim().toLowerCase();if(/^(chat preferences|notifications|background|history & safety|privacy & safety)$/.test(t)||t.includes('chat notifications')||t.includes('offers & updates'))el.remove()});
      [...root.querySelectorAll('.settings-section')].forEach(sec=>{const t=(sec.textContent||'').toLowerCase();if(t.includes('notifications')||t.includes('background')||t.includes('history & safety')||t.includes('privacy & safety')||t.includes('chat preferences'))sec.remove()});
      let extra=root.querySelector('.ruby-settings-extra'); if(!extra){extra=document.createElement('div');extra.className='ruby-settings-extra';root.appendChild(extra)}
      if(extra.dataset.ready==='1')return;extra.dataset.ready='1';extra.innerHTML='<h3>LEGAL & SUPPORT</h3>';
      const add=(key,title,sub,handler)=>{const b=document.createElement('button');b.type='button';b.className='ruby-settings-action';b.innerHTML='<span><b></b><small></small></span><strong>›</strong>';b.querySelector('b').textContent=title;b.querySelector('small').textContent=sub;b.addEventListener('click',handler);extra.appendChild(b)};
      add('terms','Terms & Conditions','Read the full service terms',()=>openModal('TERMS & CONDITIONS',TERMS,'rubyLegalModal'));
      add('privacy','Privacy Policy','How Ruby Chan handles platform data',()=>openModal('PRIVACY POLICY',PRIVACY,'rubyLegalModal'));
      add('support','Support & Feedback','Get help, report bugs or send feedback',()=>openSupport());
      add('age','18+ Policy','Adults only · age requirement and safety rules',()=>openModal('18+ POLICY',AGE,'rubyLegalModal'));
    };

    const openModal=(title,body,id)=>{let m=document.getElementById(id);if(!m){m=document.createElement('div');m.id=id;m.innerHTML='<div class="ruby-modal-card"><h3></h3><div class="ruby-modal-body"></div><button type="button" class="ruby-modal-close">Close</button></div>';document.body.appendChild(m);m.querySelector('.ruby-modal-close').onclick=()=>m.classList.remove('open');m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')})}m.querySelector('h3').textContent=title;m.querySelector('.ruby-modal-body').textContent=body;m.classList.add('open')};
    const openSupport=()=>openModal('SUPPORT & FEEDBACK',SUPPORT,'rubySupportModal');

    const ensureAgeGate=()=>{
      const existing=document.getElementById('ageGate');
      if(existing){existing.classList.remove('hidden');return}
      if(document.getElementById('rubyAgeGate'))return;
      const g=document.createElement('div');g.id='rubyAgeGate';g.style.cssText='position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(10,6,12,.80);backdrop-filter:blur(18px)';g.innerHTML='<div style="width:min(430px,100%);padding:24px;border-radius:24px;background:linear-gradient(180deg,#fff9fc,#f7edff);text-align:center;color:#714d65;box-shadow:0 30px 90px rgba(0,0,0,.4)"><div style="font-size:34px;font-weight:1000;color:#b04975">18+</div><h2 style="margin:0 0 10px">Adults only</h2><p style="font-size:11px;line-height:1.65;color:#957183">Ruby Chan is an adults-only AI companion platform. You must be 18 or older to continue.</p><div style="display:grid;gap:8px;margin-top:16px"><button id="rubyAgeYes" style="border:0;border-radius:999px;padding:12px;font-weight:900;background:linear-gradient(135deg,#ff70ad,#aa82ff);color:#fff">Yes, I’m 18+</button><button id="rubyAgeNo" style="border:0;border-radius:999px;padding:12px;font-weight:900;background:#f0e3eb;color:#8f6379">No, exit</button></div></div>';document.body.appendChild(g);g.querySelector('#rubyAgeYes').onclick=()=>g.remove();g.querySelector('#rubyAgeNo').onclick=()=>{g.innerHTML='<div style="color:#fff;text-align:center"><h2>Access unavailable</h2><p>You must be 18 or older to use Ruby Chan.</p></div>'};
    };

    const sync=()=>{
      const root=findSettings();
      if(root)cleanAndBuild();
      const active=document.querySelector('.view.active,.page.active');
      const titles={home:'',characters:'CHARACTERS',chat:'HISTORY',recharge:'RECHARGE',settings:'SETTINGS'};
      const app=document.querySelector('.app');if(app){let h=document.getElementById('ruby-page-title');if(!h){h=document.createElement('div');h.id='ruby-page-title';app.prepend(h)}h.textContent=titles[active?.id?.replace('page-','')]||'';h.style.display=h.textContent?'block':'none'}
      const bonus=document.getElementById('bonus');if(bonus)bonus.setAttribute('aria-label','Daily Bonus');
    };
    sync();
    new MutationObserver(sync).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    document.addEventListener('click',()=>setTimeout(sync,50),true);
    ensureAgeGate();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();