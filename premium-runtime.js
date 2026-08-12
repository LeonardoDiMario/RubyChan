(()=>{
  const boot=()=>{
    if(document.documentElement.dataset.rubyPremiumRuntimeV3==='1')return;
    document.documentElement.dataset.rubyPremiumRuntimeV3='1';

    const style=document.createElement('style');
    style.id='ruby-premium-runtime-v3-css';
    style.textContent=`
      .top{position:fixed!important;top:10px!important;right:12px!important;z-index:9000!important;margin:0!important;display:block!important;width:auto!important;pointer-events:none!important}
      .top .brand,.top .status{display:none!important}
      .top .balances{display:flex!important;align-items:center!important;gap:6px!important;pointer-events:auto!important}
      .top .pill{backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 10px 26px rgba(0,0,0,.3)}
      .settings-page-title{display:none!important}
      .settings-plan{display:grid!important;grid-template-columns:78px 1fr!important;grid-template-rows:auto auto!important;align-items:center!important;gap:5px 12px!important}
      .settings-plan-badge{grid-column:1!important;grid-row:1 / span 2!important;width:72px!important;height:72px!important;flex-basis:72px!important}
      .settings-plan>div:first-child{grid-column:2!important;grid-row:1!important}
      .ruby-settings-viewplans{grid-column:2!important;grid-row:2!important;width:max-content!important;margin:4px 0 0!important}
      .ruby-current-plan-badge{cursor:pointer}
      .ruby-current-plan-badge:hover{transform:translateY(-1px);box-shadow:0 12px 30px rgba(0,0,0,.4),0 0 20px rgba(255,110,180,.12)}
      .ruby-current-plan-badge.plan-month .plan-mark{color:#ff9fc9;text-shadow:0 0 16px rgba(255,159,201,.32)}
      .ruby-current-plan-badge.plan-3month .plan-mark{color:#c5a9ff;text-shadow:0 0 16px rgba(197,169,255,.32)}
      .ruby-current-plan-badge.plan-year .plan-mark{color:#ffe79b;text-shadow:0 0 16px rgba(255,231,155,.30)}
      .ruby-membership-list{display:grid;gap:9px}
      .ruby-plan-row{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;padding:13px;border:1px solid rgba(242,182,216,.16);border-radius:16px;background:linear-gradient(180deg,rgba(34,20,40,.9),rgba(20,13,27,.92));cursor:pointer}
      .ruby-plan-row:hover{border-color:rgba(255,150,206,.32);transform:translateY(-1px)}
      .ruby-plan-name{font-size:13px;font-weight:950;color:#fff5fb}.ruby-plan-price{font-size:11px;color:#f2b0cf;margin-top:4px}.ruby-plan-desc{font-size:9px;color:#8f7c8c;margin-top:3px}
      .ruby-upgrade{border:0;border-radius:999px;padding:9px 13px;background:linear-gradient(135deg,#ff70ad,#8e70ff);color:#fff;font-weight:900;font-size:10px;cursor:pointer}
      .ruby-pay-page{position:fixed;inset:0;z-index:12000;display:none;background:radial-gradient(circle at 18% 0%,#2a1732,#0b0710 45%,#050308);color:#f7eef6;overflow:auto}.ruby-pay-page.open{display:block}
      .ruby-pay-shell{width:min(760px,100%);margin:auto;padding:14px 14px 120px}.ruby-pay-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}.ruby-pay-back{border:1px solid rgba(242,182,216,.17);background:#16101d;color:#d9c8d4;border-radius:11px;padding:8px 11px;font-size:11px;cursor:pointer}.ruby-pay-title{font-size:22px;font-weight:950;letter-spacing:.12em}.ruby-pay-sub{font-size:10px;color:#a996a5;margin-top:4px}.ruby-pay-card{padding:18px;border-radius:20px;border:1px solid rgba(242,182,216,.17);background:linear-gradient(180deg,rgba(36,21,43,.95),rgba(20,12,26,.95))}.ruby-pay-grid{display:grid;gap:10px}.ruby-pay-plan{display:grid;grid-template-columns:66px 1fr auto;align-items:center;gap:12px;padding:12px;border:1px solid rgba(242,182,216,.14);border-radius:16px;background:#17101f;cursor:pointer;transition:.16s}.ruby-pay-plan:hover{border-color:rgba(255,150,206,.34);transform:translateY(-1px);box-shadow:0 10px 25px rgba(0,0,0,.25)}.ruby-pay-badge{width:66px;height:66px;border-radius:16px;display:grid;place-items:center;background:#11101a;border:1px solid rgba(255,255,255,.1)}.ruby-pay-badge b{font-size:17px}.month b{color:#f5a6cb}.three b{color:#bfa4ff}.year b{color:#ffe49a}.ruby-pay-name{font-size:13px;font-weight:950;color:#fff3fa}.ruby-pay-price{font-size:12px;color:#f2b0cf;margin-top:4px}.ruby-pay-copy{font-size:9px;color:#9e8d99;margin-top:3px}.ruby-pay-section{margin-top:14px;font-size:10px;letter-spacing:.14em;font-weight:950;color:#e6a5c8}.ruby-pay-methods{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:8px}.ruby-payment-card{padding:13px;border:1px solid rgba(242,182,216,.16);border-radius:16px;background:#17101f}.ruby-payment-card strong{font-size:12px}.ruby-payment-card small{display:block;margin-top:4px;font-size:9px;color:#9e8d99}.ruby-pay-hint{margin-top:10px;font-size:9px;color:#988795;line-height:1.55}
      @media(max-width:600px){.top{top:8px!important;right:8px!important}.top .pill{padding:6px 8px}.settings-plan{grid-template-columns:68px 1fr!important}.settings-plan-badge{width:62px!important;height:62px!important}.ruby-pay-plan{grid-template-columns:58px 1fr}.ruby-pay-badge{width:58px;height:58px}.ruby-pay-methods{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);

    const plans=[
      {id:'1m',name:'1 MONTH',price:'10,000 MMK',cls:'month',mark:'1M',desc:'Premium access for 1 month.'},
      {id:'3m',name:'3 MONTHS',price:'25,000 MMK',cls:'three',mark:'3M',desc:'Premium access for 3 months.'},
      {id:'1y',name:'1 YEAR',price:'100,000 MMK',cls:'year',mark:'1Y',desc:'Premium access for 1 year.'}
    ];

    const getCurrentPlan=()=>localStorage.getItem('ruby_selected_plan')||'free';
    const currentPlan=()=>plans.find(p=>p.id===getCurrentPlan())||{id:'free',name:'FREE',price:'Free',cls:'free',mark:'FREE',desc:'Free access.'};

    const updatePlanBadge=()=>{
      const root=document.getElementById('settings-overwrite-root');if(!root)return;
      const badge=root.querySelector('.settings-plan-badge');const plan=root.querySelector('.settings-plan');if(!badge||!plan)return;
      const cur=currentPlan();
      badge.className='settings-plan-badge ruby-current-plan-badge plan-'+cur.cls;
      badge.setAttribute('aria-label',cur.name+' plan');
      badge.innerHTML='<span class="plan-corner">PLAN</span><span class="plan-mark">'+cur.mark+'</span><span class="plan-icon">'+(cur.id==='free'?'ACCESS':'PREMIUM')+'</span>';
      const strong=plan.querySelector('.ruby-current-plan-name');if(strong)strong.textContent=cur.name;
      const small=plan.querySelector('.ruby-current-plan-copy');if(small)small.textContent=cur.id==='free'?'Manage your Ruby Chan membership.':cur.price+' · Premium access';
      badge.onclick=()=>openPayment(cur.id==='free'?null:cur.id);
    };

    const getPage=()=>{
      let p=document.getElementById('rubyPremiumPage');
      if(!p){
        p=document.createElement('div');p.id='rubyPremiumPage';p.className='ruby-pay-page';
        p.innerHTML='<div class="ruby-pay-shell"><div class="ruby-pay-head"><button class="ruby-pay-back" type="button">‹ Back</button><div><div class="ruby-pay-title">PREMIUM</div><div class="ruby-pay-sub">Choose a plan and continue.</div></div><div style="width:58px"></div></div><div class="ruby-pay-card"><div class="ruby-pay-section">SELECT A PLAN</div><div class="ruby-pay-grid" id="rubyPayPlans"></div><div id="rubyPayCheckout"></div></div></div>';
        document.body.appendChild(p);p.querySelector('.ruby-pay-back').onclick=()=>p.classList.remove('open');
      }return p;
    };

    const showCheckout=id=>{
      const x=plans.find(p=>p.id===id)||plans[0],p=getPage();
      localStorage.setItem('ruby_selected_plan',x.id);updatePlanBadge();
      p.querySelector('#rubyPayCheckout').innerHTML='<div class="ruby-pay-section">PAYMENT · '+x.name+'</div><div class="ruby-pay-methods"><div class="ruby-payment-card"><strong>KBZPay</strong><small>Connect your verified payment flow here.</small></div><div class="ruby-payment-card"><strong>WavePay</strong><small>Connect your verified payment flow here.</small></div><div class="ruby-payment-card"><strong>Telegram Payment</strong><small>Use the configured owner/payment flow.</small></div><div class="ruby-payment-card"><strong>Other</strong><small>Add another method later.</small></div></div><div class="ruby-pay-hint">Selected plan: <b>'+x.name+'</b> · <b>'+x.price+'</b>. Premium should only activate after server-side payment verification.</div>';
      p.querySelector('#rubyPayCheckout').scrollIntoView({behavior:'smooth',block:'nearest'});
    };

    const renderPlans=()=>{
      const p=getPage();
      p.querySelector('#rubyPayPlans').innerHTML=plans.map(x=>'<div class="ruby-pay-plan" data-plan-card="'+x.id+'"><div class="ruby-pay-badge '+x.cls+'"><b>'+x.mark+'</b></div><div><div class="ruby-pay-name">'+x.name+'</div><div class="ruby-pay-price">'+x.price+'</div><div class="ruby-pay-copy">'+x.desc+'</div></div><button class="ruby-upgrade" data-plan="'+x.id+'" type="button">UPGRADE</button></div>').join('');
      p.querySelectorAll('[data-plan-card]').forEach(card=>{card.onclick=()=>showCheckout(card.dataset.planCard)});
      p.querySelectorAll('[data-plan]').forEach(b=>{b.onclick=e=>{e.stopPropagation();showCheckout(b.dataset.plan)}});
    };

    const openPayment=id=>{const p=getPage();renderPlans();p.classList.add('open');if(id)setTimeout(()=>showCheckout(id),40)};

    const enhanceSettings=()=>{
      const root=document.getElementById('settings-overwrite-root');if(!root)return;
      root.querySelectorAll('.settings-page-title').forEach(x=>x.remove());
      const plan=root.querySelector('.settings-plan');
      if(plan){
        const oldSection=[...root.querySelectorAll('.settings-section-title')].find(x=>x.textContent.trim()==='MEMBERSHIP');
        const oldCard=oldSection?.nextElementSibling;
        if(oldSection)oldSection.remove();if(oldCard)oldCard.remove();
        let view=plan.querySelector('#rubySettingsPlans');
        if(view){if(view.parentElement!==plan)plan.appendChild(view);view.classList.add('ruby-settings-viewplans');view.textContent='VIEW PLANS';if(!view.dataset.bound){view.dataset.bound='1';view.onclick=()=>openPayment()}}
        const main=plan.querySelector('div:first-child');
        if(main){main.querySelector('strong')?.classList.add('ruby-current-plan-name');main.querySelector('small')?.classList.add('ruby-current-plan-copy')}
        updatePlanBadge();
      }
    };

    const observer=new MutationObserver(enhanceSettings);observer.observe(document.body,{childList:true,subtree:true});
    enhanceSettings();
    window.RubyPremium={openPayment,showCheckout,updatePlanBadge,plans};
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();