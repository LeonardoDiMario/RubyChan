(()=>{
  const boot=()=>{
    const page=document.getElementById('settings')||document.getElementById('page-settings')||document.querySelector('[data-page="settings"]')||document.querySelector('.view[id*="setting"]');
    const root=document.getElementById('settings-overwrite-root');
    if(!page||!root||root.querySelector('.ruby-plan-badges'))return;
    const old= root.querySelector('.ruby-plan-badges'); if(old) old.remove();
    const section=document.createElement('div');
    section.className='ruby-plan-badges';
    section.innerHTML=`
      <div class="settings-section-title">PREMIUM PLANS</div>
      <section class="settings-card ruby-plan-grid">
        <div class="ruby-plan-card ruby-plan-1m"><div class="ruby-plan-logo"><span>1M</span><small>PREMIUM</small></div><div><b>1 MONTH</b><small>Premium Access</small></div></div>
        <div class="ruby-plan-card ruby-plan-3m"><div class="ruby-plan-logo"><span>3M</span><small>PREMIUM</small></div><div><b>3 MONTHS</b><small>Premium Access</small></div></div>
        <div class="ruby-plan-card ruby-plan-1y"><div class="ruby-plan-logo"><span>1Y</span><small>PREMIUM</small></div><div><b>1 YEAR</b><small>Premium Access</small></div></div>
      </section>`;
    const planSection=section.querySelector('.ruby-plan-grid');
    const style=document.createElement('style');
    style.textContent=`
      .ruby-plan-badges{display:grid;gap:8px}.ruby-plan-grid{padding:9px!important;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.ruby-plan-card{display:flex;align-items:center;gap:9px;padding:9px;border:1px solid rgba(242,182,216,.16);border-radius:14px;background:rgba(255,255,255,.035);color:#fff5fb}.ruby-plan-logo{width:48px;height:48px;flex:0 0 48px;display:grid;place-items:center;position:relative;border-radius:13px;background:linear-gradient(145deg,#2b1c31,#17101d);border:1px solid rgba(255,255,255,.12);box-shadow:0 8px 22px rgba(0,0,0,.28),inset 0 1px rgba(255,255,255,.05);overflow:hidden}.ruby-plan-logo::after{content:"";position:absolute;inset:5px;border-radius:9px;border:1px solid rgba(255,255,255,.06)}.ruby-plan-logo span{font-weight:1000;font-size:12px;letter-spacing:.06em;z-index:1}.ruby-plan-logo small{position:absolute;bottom:5px;font-size:6px;letter-spacing:.08em;color:rgba(255,255,255,.45);z-index:1}.ruby-plan-card b{font-size:10px;display:block}.ruby-plan-card>div:last-child small{display:block;margin-top:3px;font-size:8px;color:#bca5b7}.ruby-plan-1m .ruby-plan-logo span{color:#ff9fc9;text-shadow:0 0 13px rgba(255,159,201,.28)}.ruby-plan-3m .ruby-plan-logo span{color:#bda3ff;text-shadow:0 0 13px rgba(189,163,255,.28)}.ruby-plan-1y .ruby-plan-logo span{color:#ffe59d;text-shadow:0 0 13px rgba(255,229,157,.25)}
      @media(max-width:600px){.ruby-plan-grid{grid-template-columns:1fr}.ruby-plan-card{min-height:60px}.ruby-plan-logo{width:46px;height:46px;flex-basis:46px}}
    `;
    document.head.appendChild(style);
    root.querySelector('.settings-page-title')?.insertAdjacentElement('afterend',section);
  };
  const run=()=>setTimeout(boot,90);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
