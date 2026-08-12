(()=>{
  const boot=()=>{
    const root=document.getElementById('settings');
    if(!root)return;
    root.innerHTML=`<div class="ruby-settings-shell">
      <div class="section-head"><div><h2>Settings</h2><p>Account, app, safety and legal</p></div></div>
      <div class="panel"><div class="section-head"><div><h2>Account & Plan</h2><p>Your Ruby Chan account</p></div></div><div class="settings-grid">
        <div class="setting"><b>Current Plan</b><p class="status">Free</p><button class="btn primary" id="settingsRecharge" type="button">Upgrade / Recharge</button></div>
        <div class="setting"><b>Account Status</b><p class="status">Connected account</p><button class="btn ghost" id="settingsRefresh" type="button">Refresh account</button></div>
      </div></div>
      <div class="panel"><div class="section-head"><div><h2>Appearance & Notifications</h2><p>Control the app experience</p></div></div><div class="settings-grid">
        <div class="setting"><label>Language<select id="language" class="select" style="max-width:160px"><option value="en">English</option><option value="my">မြန်မာ</option></select></label></div>
        <div class="setting"><label>Background<select id="bgmode" class="select" style="max-width:160px"><option value="midnight">Midnight</option><option value="pink">Cute Pink</option><option value="lavender">Lavender</option></select></label></div>
        <div class="setting"><label>Notifications<button id="notif" class="switch on" type="button"><i></i></button></label><small class="status">Important app and account updates</small></div>
        <div class="setting"><label>Offers & Promotions<button id="offers" class="switch on" type="button"><i></i></button></label><small class="status">Optional promotional messages</small></div>
      </div><div class="actions"><button id="saveSettings" class="btn primary" type="button">Save settings</button></div></div>
      <div class="panel"><div class="section-head"><div><h2>History & Safety</h2><p>Conversation and safety controls</p></div></div><div class="settings-grid">
        <div class="setting"><b>Auto-delete</b><p class="status">Unpinned chats auto-delete 7 days after creation.</p></div>
        <div class="setting"><b>Telegram Sync</b><p class="status">Telegram conversation history is read-only in the app.</p></div>
        <div class="setting"><b>18+ Adults Only</b><p class="status">You must be 18 or older to use Ruby Chan.</p></div>
        <div class="setting"><b>Account Safety</b><p class="status">Never share passwords, OTPs, payment codes or secret credentials.</p></div>
      </div></div>
      <div class="panel"><div class="section-head"><div><h2>Support & Legal</h2><p>Important help and policies</p></div></div><div class="settings-grid">
        <div class="setting"><button class="btn ghost legal-open" data-legal="support" type="button">🛟 Support & Feedback</button><p class="status">Help, bug reports and feedback</p></div>
        <div class="setting"><button class="btn ghost legal-open" data-legal="terms" type="button">📜 Terms & Conditions</button><p class="status">Service rules and usage</p></div>
        <div class="setting"><button class="btn ghost legal-open" data-legal="privacy" type="button">🔒 Privacy Policy</button><p class="status">Privacy and data handling</p></div>
        <div class="setting"><button class="btn ghost legal-open" data-legal="18plus" type="button">🔞 18+ Policy</button><p class="status">Adults-only requirements</p></div>
        <div class="setting"><button class="btn ghost legal-open" data-legal="community" type="button">💗 Community Guidelines</button><p class="status">Respect, consent and prohibited behavior</p></div>
        <div class="setting"><button class="btn ghost legal-open" data-legal="safety" type="button">🛡️ Safety Center</button><p class="status">Keep your account and conversations safe</p></div>
        <div class="setting"><button class="btn ghost legal-open" data-legal="about" type="button">ℹ️ About Ruby Chan</button><p class="status">App information</p></div>
      </div></div></div>`;

    let modal=document.getElementById('rubyLegalModal');
    if(!modal){
      document.body.insertAdjacentHTML('beforeend','<div id="rubyLegalModal" class="hc-modal"><div class="hc-card"><button class="close" id="rubyLegalClose" type="button" style="float:right">×</button><h3 id="rubyLegalTitle">Information</h3><div id="rubyLegalBody"></div></div></div>');
      modal=document.getElementById('rubyLegalModal');
    }
    const data={
      support:['Support & Feedback','For support, bugs, payment problems or feedback, use the official Ruby Chan support channel provided by the app owner. Never send passwords, one-time codes or private payment credentials.'],
      terms:['Terms & Conditions','Use Ruby Chan lawfully and respectfully. Do not abuse the service, bypass safety or payment controls, automate harassment, or misuse other people’s data. Features and limits may change.'],
      privacy:['Privacy Policy','Ruby Chan may process account, session, device, Telegram, conversation and usage information needed to operate and secure the service. Do not place passwords, OTPs or payment secrets in chats.'],
      '18plus':['18+ Policy','Ruby Chan is for adults aged 18 or older. Minors may not use the service. Sexual content involving minors, exploitation, trafficking, coercion or non-consensual sexual material is prohibited.'],
      community:['Community Guidelines','Respect others. Do not harass, threaten, exploit or impersonate real people. Respect consent and applicable laws.'],
      safety:['Safety Center','Protect your Telegram account and payment information. Use official app links and never share passwords, OTPs or private payment codes.'],
      about:['About Ruby Chan','Ruby Chan is an AI companion app connected to Telegram. Settings includes account, app, safety and legal information.']
    };
    const openLegal=k=>{const v=data[k]||data.about;document.getElementById('rubyLegalTitle').textContent=v[0];document.getElementById('rubyLegalBody').innerHTML='<div class="legal-card"><p>'+v[1]+'</p></div>';document.getElementById('rubyLegalModal').classList.add('open');};
    document.querySelectorAll('.legal-open').forEach(b=>b.addEventListener('click',()=>openLegal(b.dataset.legal)));
    document.getElementById('rubyLegalClose')?.addEventListener('click',()=>document.getElementById('rubyLegalModal').classList.remove('open'));
    document.getElementById('rubyLegalModal')?.addEventListener('click',e=>{if(e.target.id==='rubyLegalModal')e.currentTarget.classList.remove('open');});
    document.getElementById('settingsRecharge')?.addEventListener('click',()=>show('recharge'));
    document.getElementById('settingsRefresh')?.addEventListener('click',async()=>{profile=null;await session();await prof();toast('Account refreshed');});
    document.getElementById('notif')?.addEventListener('click',e=>e.currentTarget.classList.toggle('on'));
    document.getElementById('offers')?.addEventListener('click',e=>e.currentTarget.classList.toggle('on'));
    document.getElementById('saveSettings')?.addEventListener('click',async()=>{const r=await sb.from('profiles').update({language:document.getElementById('language').value,notifications_enabled:document.getElementById('notif').classList.contains('on'),offers_enabled:document.getElementById('offers').classList.contains('on'),custom_background:document.getElementById('bgmode').value,updated_at:new Date().toISOString()}).eq('id',profile.id);toast(r.error?r.error.message:'Settings saved');});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else setTimeout(boot,0);
})();
