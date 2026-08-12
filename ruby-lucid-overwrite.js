(()=>{
  const boot=()=>{
    try{
      if(document.documentElement.dataset.rubyLucidStable==='1')return;
      document.documentElement.dataset.rubyLucidStable='1';

      const style=document.createElement('style');
      style.textContent=`
        /* Hide the old brand bar without hiding the real balance controls. */
        .ruby-old-top-hidden{display:none!important}
        #rubyBalanceDock{position:fixed!important;top:10px!important;right:12px!important;left:auto!important;z-index:9999!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;pointer-events:none!important;width:max-content!important;margin:0!important;padding:0!important}
        #rubyBalanceDock .balances{display:flex!important;align-items:center!important;gap:6px!important;pointer-events:auto!important;position:static!important;width:auto!important}
        #rubyBalanceDock .pill{padding:7px 9px!important;border-radius:12px!important;background:rgba(10,13,28,.92)!important;border:1px solid rgba(242,182,216,.17)!important;box-shadow:0 10px 28px rgba(0,0,0,.34)!important}
        #rubyBalanceDock .pill b{font-style:normal!important;transform:none!important}
        .ruby-settings-root{display:grid;gap:11px;padding:0 0 110px}
        .ruby-settings-title{margin:0!important;padding:0 1px 3px!important;font-size:28px!important;font-weight:950!important;letter-spacing:.16em!important;color:#f4deec!important;font-style:normal!important;transform:none!important;text-shadow:0 0 22px rgba(255,112,173,.14)}
        .ruby-card{border:1px solid rgba(242,182,216,.16)!important;border-radius:18px!important;background:linear-gradient(180deg,rgba(34,20,40,.92),rgba(19,12,27,.95))!important;box-shadow:0 16px 42px rgba(0,0,0,.25)!important;color:#f7eef6!important}
        .ruby-plan{display:grid;grid-template-columns:78px 1fr;grid-template-rows:auto auto;gap:5px 12px;align-items:center;padding:15px}
        .ruby-plan-info strong{display:block;font-size:23px;color:#fff1fa;font-style:normal;transform:none}.ruby-plan-info small{display:block;margin-top:4px;color:#baa4b1;font-size:10px}
        .ruby-plan-badge{grid-column:1;grid-row:1 / span 2;width:72px;height:72px;border-radius:18px;display:grid;place-items:center;position:relative;overflow:hidden;background:linear-gradient(145deg,#2c1b32,#17101d);border:1px solid rgba(255,255,255,.12);box-shadow:0 10px 28px rgba(0,0,0,.35);cursor:pointer}
        .ruby-plan-badge:after{content:"";position:absolute;inset:7px;border-radius:12px;border:1px solid rgba(255,255,255,.07)}
        .ruby-plan-corner{position:absolute;top:7px;right:8px;font-size:7px;color:#ffffff77;font-weight:950}.ruby-plan-mark{font-size:17px;font-weight:1000;font-style:normal;transform:none}.ruby-plan-sub{position:absolute;bottom:6px;left:0;right:0;text-align:center;font-size:8px;color:#ffffff77;letter-spacing:.12em}
        .free .ruby-plan-mark{color:#ddd3df}.m1 .ruby-plan-mark{color:#ff9fc9}.m3 .ruby-plan-mark{color:#c5a9ff}.y1 .ruby-plan-mark{color:#ffe69b}
        .ruby-view-plans{grid-column:2;grid-row:2;justify-self:start;border:0!important;border-radius:999px!important;padding:9px 13px!important;background:linear-gradient(135deg,#ff70ad,#8e70ff)!important;color:#fff!important;font-weight:900!important;font-style:normal!important;transform:none!important;text-decoration:none!important;cursor:pointer!important;pointer-events:auto!important}
        .ruby-section{font-size:9px;font-weight:950;letter-spacing:.16em;color:#dca2bf;margin:6px 2px 0;text-transform:uppercase}
        .ruby-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px!important;width:100%!important;text-align:left!important;color:#fff!important;border:1px solid rgba(242,182,216,.16)!important;border-radius:16px!important;background:linear-gradient(180deg,rgba(34,20,40,.92),rgba(19,12,27,.95))!important;cursor:pointer!important;font-style:normal!important;transform:none!important}
        .ruby-row strong,.ruby-row small{font-style:normal!important;transform:none!important}.ruby-row strong{font-size:12px}.ruby-row small{display:block;margin-top:4px;color:#baa4b1;font-size:9px;line-height:1.45}.ruby-chevron{font-size:20px;color:#e3a6c5}.ruby-lang{padding:7px 9px;border-radius:10px;border:1px solid rgba(242,182,216,.18);background:#211522;color:#fff}
        .ruby-shop{position:fixed;inset:0;z-index:14000;display:none;overflow:auto;padding:14px 14px 110px;background:radial-gradient(circle at 18% 0%,#2a1732,#0b0710 45%,#050308);color:#f7eef6}.ruby-shop.open{display:block}
        .ruby-shop-shell{width:min(760px,100%);margin:auto}.ruby-shop-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.ruby-shop-title{font-size:22px;font-weight:950;letter-spacing:.12em}.ruby-shop-sub{font-size:10px;color:#a996a5;margin-top:4px}.ruby-back{border:1px solid rgba(242,182,216,.16);border-radius:11px;background:#16101d;color:#dcc9d5;padding:8px 11px;cursor:pointer}
        .ruby-shop-card{padding:15px;border-radius:20px;border:1px solid rgba(242,182,216,.16);background:linear-gradient(180deg,rgba(36,21,43,.95),rgba(19,12,26,.96));box-shadow:0 22px 70px rgba(0,0,0,.35)}
        .ruby-shop-grid{display:grid;gap:10px}.ruby-shop-plan{display:grid;grid-template-columns:68px 1fr auto;align-items:center;gap:12px;padding:12px;border-radius:16px;border:1px solid rgba(242,182,216,.13);background:#17101f;cursor:pointer}.ruby-shop-badge{width:66px;height:66px;border-radius:16px;display:grid;place-items:center;background:#11101a;border:1px solid rgba(255,255,255,.1)}.ruby-shop-badge b{font-size:17px;font-style:normal;transform:none}.ruby-shop-plan .one b{color:#f5a6cb}.ruby-shop-plan .three b{color:#bfa4ff}.ruby-shop-plan .year b{color:#ffe49a}
        .ruby-shop-name,.ruby-shop-price,.ruby-shop-copy{font-style:normal;transform:none}.ruby-shop-name{font-size:13px;font-weight:950;color:#fff3fa}.ruby-shop-price{font-size:12px;color:#f2b0cf;margin-top:4px}.ruby-shop-copy{font-size:9px;color:#9e8d99;margin-top:3px}
        .ruby-upgrade{border:0!important;border-radius:999px!important;padding:9px 13px!important;background:linear-gradient(135deg,#ff70ad,#8e70ff)!important;color:#fff!important;font-weight:900!important;font-size:10px!important;font-style:normal!important;font-family:inherit!important;line-height:1!important;letter-spacing:0!important;text-transform:uppercase!important;text-decoration:none!important;transform:none!important;white-space:nowrap!important;cursor:pointer!important}
        .ruby-pay{margin-top:13px;padding:14px;border:1px solid rgba(242,182,216,.14);border-radius:17px;background:#140e1a}.ruby-pay h3{margin:0;font-size:12px;letter-spacing:.12em;color:#e7abc7}.ruby-summary{margin-top:7px;font-size:11px;color:#e6d4df}.ruby-methods{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.ruby-method{padding:11px;border:1px solid rgba(242,182,216,.13);border-radius:13px;background:#18101f}.ruby-method b{font-size:11px}.ruby-method small{display:block;margin-top:4px;color:#9e8d99;font-size:8px;line-height:1.45}
        .ruby-modal{position:fixed;inset:0;z-index:15000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(7,4,10,.72);backdrop-filter:blur(14px)}.ruby-modal.open{display:flex}.ruby-modal-card{width:min(640px,100%);max-height:84vh;overflow:auto;border:1px solid rgba(242,182,216,.17);border-radius:22px;padding:19px;background:linear-gradient(180deg,#24182b,#140e18);box-shadow:0 30px 90px rgba(0,0,0,.52)}.ruby-modal-card h2{margin:0 0 12px;color:#f2b0cf;font-size:19px}.ruby-modal-body{white-space:pre-line;color:#cdb8c6;font-size:10px;line-height:1.7}.ruby-modal-close{margin-top:14px;border:0;border-radius:999px;padding:9px 14px;background:linear-gradient(135deg,#ff70ad,#8e70ff);color:#fff;font-weight:900;cursor:pointer}
        @media(max-width:600px){#rubyBalanceDock{top:8px!important;right:8px!important}.ruby-shop-plan{grid-template-columns:58px 1fr}.ruby-shop-badge{width:58px;height:58px}.ruby-methods{grid-template-columns:1fr}}
      `;
      document.head.appendChild(style);

      const TERMS=`RUBY CHAN — TERMS & CONDITIONS\n\n1. Eligibility & Age\nRuby Chan is an adults-only service. You must be at least 18 years old to access or use the platform.\n\n2. Fictional AI Companions\nRuby Chan characters are fictional AI companions.\n\n3. Acceptable Use\nUse the service lawfully and responsibly.\n\n4. Minors\nMinors may not use Ruby Chan.\n\n5. Account & Security\nProtect your Telegram account and authentication credentials.\n\n6. Premium, Energy & Gems\nPrices and packages are the values shown at purchase and may change.\n\n7. Telegram\nSome features connect with Telegram.\n\n8. Availability\nFeatures may change or be temporarily unavailable.\n\n9. Responsibility\nYou are responsible for your account activity.\n\n10. Updates\nThese Terms may be updated.`;
      const PRIVACY=`RUBY CHAN — PRIVACY POLICY\n\n1. Information We Process\nThe service may process account and session identifiers, preferences, character selections and conversation records needed to operate the platform.\n\n2. Conversation Data\nConversation data may be stored so chat and history features can work.\n\n3. Authentication\nAuthentication and session information may be used to protect access.\n\n4. Telegram\nTelegram Web App information may be used for Telegram features.\n\n5. Payments\nThird-party payment providers may process purchases.\n\n6. Local Storage\nThe app may use local storage for preferences.\n\n7. Third Parties\nService providers may process information required to provide their services.\n\n8. Children\nRuby Chan is not intended for anyone under 18.`;
      const SUPPORT=`SUPPORT & FEEDBACK\n\nUse Support for account access problems, bugs, feature issues, Premium activation, Energy/Gems problems, payment questions and feedback.\n\nBug Reports\nInclude the page, steps to reproduce and any visible error message.\n\nPremium / Payment\nKeep the relevant receipt or transaction reference. Never send your banking password, PIN or OTP.`;
      const AGE=`18+ POLICY\n\nRuby Chan is strictly intended for adults aged 18 or older. You must truthfully confirm your age before entering. Anyone under 18 must not access or use the service.`;

      const plans=[
        {id:'1m',name:'1 MONTH',price:'10,000 MMK',mark:'1M',cls:'m1',shopCls:'one'},
        {id:'3m',name:'3 MONTHS',price:'25,000 MMK',mark:'3M',cls:'m3',shopCls:'three'},
        {id:'1y',name:'1 YEAR',price:'100,000 MMK',mark:'1Y',cls:'y1',shopCls:'year'}
      ];
      const getCurrent=()=>localStorage.getItem('ruby_selected_plan')||'free';
      const getPlan=()=>plans.find(p=>p.id===getCurrent())||{id:'free',name:'FREE',price:'Free',mark:'FREE',cls:'free'};

      const openModal=(title,body)=>{let m=document.getElementById('rubyPolicyFix');if(!m){m=document.createElement('div');m.id='rubyPolicyFix';m.className='ruby-modal';m.innerHTML='<div class="ruby-modal-card"><h2></h2><div class="ruby-modal-body"></div><button class="ruby-modal-close">Close</button></div>';document.body.appendChild(m);m.querySelector('.ruby-modal-close').onclick=()=>m.classList.remove('open');m.onclick=e=>{if(e.target===m)m.classList.remove('open')}}m.querySelector('h2').textContent=title;m.querySelector('.ruby-modal-body').textContent=body;m.classList.add('open')};

      const syncBalances=()=>{
        const original=document.querySelector('.top .balances');
        let dock=document.getElementById('rubyBalanceDock');
        if(!original)return;
        if(!dock){dock=document.createElement('div');dock.id='rubyBalanceDock';document.body.appendChild(dock);}
        if(original.parentElement!==dock){dock.appendChild(original);}
        const oldTop=document.querySelector('.top');
        if(oldTop && oldTop!==dock){oldTop.classList.add('ruby-old-top-hidden');}
      };

      const openShop=(selected)=>{
        let shop=document.getElementById('rubyPremiumFix');
        if(!shop){shop=document.createElement('div');shop.id='rubyPremiumFix';shop.className='ruby-shop';shop.innerHTML='<div class="ruby-shop-shell"><div class="ruby-shop-head"><button class="ruby-back" type="button">‹ Back</button><div><div class="ruby-shop-title">PREMIUM SHOP</div><div class="ruby-shop-sub">Choose a membership plan</div></div><div></div></div><div class="ruby-shop-card"><div class="ruby-shop-grid" id="rubyPlanList"></div><div class="ruby-pay" id="rubyPaymentArea" hidden></div></div></div>';document.body.appendChild(shop);shop.querySelector('.ruby-back').onclick=()=>shop.classList.remove('open')}
        const list=shop.querySelector('#rubyPlanList');
        list.innerHTML=plans.map(p=>'<div class="ruby-shop-plan" data-plan="'+p.id+'"><div class="ruby-shop-badge '+p.shopCls+'"><b>'+p.mark+'</b></div><div><div class="ruby-shop-name">'+p.name+'</div><div class="ruby-shop-price">'+p.price+'</div><div class="ruby-shop-copy">Premium access</div></div><button type="button" class="ruby-upgrade" data-upgrade="'+p.id+'">UPGRADE</button></div>').join('');
        list.querySelectorAll('.ruby-shop-plan').forEach(card=>card.onclick=()=>selectPlan(card.dataset.plan));
        list.querySelectorAll('.ruby-upgrade').forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();selectPlan(btn.dataset.upgrade)});
        shop.classList.add('open');
        if(selected)selectPlan(selected);
      };

      const updateSettingsPlan=()=>{
        const root=document.getElementById('rubySettingsFix');if(!root)return;
        const p=getPlan();const badge=root.querySelector('.ruby-plan-badge');const name=root.querySelector('.ruby-plan-name');const copy=root.querySelector('.ruby-plan-copy');
        badge.className='ruby-plan-badge '+p.cls;badge.innerHTML='<span class="ruby-plan-corner">PLAN</span><span class="ruby-plan-mark">'+p.mark+'</span><span class="ruby-plan-sub">'+(p.id==='free'?'ACCESS':'PREMIUM')+'</span>';name.textContent=p.name;copy.textContent=p.id==='free'?'Free membership · tap View Plans':p.price+' · Premium membership';badge.onclick=()=>p.id==='free'?openShop():selectPlan(p.id);
      };

      const selectPlan=id=>{
        const p=plans.find(x=>x.id===id);if(!p)return;
        localStorage.setItem('ruby_selected_plan',id);updateSettingsPlan();openShop();
        const pay=document.getElementById('rubyPaymentArea');if(!pay)return;
        pay.hidden=false;pay.innerHTML='<h3>PAYMENT · '+p.name+'</h3><div class="ruby-summary">Selected plan: <b>'+p.name+'</b> · <b>'+p.price+'</b></div><div class="ruby-methods"><div class="ruby-method"><b>KBZPay</b><small>Payment connection can be configured here.</small></div><div class="ruby-method"><b>WavePay</b><small>Payment connection can be configured here.</small></div><div class="ruby-method"><b>Telegram Payment</b><small>Use the configured owner/payment flow.</small></div><div class="ruby-method"><b>Other</b><small>Add another supported payment method later.</small></div></div>';
        pay.scrollIntoView({behavior:'smooth',block:'nearest'});
      };

      const buildSettings=()=>{
        const page=document.getElementById('settings')||document.getElementById('page-settings')||document.querySelector('[data-page="settings"]')||document.querySelector('.view[id*="setting"]');
        if(!page)return;
        if(page.querySelector('#rubySettingsFix')){updateSettingsPlan();return;}
        page.querySelectorAll('h1,h2,h3,.section-head,.settings-page-title,.ruby-page-heading').forEach(el=>el.remove());
        page.querySelectorAll(':scope > *').forEach(el=>{if(el.id!=='rubySettingsFix')el.remove()});
        const root=document.createElement('div');root.id='rubySettingsFix';root.className='ruby-settings-root';root.innerHTML=`<div class="ruby-settings-title">SETTINGS</div><div class="ruby-section">YOUR PLAN</div><section class="ruby-card ruby-plan"><div class="ruby-plan-info"><strong class="ruby-plan-name">FREE</strong><small class="ruby-plan-copy">Free membership · tap View Plans</small></div><div class="ruby-plan-badge free"><span class="ruby-plan-corner">PLAN</span><span class="ruby-plan-mark">FREE</span><span class="ruby-plan-sub">ACCESS</span></div><button type="button" class="ruby-view-plans" id="rubyViewPlans">VIEW PLANS</button></section><div class="ruby-section">LANGUAGE</div><section class="ruby-row"><div><strong>Language</strong><small>Choose the language used across the platform.</small></div><select class="ruby-lang" id="rubyLang"><option value="en">English</option><option value="my">မြန်မာ</option></select></section><div class="ruby-section">SUPPORT & FEEDBACK</div><button type="button" class="ruby-row" id="rubySupport"><div><strong>Support & Feedback</strong><small>Account, bugs, Premium, Energy/Gems and payment help.</small></div><span class="ruby-chevron">›</span></button><div class="ruby-section">LEGAL & POLICIES</div><button type="button" class="ruby-row" id="rubyTerms"><div><strong>Terms & Conditions</strong><small>Read the full service terms.</small></div><span class="ruby-chevron">›</span></button><button type="button" class="ruby-row" id="rubyPrivacy"><div><strong>Privacy Policy</strong><small>Learn how platform data is handled.</small></div><span class="ruby-chevron">›</span></button><button type="button" class="ruby-row" id="rubyAgePolicy"><div><strong>18+ Policy</strong><small>Adults-only access and safety rules.</small></div><span class="ruby-chevron">›</span></button><section class="ruby-card ruby-legal-note"><strong>18+ Adults Only</strong><p>Ruby Chan is available only to adults aged 18 and older.</p></section>`;
        page.replaceChildren(root);
        root.querySelector('#rubyViewPlans').onclick=()=>openShop();root.querySelector('#rubySupport').onclick=()=>openModal('SUPPORT & FEEDBACK',SUPPORT);root.querySelector('#rubyTerms').onclick=()=>openModal('TERMS & CONDITIONS',TERMS);root.querySelector('#rubyPrivacy').onclick=()=>openModal('PRIVACY POLICY',PRIVACY);root.querySelector('#rubyAgePolicy').onclick=()=>openModal('18+ POLICY',AGE);
        const lang=root.querySelector('#rubyLang');lang.value=localStorage.getItem('ruby_language')||'en';lang.onchange=()=>localStorage.setItem('ruby_language',lang.value);
        updateSettingsPlan();
      };

      const setPageHeading=()=>{
        document.querySelectorAll('.view').forEach(v=>{
          const active=v.classList.contains('active');if(!active)return;
          const id=(v.id||'').toLowerCase();if(id.includes('setting')){buildSettings();return;}
          v.querySelectorAll(':scope > .ruby-page-heading').forEach((h,i)=>{if(i)h.remove()});
          let h=v.querySelector(':scope > .ruby-page-heading');if(!h){h=document.createElement('div');h.className='ruby-page-heading';v.prepend(h)}
          h.textContent=id.includes('character')?'CHARACTERS':id.includes('history')?'HISTORY':(id.includes('recharge')?'RECHARGE':'');h.style.display=h.textContent?'block':'none';h.style.pointerEvents='none';
        });
      };

      document.addEventListener('click',e=>{
        const nav=e.target.closest?.('.nav button');if(nav)setTimeout(setPageHeading,80);
      },true);

      setTimeout(()=>{syncBalances();setPageHeading()},250);
      setTimeout(()=>{syncBalances();setPageHeading()},900);
    }catch(err){console.error('Ruby Lucid stable UI error',err)}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();