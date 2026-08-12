(()=>{
  const boot=()=>{
    try{
      if(window.__rubyCleanLayer)return;
      window.__rubyCleanLayer=true;

      const css=document.createElement('style');
      css.textContent=`
        /* Top-right balances only. Remove old brand/status without touching values. */
        #rubyBalanceDock{position:fixed!important;top:10px!important;right:12px!important;left:auto!important;z-index:9999!important;display:flex!important;pointer-events:none!important}
        #rubyBalanceDock .balances{display:flex!important;align-items:center!important;gap:6px!important;pointer-events:auto!important;width:auto!important}
        #rubyBalanceDock .pill{display:flex!important;align-items:center!important;gap:6px!important;padding:6px 8px!important;border-radius:12px!important;background:rgba(10,13,28,.92)!important;border:1px solid rgba(242,182,216,.17)!important;box-shadow:0 10px 28px rgba(0,0,0,.34)!important}
        #rubyBalanceDock .pill b{font-style:normal!important;transform:none!important}
        #rubySettingsClean{display:grid;gap:12px;padding:0 0 105px}
        .ruby-section{font-size:9px;font-weight:950;letter-spacing:.16em;color:#dca2bf;margin:6px 2px 0;text-transform:uppercase}
        .ruby-card{border:1px solid rgba(242,182,216,.16)!important;border-radius:18px!important;background:linear-gradient(180deg,rgba(34,20,40,.92),rgba(19,12,27,.96))!important;box-shadow:0 16px 42px rgba(0,0,0,.25)!important;color:#f7eef6!important}
        .ruby-plan-card{padding:14px;display:flex;align-items:center;justify-content:space-between;gap:14px}
        .ruby-plan-info strong{display:block;font-size:22px;color:#fff1fa;font-style:normal!important;transform:none!important}.ruby-plan-info small{display:block;margin-top:4px;color:#baa4b1;font-size:10px;font-style:normal!important}
        .ruby-plan-badge{width:72px;height:72px;flex:0 0 72px;border-radius:18px;display:grid;place-items:center;position:relative;overflow:hidden;background:linear-gradient(145deg,#2c1b32,#17101d);border:1px solid rgba(255,255,255,.12);box-shadow:0 10px 28px rgba(0,0,0,.35)}
        .ruby-plan-badge:after{content:"";position:absolute;inset:7px;border-radius:12px;border:1px solid rgba(255,255,255,.07)}
        .ruby-plan-corner{position:absolute;top:7px;right:8px;font-size:7px;color:#ffffff77;font-weight:950}.ruby-plan-mark{font-size:17px;font-weight:1000;font-style:normal!important;transform:none!important}.ruby-plan-sub{position:absolute;bottom:6px;left:0;right:0;text-align:center;font-size:8px;color:#ffffff77;letter-spacing:.12em}
        .m1 .ruby-plan-mark{color:#ff9fc9}.m3 .ruby-plan-mark{color:#c5a9ff}.y1 .ruby-plan-mark{color:#ffe69b}
        .ruby-btn{border:0!important;border-radius:999px!important;padding:9px 13px!important;background:linear-gradient(135deg,#ff70ad,#8e70ff)!important;color:#fff!important;font-weight:900!important;font-style:normal!important;font-family:inherit!important;line-height:1!important;letter-spacing:0!important;text-decoration:none!important;transform:none!important;cursor:pointer!important;white-space:nowrap!important}
        .ruby-row{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;padding:13px!important;width:100%!important;text-align:left!important;color:#fff!important;border:1px solid rgba(242,182,216,.16)!important;border-radius:16px!important;background:linear-gradient(180deg,rgba(34,20,40,.92),rgba(19,12,27,.95))!important;cursor:pointer!important;font-style:normal!important;transform:none!important}
        .ruby-row strong,.ruby-row small{font-style:normal!important;transform:none!important}.ruby-row strong{font-size:12px}.ruby-row small{display:block;margin-top:4px;color:#baa4b1;font-size:9px;line-height:1.45}.ruby-chevron{font-size:20px;color:#e3a6c5}.ruby-lang{padding:7px 9px;border-radius:10px;border:1px solid rgba(242,182,216,.18);background:#211522;color:#fff}
        .ruby-shop{position:fixed;inset:0;z-index:14000;display:none;overflow:auto;padding:14px 14px 110px;background:radial-gradient(circle at 18% 0%,#2a1732,#0b0710 45%,#050308);color:#f7eef6}.ruby-shop.open{display:block}
        .ruby-shop-shell{width:min(760px,100%);margin:auto}.ruby-shop-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.ruby-shop-title{font-size:22px;font-weight:950;letter-spacing:.12em}.ruby-shop-sub{font-size:10px;color:#a996a5;margin-top:4px}.ruby-back{border:1px solid rgba(242,182,216,.16);border-radius:11px;background:#16101d;color:#dcc9d5;padding:8px 11px;cursor:pointer}
        .ruby-shop-card{padding:15px;border-radius:20px;border:1px solid rgba(242,182,216,.16);background:linear-gradient(180deg,rgba(36,21,43,.95),rgba(19,12,26,.96));box-shadow:0 22px 70px rgba(0,0,0,.35)}
        .ruby-shop-grid{display:grid;gap:10px}.ruby-shop-plan{display:grid;grid-template-columns:68px 1fr auto;align-items:center;gap:12px;padding:12px;border-radius:16px;border:1px solid rgba(242,182,216,.13);background:#17101f;cursor:pointer}.ruby-shop-badge{width:66px;height:66px;border-radius:16px;display:grid;place-items:center;background:#11101a;border:1px solid rgba(255,255,255,.1)}.ruby-shop-badge b{font-size:17px;font-style:normal!important;transform:none!important}.one b{color:#f5a6cb}.three b{color:#bfa4ff}.year b{color:#ffe49a}.ruby-shop-name,.ruby-shop-price,.ruby-shop-copy{font-style:normal!important;transform:none!important}.ruby-shop-name{font-size:13px;font-weight:950;color:#fff3fa}.ruby-shop-price{font-size:12px;color:#f2b0cf;margin-top:4px}.ruby-shop-copy{font-size:9px;color:#9e8d99;margin-top:3px}
        .ruby-payment{margin-top:13px;padding:14px;border:1px solid rgba(242,182,216,.14);border-radius:17px;background:#140e1a}.ruby-payment h3{margin:0;font-size:12px;letter-spacing:.12em;color:#e7abc7}.ruby-summary{margin-top:7px;font-size:11px;color:#e6d4df}.ruby-methods{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.ruby-method{padding:11px;border:1px solid rgba(242,182,216,.13);border-radius:13px;background:#18101f}.ruby-method b{font-size:11px}.ruby-method small{display:block;margin-top:4px;color:#9e8d99;font-size:8px;line-height:1.45}
        .ruby-modal{position:fixed;inset:0;z-index:15000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(7,4,10,.72);backdrop-filter:blur(14px)}.ruby-modal.open{display:flex}.ruby-modal-card{width:min(640px,100%);max-height:84vh;overflow:auto;border:1px solid rgba(242,182,216,.17);border-radius:22px;padding:19px;background:linear-gradient(180deg,#24182b,#140e18);box-shadow:0 30px 90px rgba(0,0,0,.52)}.ruby-modal-card h2{margin:0 0 12px;color:#f2b0cf;font-size:19px}.ruby-modal-body{white-space:pre-line;color:#cdb8c6;font-size:10px;line-height:1.7}.ruby-modal-close{margin-top:14px;border:0;border-radius:999px;padding:9px 14px;background:linear-gradient(135deg,#ff70ad,#8e70ff);color:#fff;font-weight:900;cursor:pointer}
        #rubyAgeGateClean{position:fixed;inset:0;z-index:30000;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(7,4,10,.88);backdrop-filter:blur(18px)}#rubyAgeGateClean.open{display:flex}.ruby-age-card{width:min(460px,100%);padding:23px;border-radius:25px;background:linear-gradient(180deg,#24182b,#120c17);border:1px solid rgba(242,182,216,.18);box-shadow:0 35px 100px rgba(0,0,0,.55)}.ruby-age-mark{text-align:center;font-size:38px;font-weight:1000;color:#ff9ac7}.ruby-age-title{text-align:center;margin-top:1px;font-size:23px;font-weight:950;color:#fff0f9}.ruby-age-copy{text-align:center;color:#cdb8c6;font-size:10px;line-height:1.7;margin-top:7px}.ruby-check{display:flex;gap:9px;align-items:flex-start;margin-top:10px;color:#ecdce7;font-size:10px;line-height:1.55}.ruby-check input{width:17px;height:17px;accent-color:#ff70ad;margin-top:0}.ruby-age-enter{width:100%;margin-top:12px;border:0;border-radius:999px;padding:12px;background:linear-gradient(135deg,#ff70ad,#8e70ff);color:#fff;font-weight:900;opacity:.4;cursor:not-allowed}.ruby-age-enter.ready{opacity:1;cursor:pointer}.ruby-age-exit{width:100%;margin-top:7px;border:0;border-radius:999px;padding:11px;background:#281a24;color:#d7bccb;font-weight:800;cursor:pointer}
        @media(max-width:600px){#rubyBalanceDock{top:8px!important;right:8px!important}.ruby-shop-plan{grid-template-columns:58px 1fr}.ruby-shop-badge{width:58px;height:58px}.ruby-methods{grid-template-columns:1fr}}
      `;
      document.head.appendChild(css);

      const TERMS=`RUBY CHAN — TERMS & CONDITIONS\n\n1. Eligibility & Age\nRuby Chan is an adults-only service. You must be at least 18 years old to access or use the platform.\n\n2. Fictional AI Companions\nRuby Chan characters are fictional AI companions.\n\n3. Acceptable Use\nUse the service lawfully and responsibly.\n\n4. Minors\nMinors may not use Ruby Chan.\n\n5. Account & Security\nProtect your Telegram account and authentication credentials.\n\n6. Premium, Energy & Gems\nPrices and packages are the values shown at purchase and may change.\n\n7. Telegram\nSome features connect with Telegram.\n\n8. Availability\nFeatures may change or be temporarily unavailable.\n\n9. Responsibility\nYou are responsible for your account activity.\n\n10. Updates\nThese Terms may be updated.`;
      const PRIVACY=`RUBY CHAN — PRIVACY POLICY\n\n1. Information We Process\nThe service may process account and session identifiers, preferences, character selections and conversation records needed to operate the platform.\n\n2. Conversation Data\nConversation data may be stored so chat and history features can work.\n\n3. Authentication\nAuthentication and session information may be used to protect access.\n\n4. Telegram\nTelegram Web App information may be used for Telegram features.\n\n5. Payments\nThird-party payment providers may process purchases.\n\n6. Local Storage\nThe app may use local storage for preferences.\n\n7. Third Parties\nService providers may process information required to provide their services.\n\n8. Children\nRuby Chan is not intended for anyone under 18.`;
      const SUPPORT=`SUPPORT & FEEDBACK\n\nUse Support for account access problems, bugs, feature issues, Premium activation, Energy/Gems problems, payment questions and feedback.\n\nBug Reports\nInclude the page, steps to reproduce and any visible error message.\n\nPremium / Payment\nKeep the relevant receipt or transaction reference. Never send your banking password, PIN or OTP.`;
      const AGE=`18+ POLICY\n\nRuby Chan is strictly intended for adults aged 18 or older. You must truthfully confirm your age before entering. Anyone under 18 must not access or use the service.`;

      const plans=[
        {id:'1m',name:'1 MONTH',price:'10,000 MMK',mark:'1M',cls:'m1',shopCls:'one'},
        {id:'3m',name:'3 MONTHS',price:'25,000 MMK',mark:'3M',cls:'m3',shopCls:'three'},
        {id:'1y',name:'1 YEAR',price:'100,000 MMK',mark:'1Y',cls:'y1',shopCls:'year'}
      ];
      const getActive=()=>localStorage.getItem('ruby_active_plan')||'';
      const activePlan=()=>plans.find(p=>p.id===getActive())||null;

      const modal=(title,body)=>{let m=document.getElementById('rubyCleanModal');if(!m){m=document.createElement('div');m.id='rubyCleanModal';m.className='ruby-modal';m.innerHTML='<div class="ruby-modal-card"><h2></h2><div class="ruby-modal-body"></div><button class="ruby-modal-close">Close</button></div>';document.body.appendChild(m);m.querySelector('.ruby-modal-close').onclick=()=>m.classList.remove('open');m.onclick=e=>{if(e.target===m)m.classList.remove('open')}}m.querySelector('h2').textContent=title;m.querySelector('.ruby-modal-body').textContent=body;m.classList.add('open')};

      const moveBalances=()=>{
        const balances=document.querySelector('.top .balances');
        if(!balances)return;
        let dock=document.getElementById('rubyBalanceDock');
        if(!dock){dock=document.createElement('div');dock.id='rubyBalanceDock';document.body.appendChild(dock)}
        if(balances.parentElement!==dock)dock.appendChild(balances);
        const top=balances.closest('.top');if(top)top.querySelectorAll('.brand,.status').forEach(el=>el.style.display='none');
      };

      const renderSettings=()=>{
        const page=document.getElementById('settings')||document.getElementById('page-settings')||document.querySelector('[data-page="settings"]')||document.querySelector('.view[id*="setting"]');
        if(!page)return;
        if(page.dataset.rubyCleanSettings==='1'){syncActivePlan();return}
        page.dataset.rubyCleanSettings='1';
        page.innerHTML='<div id="rubySettingsClean"><div id="rubyActivePlanWrap"></div><div class="ruby-section">MEMBERSHIP</div><button class="ruby-card ruby-row" id="rubyViewPlans"><div><strong>Premium Plans</strong><small>Choose 1 Month, 3 Months or 1 Year.</small></div><span class="ruby-chevron">›</span></button><div class="ruby-section">LANGUAGE</div><div class="ruby-card ruby-row"><div><strong>Language</strong><small>Choose the language used across the platform.</small></div><select class="ruby-lang" id="rubyLang"><option value="en">English</option><option value="my">မြန်မာ</option></select></div><div class="ruby-section">SUPPORT & FEEDBACK</div><button class="ruby-card ruby-row" id="rubySupport"><div><strong>Support & Feedback</strong><small>Account, bugs, Premium, Energy/Gems and payment help.</small></div><span class="ruby-chevron">›</span></button><div class="ruby-section">LEGAL & POLICIES</div><button class="ruby-card ruby-row" id="rubyTerms"><div><strong>Terms & Conditions</strong><small>Read the service terms.</small></div><span class="ruby-chevron">›</span></button><button class="ruby-card ruby-row" id="rubyPrivacy"><div><strong>Privacy Policy</strong><small>Learn how platform data is handled.</small></div><span class="ruby-chevron">›</span></button><button class="ruby-card ruby-row" id="ruby18"><div><strong>18+ Policy</strong><small>Adults-only access and safety rules.</small></div><span class="ruby-chevron">›</span></button></div>';
        document.getElementById('rubyViewPlans').onclick=()=>openShop();
        document.getElementById('rubySupport').onclick=()=>modal('SUPPORT & FEEDBACK',SUPPORT);
        document.getElementById('rubyTerms').onclick=()=>modal('TERMS & CONDITIONS',TERMS);
        document.getElementById('rubyPrivacy').onclick=()=>modal('PRIVACY POLICY',PRIVACY);
        document.getElementById('ruby18').onclick=()=>modal('18+ POLICY',AGE);
        const lang=document.getElementById('rubyLang');lang.value=localStorage.getItem('ruby_language')||'en';lang.onchange=()=>localStorage.setItem('ruby_language',lang.value);
        syncActivePlan();
      };

      const syncActivePlan=()=>{
        const wrap=document.getElementById('rubyActivePlanWrap');if(!wrap)return;
        const p=activePlan();
        if(!p){wrap.innerHTML='';return;}
        wrap.innerHTML='<div class="ruby-section">YOUR PLAN</div><section class="ruby-card ruby-plan-card"><div class="ruby-plan-info"><strong>'+p.name+'</strong><small>'+p.price+' · Active Premium plan</small></div><div class="ruby-plan-badge '+p.cls+'"><span class="ruby-plan-corner">PLAN</span><span class="ruby-plan-mark">'+p.mark+'</span><span class="ruby-plan-sub">PREMIUM</span></div></section>';
      };

      const activatePlan=id=>{
        localStorage.setItem('ruby_active_plan',id);
        closeShop();
        syncActivePlan();
      };
      const closeShop=()=>{document.getElementById('rubyPremiumClean')?.classList.remove('open')};
      const openShop=()=>{
        let s=document.getElementById('rubyPremiumClean');
        if(!s){s=document.createElement('div');s.id='rubyPremiumClean';s.className='ruby-shop';s.innerHTML='<div class="ruby-shop-shell"><div class="ruby-shop-head"><button class="ruby-back" type="button">‹ Back</button><div><div class="ruby-shop-title">PREMIUM SHOP</div><div class="ruby-shop-sub">Choose a membership plan</div></div><div></div></div><div class="ruby-shop-card"><div class="ruby-shop-grid" id="rubyCleanPlans"></div><div id="rubyCleanPayment"></div></div></div>';document.body.appendChild(s);s.querySelector('.ruby-back').onclick=closeShop}
        const list=s.querySelector('#rubyCleanPlans');
        list.innerHTML=plans.map(p=>'<div class="ruby-shop-plan" data-plan="'+p.id+'"><div class="ruby-shop-badge '+p.shopCls+'"><b>'+p.mark+'</b></div><div><div class="ruby-shop-name">'+p.name+'</div><div class="ruby-shop-price">'+p.price+'</div><div class="ruby-shop-copy">Premium access</div></div><button class="ruby-btn" data-upgrade="'+p.id+'" type="button">UPGRADE</button></div>').join('');
        list.querySelectorAll('.ruby-shop-plan').forEach(card=>card.onclick=()=>showPayment(card.dataset.plan));
        list.querySelectorAll('[data-upgrade]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();showPayment(btn.dataset.upgrade)});
        s.classList.add('open');
      };
      const showPayment=id=>{
        const p=plans.find(x=>x.id===id);if(!p)return;
        const area=document.getElementById('rubyCleanPayment');if(!area)return;
        area.innerHTML='<div class="ruby-payment"><h3>PAYMENT · '+p.name+'</h3><div class="ruby-summary">Selected plan: <b>'+p.name+'</b> · <b>'+p.price+'</b></div><div class="ruby-methods"><div class="ruby-method"><b>KBZPay</b><small>Payment connection can be configured here.</small></div><div class="ruby-method"><b>WavePay</b><small>Payment connection can be configured here.</small></div><div class="ruby-method"><b>Telegram Payment</b><small>Use the configured owner/payment flow.</small></div><div class="ruby-method"><b>Other</b><small>Add another supported payment method later.</small></div></div><button class="ruby-btn" id="rubyPaymentDone" type="button" style="margin-top:12px">ACTIVATE AFTER PAYMENT</button></div>';
        area.querySelector('#rubyPaymentDone').onclick=()=>activatePlan(p.id);
        area.scrollIntoView({behavior:'smooth',block:'nearest'});
      };

      const bindNav=()=>{
        document.addEventListener('click',e=>{
          const b=e.target.closest?.('.nav button');if(!b)return;
          setTimeout(()=>{moveBalances();renderSettings()},80);
        },true);
      };

      const ageGate=()=>{
        if(localStorage.getItem('ruby_age_confirmed')==='true')return;
        let g=document.getElementById('rubyAgeGateClean');
        if(!g){g=document.createElement('div');g.id='rubyAgeGateClean';g.className='open';g.innerHTML='<div class="ruby-age-card"><div class="ruby-age-mark">18+</div><div class="ruby-age-title">Adults Only</div><div class="ruby-age-copy">You must be 18 or older to enter Ruby Chan.</div><label class="ruby-check"><input id="rubyAgeOk" type="checkbox"><span>Yes, I’m 18+ and I confirm that I am at least 18 years old.</span></label><label class="ruby-check"><input id="rubyTermsOk" type="checkbox"><span>I have read and agree to the Terms & Conditions.</span></label><label class="ruby-check"><input id="rubyDontAgain" type="checkbox"><span>Don’t show this confirmation again on this device.</span></label><button id="rubyEnter" class="ruby-age-enter" disabled>ENTER RUBY CHAN</button><button id="rubyExit" class="ruby-age-exit">EXIT</button></div>';document.body.appendChild(g);const a=g.querySelector('#rubyAgeOk'),t=g.querySelector('#rubyTermsOk'),c=g.querySelector('#rubyEnter');const sync=()=>{const ok=a.checked&&t.checked;c.disabled=!ok;c.classList.toggle('ready',ok)};a.onchange=sync;t.onchange=sync;g.querySelector('#rubyTermsOk').parentElement.addEventListener('dblclick',()=>modal('TERMS & CONDITIONS',TERMS));c.onclick=()=>{localStorage.setItem('ruby_age_confirmed','true');g.remove()};g.querySelector('#rubyExit').onclick=()=>{document.body.innerHTML='<div style="min-height:100vh;display:grid;place-items:center;background:#07040a;color:#f7eef6;font:700 18px system-ui;text-align:center">Access restricted · 18+ only</div>'}}
      };

      moveBalances();
      bindNav();
      setTimeout(()=>{moveBalances();renderSettings();ageGate()},400);
    }catch(err){console.error('Ruby clean UI error',err)}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
