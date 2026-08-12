(()=>{
  const run=()=>{
    try{
      if(document.documentElement.dataset.rubyLucidSafe==='1') return;
      document.documentElement.dataset.rubyLucidSafe='1';

      const css=document.createElement('style');
      css.id='ruby-lucid-safe-css';
      css.textContent=`
        /* Global Lucid shell */
        .top{position:fixed!important;top:10px!important;right:12px!important;z-index:5000!important;margin:0!important;width:auto!important;pointer-events:none!important}
        .top .brand,.top .status{display:none!important}
        .top .balances{display:flex!important;gap:6px!important;pointer-events:auto!important}
        .top .pill{padding:6px 8px!important;border-radius:12px!important;background:rgba(12,15,31,.88)!important;border-color:rgba(242,182,216,.16)!important;box-shadow:0 10px 28px rgba(0,0,0,.3)!important;backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important}
        .ruby-page-heading{font-size:27px;font-weight:950;letter-spacing:.18em;color:#f5e2ef;margin:0 0 13px;padding:0 1px;text-shadow:0 0 22px rgba(255,112,173,.14)}
        .view.ruby-heading-ready>.ruby-page-heading{display:block}
        .view.ruby-heading-ready>.ruby-page-heading~*{margin-top:0}

        /* Settings */
        #settings-overwrite-root{display:grid;gap:11px;padding:0 0 100px}
        .ruby-settings-card{border:1px solid rgba(242,182,216,.16);border-radius:18px;background:linear-gradient(180deg,rgba(34,20,40,.9),rgba(19,12,27,.94));box-shadow:0 16px 42px rgba(0,0,0,.25);color:#f7eef6}
        .ruby-settings-section{font-size:9px;font-weight:950;letter-spacing:.16em;color:#dca2bf;margin:7px 2px 0;text-transform:uppercase}
        .ruby-plan-card{display:grid;grid-template-columns:78px 1fr;grid-template-rows:auto auto;align-items:center;gap:5px 12px;padding:15px}
        .ruby-plan-badge{grid-column:1;grid-row:1/span 2;width:72px;height:72px;border-radius:18px;display:grid;place-items:center;position:relative;overflow:hidden;background:linear-gradient(145deg,#2c1b32,#17101c);border:1px solid rgba(255,255,255,.12);box-shadow:0 10px 28px rgba(0,0,0,.35);cursor:pointer}
        .ruby-plan-badge:after{content:"";position:absolute;inset:7px;border-radius:12px;border:1px solid rgba(255,255,255,.07)}
        .ruby-plan-corner{position:absolute;top:7px;right:8px;font-size:7px;color:#ffffff77;font-weight:950;letter-spacing:.1em}.ruby-plan-mark{font-size:17px;font-weight:1000}.ruby-plan-sub{position:absolute;bottom:6px;left:0;right:0;text-align:center;font-size:8px;color:#ffffff77;letter-spacing:.12em}
        .ruby-plan-free .ruby-plan-mark{color:#ddd3df}.ruby-plan-1m .ruby-plan-mark{color:#ff9fc9;text-shadow:0 0 15px rgba(255,159,201,.3)}.ruby-plan-3m .ruby-plan-mark{color:#c5a9ff;text-shadow:0 0 15px rgba(197,169,255,.3)}.ruby-plan-1y .ruby-plan-mark{color:#ffe69b;text-shadow:0 0 15px rgba(255,230,155,.27)}
        .ruby-plan-info strong{display:block;font-size:23px;color:#fff0fa}.ruby-plan-info small{display:block;color:#b99fac;font-size:10px;margin-top:4px}.ruby-view-plans{width:max-content;grid-column:2;grid-row:2;border:0;border-radius:999px;padding:9px 13px;background:linear-gradient(135deg,#ff70ad,#8e70ff);color:#fff;font-weight:900;font-size:10px;cursor:pointer}
        .ruby-settings-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px;text-align:left;width:100%;color:#fff;border:1px solid rgba(242,182,216,.16);border-radius:16px;background:linear-gradient(180deg,rgba(34,20,40,.9),rgba(19,12,27,.94));cursor:pointer}.ruby-settings-row strong{font-size:12px}.ruby-settings-row small{display:block;color:#b99fac;font-size:9px;margin-top:4px;line-height:1.45}.ruby-chevron{font-size:20px;color:#e3a6c5}.ruby-lang{padding:7px 9px;border-radius:10px;border:1px solid rgba(242,182,216,.18);background:#211522;color:#fff}
        .ruby-legal-note{padding:12px}.ruby-legal-note strong{font-size:11px;color:#f1bfd7}.ruby-legal-note p{margin:5px 0 0;color:#b99fac;font-size:9px;line-height:1.55}

        /* Premium shop */
        #rubyPremiumShop{position:fixed;inset:0;z-index:12000;display:none;overflow:auto;background:radial-gradient(circle at 18% 0%,#2a1732,#0b0710 45%,#050308);color:#f7eef6;padding:14px 14px 110px}#rubyPremiumShop.open{display:block}
        .ruby-shop-shell{width:min(760px,100%);margin:auto}.ruby-shop-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.ruby-shop-title{font-size:22px;font-weight:950;letter-spacing:.13em}.ruby-shop-sub{font-size:10px;color:#a996a5;margin-top:4px}.ruby-shop-back{border:1px solid rgba(242,182,216,.16);border-radius:11px;background:#16101d;color:#dcc9d5;padding:8px 11px;cursor:pointer}
        .ruby-shop-card{padding:15px;border-radius:20px;border:1px solid rgba(242,182,216,.16);background:linear-gradient(180deg,rgba(36,21,43,.95),rgba(19,12,26,.96));box-shadow:0 22px 70px rgba(0,0,0,.35)}
        .ruby-shop-grid{display:grid;gap:10px}.ruby-shop-plan{display:grid;grid-template-columns:68px 1fr auto;align-items:center;gap:12px;padding:12px;border-radius:16px;border:1px solid rgba(242,182,216,.13);background:#17101f;cursor:pointer;transition:.16s}.ruby-shop-plan:hover{transform:translateY(-1px);border-color:rgba(255,150,206,.34);box-shadow:0 12px 28px rgba(0,0,0,.2)}
        .ruby-shop-badge{width:66px;height:66px;border-radius:16px;display:grid;place-items:center;background:#11101a;border:1px solid rgba(255,255,255,.1)}.ruby-shop-badge b{font-size:17px}.ruby-shop-1m b{color:#f5a6cb}.ruby-shop-3m b{color:#bfa4ff}.ruby-shop-1y b{color:#ffe49a}.ruby-shop-name{font-size:13px;font-weight:950;color:#fff3fa}.ruby-shop-price{font-size:12px;color:#f2b0cf;margin-top:4px}.ruby-shop-copy{font-size:9px;color:#9e8d99;margin-top:3px}.ruby-upgrade{border:0;border-radius:999px;padding:9px 13px;background:linear-gradient(135deg,#ff70ad,#8e70ff);color:#fff;font-weight:900;font-size:10px;cursor:pointer}.ruby-shop-pay{margin-top:13px;padding:14px;border:1px solid rgba(242,182,216,.14);border-radius:17px;background:#140e1a}.ruby-shop-pay h3{margin:0;font-size:12px;letter-spacing:.12em;color:#e7abc7}.ruby-pay-summary{margin-top:7px;font-size:11px;color:#e6d4df}.ruby-pay-methods{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.ruby-pay-method{padding:11px;border:1px solid rgba(242,182,216,.13);border-radius:13px;background:#18101f}.ruby-pay-method b{font-size:11px}.ruby-pay-method small{display:block;margin-top:4px;color:#9e8d99;font-size:8px;line-height:1.45}

        /* Policy dialogs */
        #rubyPolicyDialog{position:fixed;inset:0;z-index:15000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(7,4,10,.72);backdrop-filter:blur(14px)}#rubyPolicyDialog.open{display:flex}.ruby-policy-card{width:min(640px,100%);max-height:84vh;overflow:auto;border:1px solid rgba(242,182,216,.17);border-radius:22px;padding:19px;background:linear-gradient(180deg,#24182b,#140e18);box-shadow:0 30px 90px rgba(0,0,0,.52)}.ruby-policy-card h2{margin:0 0 12px;color:#f2b0cf;font-size:19px}.ruby-policy-body{white-space:pre-line;color:#cdb8c6;font-size:10px;line-height:1.7}.ruby-policy-close{margin-top:14px;border:0;border-radius:999px;padding:9px 14px;background:linear-gradient(135deg,#ff70ad,#8e70ff);color:#fff;font-weight:900;cursor:pointer}

        /* 18+ gate */
        #rubyAgeGateSafe{position:fixed;inset:0;z-index:30000;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(7,4,10,.88);backdrop-filter:blur(18px)}#rubyAgeGateSafe.open{display:flex}.ruby-age-card{width:min(460px,100%);padding:23px;border-radius:25px;background:linear-gradient(180deg,#24182b,#120c17);border:1px solid rgba(242,182,216,.18);box-shadow:0 35px 100px rgba(0,0,0,.55)}.ruby-age-mark{text-align:center;font-size:38px;font-weight:1000;color:#ff9ac7;text-shadow:0 0 25px rgba(255,111,174,.25)}.ruby-age-title{text-align:center;margin-top:1px;font-size:23px;font-weight:950;color:#fff0f9}.ruby-age-copy{text-align:center;color:#cdb8c6;font-size:10px;line-height:1.7;margin-top:7px}.ruby-check{display:flex;gap:9px;align-items:flex-start;margin-top:10px;color:#ecdce7;font-size:10px;line-height:1.55}.ruby-check input{width:17px;height:17px;accent-color:#ff70ad;margin-top:0;flex:0 0 auto}.ruby-check a{color:#ffacd0;text-decoration:underline;font-weight:800}.ruby-age-continue{width:100%;margin-top:12px;border:0;border-radius:999px;padding:12px;background:linear-gradient(135deg,#ff70ad,#8e70ff);color:#fff;font-weight:900;opacity:.4;cursor:not-allowed}.ruby-age-continue.ready{opacity:1;cursor:pointer}.ruby-age-exit{width:100%;margin-top:7px;border:0;border-radius:999px;padding:11px;background:#281a24;color:#d7bccb;font-weight:800;cursor:pointer}
        @media(max-width:600px){.top{top:8px!important;right:8px!important}.ruby-page-heading{font-size:23px}.ruby-plan-card{grid-template-columns:68px 1fr;padding:13px}.ruby-plan-badge{width:64px;height:64px}.ruby-shop-plan{grid-template-columns:58px 1fr}.ruby-shop-badge{width:58px;height:58px}.ruby-pay-methods{grid-template-columns:1fr}}
      `;
      document.head.appendChild(css);

      const TERMS=`RUBY CHAN — TERMS & CONDITIONS\n\n1. Eligibility & Age\nRuby Chan is an adults-only service. You must be at least 18 years old to access or use the platform.\n\n2. Fictional AI Companions\nRuby Chan characters are fictional AI companions. Their names, personalities, stories and responses are part of the fictional service experience.\n\n3. Acceptable Use\nUse the service lawfully and responsibly. Do not use the platform to harass, threaten, exploit, impersonate, defraud, target another person or facilitate unlawful activity.\n\n4. Minors\nMinors may not use Ruby Chan. Any sexual or exploitative content involving anyone under 18 is prohibited.\n\n5. Account & Security\nProtect your Telegram account and authentication credentials. Support will never need your banking password, PIN or OTP.\n\n6. Premium, Energy & Gems\nPrices and packages are the values shown at the time of purchase and may change as the service evolves.\n\n7. Telegram\nSome features connect with Telegram. Keep your Telegram account secure and use official Ruby Chan links.\n\n8. Availability\nFeatures may be changed, suspended or temporarily unavailable during maintenance, security work or third-party outages.\n\n9. Responsibility\nYou are responsible for your account activity and for complying with applicable law.\n\n10. Updates\nThese Terms may be updated when the platform or requirements change.`;
      const PRIVACY=`RUBY CHAN — PRIVACY POLICY\n\n1. Information We Process\nThe service may process account identifiers, Telegram identifiers, device/session information, preferences, character selections, conversation records and security information needed to operate the platform.\n\n2. Conversation Data\nConversation data may be processed or stored so AI chat, History and related features can work. Some conversations may be subject to automatic deletion rules shown by the app.\n\n3. Authentication\nAuthentication and session information may be used to establish and protect access.\n\n4. Telegram\nTelegram Web App information may be used to connect your session and deliver Telegram-related features.\n\n5. Payments\nThird-party payment providers may process purchases. Never send banking passwords, PINs or OTPs to support.\n\n6. Local Storage\nThe app may use local storage for preferences and application state.\n\n7. Third Parties\nSupabase, AI, hosting, payment and other providers may process information required to provide their services.\n\n8. Retention\nRetention varies by feature and account state. Some conversations may be automatically deleted under service rules.\n\n9. Children\nRuby Chan is not intended for anyone under 18.\n\n10. Privacy Contact\nFor privacy questions, use Support & Feedback and the official owner contact configured by the service owner.`;
      const SUPPORT=`SUPPORT & FEEDBACK\n\nUse Support for account access problems, bugs, feature issues, Premium activation, Energy/Gems problems, payment questions and product feedback.\n\nBug Reports\nInclude the affected page, feature, steps to reproduce and any visible error message.\n\nPremium / Payment\nKeep the relevant receipt or transaction reference. Never send your banking password, PIN or OTP.\n\nOwner Contact\nThe official owner Telegram account can be configured later in one place without changing the app UI.`;
      const AGE=`18+ POLICY\n\nRuby Chan is strictly intended for adults aged 18 or older.\n\nYou must truthfully confirm your age before entering. Anyone under 18 must not access or use the service.\n\nSexual or exploitative content involving minors is prohibited.\n\nIf you are under 18, choose Exit and do not continue.`;

      const plans=[
        {id:'1m',name:'1 MONTH',price:'10,000 MMK',mark:'1M',cls:'ruby-plan-1m',shop:'ruby-shop-1m'},
        {id:'3m',name:'3 MONTHS',price:'25,000 MMK',mark:'3M',cls:'ruby-plan-3m',shop:'ruby-shop-3m'},
        {id:'1y',name:'1 YEAR',price:'100,000 MMK',mark:'1Y',cls:'ruby-plan-1y',shop:'ruby-shop-1y'}
      ];

      const currentPlan=()=>localStorage.getItem('ruby_selected_plan')||'free';
      const activePlan=()=>plans.find(p=>p.id===currentPlan())||{id:'free',name:'FREE',price:'Free',mark:'FREE',cls:'ruby-plan-free'};

      const policy=(title,body)=>{
        let d=document.getElementById('rubyPolicyDialog');
        if(!d){d=document.createElement('div');d.id='rubyPolicyDialog';d.innerHTML='<div class="ruby-policy-card"><h2></h2><div class="ruby-policy-body"></div><button class="ruby-policy-close">Close</button></div>';document.body.appendChild(d);d.querySelector('.ruby-policy-close').onclick=()=>d.classList.remove('open');d.onclick=e=>{if(e.target===d)d.classList.remove('open')}}
        d.querySelector('h2').textContent=title;d.querySelector('.ruby-policy-body').textContent=body;d.classList.add('open');
      };

      const shop=()=>{
        let d=document.getElementById('rubyPremiumShop');
        if(!d){
          d=document.createElement('div');d.id='rubyPremiumShop';
          d.innerHTML='<div class="ruby-shop-shell"><div class="ruby-shop-head"><button class="ruby-shop-back">‹ Back</button><div><div class="ruby-shop-title">PREMIUM SHOP</div><div class="ruby-shop-sub">Choose a membership plan</div></div><div style="width:52px"></div></div><div class="ruby-shop-card"><div class="ruby-shop-grid" id="rubyShopPlans"></div><div class="ruby-shop-pay" id="rubyShopPay" hidden></div></div></div>';
          document.body.appendChild(d);d.querySelector('.ruby-shop-back').onclick=()=>d.classList.remove('open');
        }
        const list=d.querySelector('#rubyShopPlans');
        list.innerHTML=plans.map(p=>'<div class="ruby-shop-plan" data-plan="'+p.id+'"><div class="ruby-shop-badge '+p.shop+'"><b>'+p.mark+'</b></div><div><div class="ruby-shop-name">'+p.name+'</div><div class="ruby-shop-price">'+p.price+'</div><div class="ruby-shop-copy">Premium access</div></div><button class="ruby-upgrade" data-upgrade="'+p.id+'">UPGRADE</button></div>').join('');
        list.querySelectorAll('.ruby-shop-plan').forEach(c=>c.onclick=()=>choosePlan(c.dataset.plan));
        list.querySelectorAll('[data-upgrade]').forEach(b=>b.onclick=e=>{e.stopPropagation();choosePlan(b.dataset.upgrade)});
        d.classList.add('open');
      };

      const choosePlan=id=>{
        const p=plans.find(x=>x.id===id);if(!p)return;localStorage.setItem('ruby_selected_plan',id);updatePlanBadge();shop();
        const pay=document.getElementById('rubyShopPay');if(!pay)return;pay.hidden=false;pay.innerHTML='<h3>PAYMENT · '+p.name+'</h3><div class="ruby-pay-summary">Selected plan: <b>'+p.name+'</b> · <b>'+p.price+'</b></div><div class="ruby-pay-methods"><div class="ruby-pay-method"><b>KBZPay</b><small>Payment connection can be configured here.</small></div><div class="ruby-pay-method"><b>WavePay</b><small>Payment connection can be configured here.</small></div><div class="ruby-pay-method"><b>Telegram Payment</b><small>Use the configured owner/payment flow.</small></div><div class="ruby-pay-method"><b>Other</b><small>Add another supported payment method later.</small></div></div>';pay.scrollIntoView({behavior:'smooth',block:'nearest'});
      };

      const updatePlanBadge=()=>{
        const root=document.getElementById('settings-overwrite-root');if(!root)return;const p=activePlan();const b=root.querySelector('.ruby-plan-badge');const n=root.querySelector('.ruby-plan-name-current');const c=root.querySelector('.ruby-plan-copy-current');if(!b)return;
        b.className='ruby-plan-badge '+p.cls;b.innerHTML='<span class="ruby-plan-corner">PLAN</span><span class="ruby-plan-mark">'+p.mark+'</span><span class="ruby-plan-sub">'+(p.id==='free'?'ACCESS':'PREMIUM')+'</span>';if(n)n.textContent=p.name;if(c)c.textContent=p.id==='free'?'Free membership · tap to view plans':p.price+' · Premium membership';b.onclick=()=>p.id==='free'?shop():choosePlan(p.id);
      };

      const rebuildSettings=()=>{
        const page=document.getElementById('settings')||document.getElementById('page-settings')||document.querySelector('[data-page="settings"]')||document.querySelector('.view[id*="setting"]');
        if(!page)return;
        if(document.getElementById('settings-overwrite-root')){updatePlanBadge();return;}
        const oldTitle=page.querySelector('h1,.settings-title,.settings-page-title');if(oldTitle)oldTitle.remove();
        page.innerHTML='<div id="settings-overwrite-root"><div class="ruby-settings-section">YOUR PLAN</div><section class="ruby-settings-card ruby-plan-card"><div class="ruby-plan-info"><strong class="ruby-plan-name-current">FREE</strong><small class="ruby-plan-copy-current">Free membership · tap to view plans</small></div><div class="ruby-plan-badge ruby-plan-free"><span class="ruby-plan-corner">PLAN</span><span class="ruby-plan-mark">FREE</span><span class="ruby-plan-sub">ACCESS</span></div><button class="ruby-view-plans" id="rubySettingsViewPlans">VIEW PLANS</button></section><div class="ruby-settings-section">LANGUAGE</div><section class="ruby-settings-row"><div><strong>Language</strong><small>Choose the language used across the platform.</small></div><select class="ruby-lang" id="rubySettingsLanguage"><option value="en">English</option><option value="my">မြန်မာ</option></select></section><div class="ruby-settings-section">SUPPORT & FEEDBACK</div><button class="ruby-settings-row" id="rubySupport"><div><strong>Support & Feedback</strong><small>Account, bugs, Premium, Energy/Gems and payment help.</small></div><span class="ruby-chevron">›</span></button><div class="ruby-settings-section">LEGAL & POLICIES</div><button class="ruby-settings-row" id="rubyTerms"><div><strong>Terms & Conditions</strong><small>Read the full service terms.</small></div><span class="ruby-chevron">›</span></button><button class="ruby-settings-row" id="rubyPrivacy"><div><strong>Privacy Policy</strong><small>Learn how platform data is handled.</small></div><span class="ruby-chevron">›</span></button><button class="ruby-settings-row" id="rubyAgePolicy"><div><strong>18+ Policy</strong><small>Adults-only access and safety rules.</small></div><span class="ruby-chevron">›</span></button><section class="ruby-settings-card ruby-legal-note"><strong>18+ Adults Only</strong><p>Ruby Chan is available only to adults aged 18 and older.</p></section></div>';
        document.getElementById('rubySettingsViewPlans').onclick=shop;document.querySelector('#rubySupport').onclick=()=>policy('SUPPORT & FEEDBACK',SUPPORT);document.querySelector('#rubyTerms').onclick=()=>policy('TERMS & CONDITIONS',TERMS);document.querySelector('#rubyPrivacy').onclick=()=>policy('PRIVACY POLICY',PRIVACY);document.querySelector('#rubyAgePolicy').onclick=()=>policy('18+ POLICY',AGE);const l=document.getElementById('rubySettingsLanguage');l.value=localStorage.getItem('ruby_language')||'en';l.onchange=()=>localStorage.setItem('ruby_language',l.value);updatePlanBadge();
      };

      const heading=()=>{
        document.querySelectorAll('.view').forEach(v=>{
          const active=v.classList.contains('active');if(!active)return;
          let h=v.querySelector(':scope > .ruby-page-heading');if(!h){h=document.createElement('div');h.className='ruby-page-heading';v.prepend(h)}
          const id=(v.id||'').toLowerCase();let name='';if(id.includes('character'))name='CHARACTERS';else if(id.includes('history'))name='HISTORY';else if(id.includes('recharge')||id.includes('premium'))name='RECHARGE';else if(id.includes('setting'))name='SETTINGS';else name='';h.textContent=name;h.style.display=name?'block':'none';
        });
      };

      const ageGate=()=>{
        if(localStorage.getItem('ruby_age_confirmed')==='true'){document.getElementById('rubyAgeGateSafe')?.remove();return}
        let g=document.getElementById('rubyAgeGateSafe');if(!g){g=document.createElement('div');g.id='rubyAgeGateSafe';g.className='open';g.innerHTML='<div class="ruby-age-card"><div class="ruby-age-mark">18+</div><div class="ruby-age-title">Adults Only</div><div class="ruby-age-copy">You must be 18 or older to enter Ruby Chan and use its adult-only AI companion features.</div><label class="ruby-check"><input id="rubyAgeConfirm" type="checkbox"><span>Yes, I’m 18+ and I confirm that I am at least 18 years old.</span></label><label class="ruby-check"><input id="rubyTermsConfirm" type="checkbox"><span>I have read and agree to the <a href="#" id="rubyAgeTerms">Terms & Conditions</a>.</span></label><label class="ruby-check"><input id="rubyDontAgain" type="checkbox"><span>Don’t show this confirmation again on this device.</span></label><button id="rubyAgeContinue" class="ruby-age-continue" disabled>ENTER RUBY CHAN</button><button id="rubyAgeExit" class="ruby-age-exit">EXIT</button></div>';document.body.appendChild(g);
          const a=g.querySelector('#rubyAgeConfirm'),t=g.querySelector('#rubyTermsConfirm'),d=g.querySelector('#rubyDontAgain'),c=g.querySelector('#rubyAgeContinue');const sync=()=>{const ok=a.checked&&t.checked;c.disabled=!ok;c.classList.toggle('ready',ok)};a.onchange=sync;t.onchange=sync;g.querySelector('#rubyAgeTerms').onclick=e=>{e.preventDefault();policy('TERMS & CONDITIONS',TERMS)};c.onclick=()=>{localStorage.setItem('ruby_age_confirmed','true');if(d.checked)localStorage.setItem('ruby_age_terms_accepted','true');g.remove()};g.querySelector('#rubyAgeExit').onclick=()=>{document.body.innerHTML='<div style="min-height:100vh;display:grid;place-items:center;background:#07040a;color:#f7eef6;font:700 18px system-ui;text-align:center;padding:30px">Access restricted.<br><span style="font-size:12px;color:#a996a5">Ruby Chan is for adults aged 18+ only.</span></div>'};
        }
      };

      // Hide the old Ruby Chan brand strip but preserve Energy + Gems.
      const hideBrand=()=>{document.querySelectorAll('.top .brand,.top .status').forEach(e=>e.style.display='none')};

      // Route nav clicks without interfering with the core app implementation.
      document.addEventListener('click',e=>{
        const nav=e.target.closest?.('.nav button');if(nav){setTimeout(()=>{heading();const active=document.querySelector('.view.active');if(active&&(active.id||'').toLowerCase().includes('setting'))rebuildSettings()},120)}
      },true);

      hideBrand();heading();
      setTimeout(()=>{hideBrand();heading();rebuildSettings();ageGate()},700);
      setInterval(()=>{hideBrand();heading()},1200);
    }catch(err){console.error('Ruby Lucid UI error',err)}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();