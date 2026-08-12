(()=>{
  const TERMS=`1. Eligibility & Age\nRuby Chan is an adults-only service. You must be at least 18 years old to access or use the platform.\n\n2. Fictional AI Companions\nRuby Chan characters are fictional AI companions. Their names, personalities, stories and responses are part of the fictional service experience.\n\n3. Acceptable Use\nUse Ruby Chan lawfully and responsibly. Do not use the service to harass, threaten, exploit, impersonate, defraud, target another person, or facilitate unlawful activity.\n\n4. Minors\nMinors may not use Ruby Chan. Any sexual or exploitative content involving anyone under 18 is strictly prohibited.\n\n5. Account & Security\nProtect your Telegram account, authentication credentials, passwords, PINs and OTPs. Support will never need your banking password or OTP.\n\n6. Premium, Energy & Gems\nPrices, packages, Premium plans, Energy and Gems are governed by the information shown at purchase and may change as the service evolves.\n\n7. Telegram\nSome features connect with Telegram. Use official Ruby Chan links and keep your Telegram account secure.\n\n8. Service Availability\nFeatures may be changed, suspended or unavailable during maintenance, technical work, security work or third-party outages.\n\n9. User Responsibility\nYou are responsible for your account activity and for complying with applicable law.\n\n10. Updates\nThese Terms may be updated when the platform or applicable requirements change.`;
  const PRIVACY=`1. Information We Process\nRuby Chan may process account identifiers, Telegram identifiers, device/session information, preferences, usage information, character selections, conversation records and security information required to operate the platform.\n\n2. Conversation Data\nConversation data may be processed or stored so AI chat, Chat History and related features can work. Some conversations may be subject to automatic deletion rules shown by the app.\n\n3. Authentication\nAuthentication and device/session information may be used to establish and protect access.\n\n4. Telegram\nTelegram Web App information may be used to connect your session and deliver Telegram-related features.\n\n5. Payments\nThird-party payment providers may process purchases. Never send banking passwords, PINs or OTPs to support.\n\n6. Local Storage\nThe app may use local storage for preferences and application state.\n\n7. Third Parties\nSupabase, AI, hosting, payment and other providers may process information required to provide their services and their own policies may apply.\n\n8. Retention\nRetention varies by feature and account state. Some conversations may be automatically deleted under the service rules.\n\n9. Children\nRuby Chan is not intended for children or anyone under 18.\n\n10. Privacy Contact\nFor privacy questions, use Support & Feedback and the official owner contact configured by the service owner.`;
  const AGE=`18+ ADULTS ONLY\n\nRuby Chan is strictly intended for adults who are at least 18 years old.\n\nYou must truthfully confirm that you are 18 or older before entering the platform. Anyone under 18 must not access or use the service.\n\nSexual or exploitative content involving minors is prohibited.\n\nIf you are under 18, choose Exit and do not continue.`;
  const SUPPORT=`Support & Feedback\n\nUse Support for account access problems, bugs, feature issues, Premium activation, Energy/Gems problems, payment questions and product feedback.\n\nBug Reports\nInclude the affected page, feature, steps to reproduce the problem and any visible error message.\n\nPayment / Premium Issues\nKeep the relevant receipt or transaction reference. Never send your banking password, PIN or OTP.\n\nOwner Contact\nThe official owner Telegram username is kept in one owner-contact setting and is not invented or guessed by the app.`;

  const boot=()=>{
    if(document.documentElement.dataset.rubySettingsOverwrite==='1')return;
    document.documentElement.dataset.rubySettingsOverwrite='1';

    if(!document.getElementById('ruby-settings-overwrite-css')){
      const s=document.createElement('style');s.id='ruby-settings-overwrite-css';s.textContent=`
        #settings-overwrite-root{width:100%}.settings-overwrite{display:grid;gap:12px;padding:2px 0 110px}.settings-page-title{font-size:30px;font-weight:950;letter-spacing:.18em;color:#9b5d7c;margin:0 0 4px}.settings-section-title{font-size:10px;font-weight:950;letter-spacing:.16em;color:#b46a91;margin:8px 2px 0}.settings-card{width:100%;border:1px solid rgba(223,163,195,.3);border-radius:18px;background:rgba(255,255,255,.44);box-shadow:0 14px 34px rgba(184,104,147,.10);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}.settings-plan{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:16px}.settings-plan .kicker{display:block;font-size:9px;letter-spacing:.15em;font-weight:950;color:#b46a91}.settings-plan strong{display:block;font-size:24px;color:#824d68;margin-top:3px}.settings-plan small{display:block;font-size:10px;color:#9b788b;margin-top:4px}.settings-btn{border:0;border-radius:999px;padding:10px 14px;background:linear-gradient(135deg,#ff70ad,#aa82ff);color:#fff;font-weight:900;cursor:pointer;white-space:nowrap}.settings-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px;text-align:left;color:#714e65}.settings-row strong{font-size:13px}.settings-row small{display:block;font-size:10px;color:#9b788b;margin-top:4px}.settings-link{border:1px solid rgba(223,163,195,.3);cursor:pointer}.settings-chevron{font-size:22px;color:#b46a91}.settings-select{padding:8px 10px;border-radius:11px;border:1px solid rgba(223,163,195,.35);background:rgba(255,255,255,.62);color:#714e65}.settings-note{padding:13px}.settings-note strong{font-size:12px;color:#824d68}.settings-note p{margin:5px 0 0;font-size:10px;line-height:1.6;color:#9b788b}.ruby-policy-modal{position:fixed;inset:0;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(50,25,42,.25);backdrop-filter:blur(10px);z-index:10000}.ruby-policy-modal.open{display:flex}.ruby-policy-card{width:min(640px,100%);max-height:84vh;overflow:auto;border-radius:22px;padding:20px;background:rgba(255,249,252,.98);border:1px solid rgba(255,255,255,.9);box-shadow:0 30px 90px rgba(90,45,70,.28);color:#704c64}.ruby-policy-card h2{margin:0 0 12px;font-size:20px;color:#9e4f79}.ruby-policy-body{white-space:pre-line;font-size:11px;line-height:1.75;color:#896879}.ruby-policy-close{margin-top:15px;border:0;border-radius:999px;padding:9px 15px;background:linear-gradient(135deg,#ff70ad,#aa82ff);color:#fff;font-weight:900;cursor:pointer}
      `;document.head.appendChild(s);
    }

    const findSettings=()=>document.getElementById('settings')||document.getElementById('page-settings')||document.querySelector('[data-page="settings"]')||document.querySelector('.view[id*="setting"]');
    const openPolicy=(title,body)=>{
      let m=document.getElementById('rubyPolicyModal');
      if(!m){m=document.createElement('div');m.id='rubyPolicyModal';m.className='ruby-policy-modal';m.innerHTML='<div class="ruby-policy-card"><h2></h2><div class="ruby-policy-body"></div><button class="ruby-policy-close" type="button">Close</button></div>';document.body.appendChild(m);m.querySelector('.ruby-policy-close').onclick=()=>m.classList.remove('open');m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')})}
      m.querySelector('h2').textContent=title;m.querySelector('.ruby-policy-body').textContent=body;m.classList.add('open');
    };

    const rebuildSettings=()=>{
      const page=findSettings();
      if(!page)return;
      let root=document.getElementById('settings-overwrite-root');
      if(root)return;

      // DIRECT OVERWRITE: remove every existing Settings child. No legacy Settings UI remains.
      while(page.firstChild)page.removeChild(page.firstChild);
      root=document.createElement('div');root.id='settings-overwrite-root';
      root.innerHTML=`<div class="settings-overwrite">
        <div class="settings-page-title">SETTINGS</div>
        <section class="settings-card settings-plan"><div><span class="kicker">YOUR PLAN</span><strong>FREE</strong><small>Manage your Ruby Chan membership.</small></div><button class="settings-btn" id="rubySettingsPlans" type="button">VIEW PLANS</button></section>
        <div class="settings-section-title">LANGUAGE</div>
        <section class="settings-card settings-row"><div><strong>Language</strong><small>Choose the language used across the platform.</small></div><select class="settings-select" id="rubySettingsLanguage"><option value="en">English</option><option value="my">မြန်မာ</option></select></section>
        <div class="settings-section-title">SUPPORT & FEEDBACK</div>
        <button class="settings-card settings-row settings-link" id="rubySettingsSupport" type="button"><div><strong>Support & Feedback</strong><small>Get help, report bugs, payment issues or send feedback.</small></div><span class="settings-chevron">›</span></button>
        <div class="settings-section-title">LEGAL & POLICIES</div>
        <button class="settings-card settings-row settings-link" id="rubySettingsTerms" type="button"><div><strong>Terms & Conditions</strong><small>Read the full service rules.</small></div><span class="settings-chevron">›</span></button>
        <button class="settings-card settings-row settings-link" id="rubySettingsPrivacy" type="button"><div><strong>Privacy Policy</strong><small>Learn how Ruby Chan handles platform data.</small></div><span class="settings-chevron">›</span></button>
        <button class="settings-card settings-row settings-link" id="rubySettingsAge" type="button"><div><strong>18+ Policy</strong><small>Adults-only access and safety rules.</small></div><span class="settings-chevron">›</span></button>
        <section class="settings-card settings-note"><strong>18+ Adults Only</strong><p>Ruby Chan is available only to adults aged 18 and older. You must confirm your age before entering the platform.</p></section>
      </div>`;
      page.appendChild(root);

      root.querySelector('#rubySettingsPlans').onclick=()=>document.getElementById('cardRecharge')?.click();
      root.querySelector('#rubySettingsSupport').onclick=()=>openPolicy('SUPPORT & FEEDBACK',SUPPORT);
      root.querySelector('#rubySettingsTerms').onclick=()=>openPolicy('TERMS & CONDITIONS',TERMS);
      root.querySelector('#rubySettingsPrivacy').onclick=()=>openPolicy('PRIVACY POLICY',PRIVACY);
      root.querySelector('#rubySettingsAge').onclick=()=>openPolicy('18+ POLICY',AGE);
      const lang=root.querySelector('#rubySettingsLanguage');lang.value=localStorage.getItem('ruby_language')||'en';lang.onchange=()=>localStorage.setItem('ruby_language',lang.value);
    };

    const ensureAgeGate=()=>{
      const old=document.getElementById('ageGate');if(old){old.classList.remove('hidden');return;}
      if(document.getElementById('rubyAgeOverwrite'))return;
      const g=document.createElement('div');g.id='rubyAgeOverwrite';g.style.cssText='position:fixed;inset:0;z-index:20000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(10,6,12,.84);backdrop-filter:blur(18px)';g.innerHTML='<div style="width:min(430px,100%);padding:24px;border-radius:24px;background:linear-gradient(180deg,#fff9fc,#f7edff);text-align:center;color:#714d65;box-shadow:0 30px 90px rgba(0,0,0,.42)"><div style="font-size:38px;font-weight:1000;color:#b04975">18+</div><h2 style="margin:0 0 10px">Adults only</h2><p style="font-size:11px;line-height:1.7;color:#957183">Ruby Chan is an adults-only AI companion platform. You must be 18 or older to continue.</p><button id="rubyAgeConfirm" style="width:100%;border:0;border-radius:999px;padding:12px;font-weight:900;background:linear-gradient(135deg,#ff70ad,#aa82ff);color:#fff">Yes, I’m 18+</button><button id="rubyAgeExit" style="width:100%;margin-top:8px;border:0;border-radius:999px;padding:12px;font-weight:900;background:#f0e3eb;color:#8f6379">No, Exit</button></div>';document.body.appendChild(g);g.querySelector('#rubyAgeConfirm').onclick=()=>g.remove();g.querySelector('#rubyAgeExit').onclick=()=>{g.innerHTML='<div style="color:#fff;text-align:center"><h2>Access Restricted</h2><p>Ruby Chan is available only to adults aged 18 and older.</p></div>'};
    };

    rebuildSettings();
    ensureAgeGate();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
