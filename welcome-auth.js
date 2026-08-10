// Ruby Chan — Welcome login / sign-up shortcut
(function(){
  function addWelcomeAuth(){
    const hero = document.querySelector('.hero');
    const title = hero?.querySelector('h2');
    if(!hero || !title || document.getElementById('rubyWelcomeAuth')) return;

    const wrap = document.createElement('div');
    wrap.id = 'rubyWelcomeAuth';
    wrap.innerHTML = `
      <button type="button" class="ruby-welcome-auth-btn">
        <span>🔐</span>
        <span>Login / Sign Up</span>
        <span class="ruby-welcome-arrow">›</span>
      </button>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #rubyWelcomeAuth{margin-top:16px}
      #rubyWelcomeAuth .ruby-welcome-auth-btn{
        width:100%;min-height:50px;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 15px;border:1px solid rgba(124,58,237,.16);border-radius:14px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:14px;font-weight:800;box-shadow:0 8px 20px rgba(124,58,237,.20);cursor:pointer;
      }
      #rubyWelcomeAuth .ruby-welcome-auth-btn:active{transform:scale(.985)}
      #rubyWelcomeAuth .ruby-welcome-arrow{font-size:24px;font-weight:300;line-height:1;margin-left:auto}
      #rubyWelcomeGreeting{display:none;margin-top:7px;color:#5d6470;font-size:14px;line-height:1.5}
      #rubyAccountEditor{display:none;margin-top:12px}
      #rubyAccountEditor.open{display:block}
      .ruby-account-card{background:#fff;border:1px solid rgba(60,60,67,.10);border-radius:18px;padding:18px;box-shadow:0 8px 25px rgba(0,0,0,.06)}
      .ruby-account-card h3{font-size:19px;margin-bottom:14px;color:#7c3aed}
      .ruby-account-field{margin-bottom:12px}.ruby-account-field label{display:block;font-size:12px;color:#6d6d72;margin-bottom:5px}.ruby-account-field input,.ruby-account-field textarea{width:100%;padding:11px 12px;border:1px solid rgba(60,60,67,.14);border-radius:11px;background:#f8f8fa;font:inherit}.ruby-account-field textarea{min-height:70px;resize:vertical}.ruby-account-actions{display:flex;gap:8px;margin-top:14px}.ruby-account-actions button{flex:1;border:0;border-radius:11px;padding:11px;font-weight:750;cursor:pointer}.ruby-account-save{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff}.ruby-account-cancel{background:#f2f2f7;color:#333}
      .ruby-save-account{display:flex;align-items:center;gap:8px;margin:10px 0;font-size:13px;cursor:pointer}.ruby-save-account input{width:16px;height:16px}
    `;
    document.head.appendChild(style);
    title.insertAdjacentElement('afterend', wrap);

    const greeting = document.createElement('div');
    greeting.id = 'rubyWelcomeGreeting';
    title.insertAdjacentElement('afterend', greeting);

    wrap.querySelector('button').addEventListener('click',()=>{
      const topLogin=document.getElementById('rubyAuthButton');
      if(topLogin) topLogin.click();
    });

    function updateWelcome(session){
      const user = session?.user;
      if(user){
        const username = user.user_metadata?.full_name || user.user_metadata?.name || 'there';
        title.textContent = `Welcome, ${username}`;
        wrap.style.display = 'none';
        greeting.style.display = 'none';
      }else{
        title.textContent = 'Welcome to Ruby Chan';
        wrap.style.display = '';
        greeting.style.display = 'none';
      }
    }

    if(window.supabaseClient?.auth){
      window.supabaseClient.auth.getSession().then(({data})=>updateWelcome(data?.session));
      window.supabaseClient.auth.onAuthStateChange((_event,session)=>updateWelcome(session));
    }else{
      setTimeout(()=>{
        if(window.supabaseClient?.auth){
          window.supabaseClient.auth.getSession().then(({data})=>updateWelcome(data?.session));
          window.supabaseClient.auth.onAuthStateChange((_event,session)=>updateWelcome(session));
        }
      },300);
    }
  }

  function installAccountFeatures(){
    const sb=window.supabaseClient;if(!sb?.auth)return;

    function saveAccountChoice(){
      const checked=document.getElementById('rubySaveAccount')?.checked;
      localStorage.setItem('ruby_save_account',checked?'1':'0');
    }

    function addSaveAccount(){
      const password=document.querySelector('input[type="password"]');
      if(!password||document.getElementById('rubySaveAccount'))return;
      const row=document.createElement('label');
      row.className='ruby-save-account';
      row.innerHTML='<input id="rubySaveAccount" type="checkbox" autocomplete="off"><span>Save account</span>';
      password.closest('form')?.insertBefore(row,password.closest('form').querySelector('button')||null);
      const c=document.getElementById('rubySaveAccount');if(c)c.checked=localStorage.getItem('ruby_save_account')==='1';
      c?.addEventListener('change',saveAccountChoice);
    }

    function accountEditor(){
      const settings=document.querySelector('#settings,.settings-page,[data-page="settings"]');
      if(!settings||document.getElementById('rubyAccountEditor'))return;
      const box=document.createElement('div');box.id='rubyAccountEditor';
      box.innerHTML=`<div class="ruby-account-card"><h3>Edit Account</h3><div class="ruby-account-field"><label>Name</label><input id="rubyEditName" autocomplete="name"></div><div class="ruby-account-field"><label>Username</label><input id="rubyEditUsername" autocomplete="username"></div><div class="ruby-account-field"><label>Bio</label><textarea id="rubyEditBio"></textarea></div><div class="ruby-account-actions"><button type="button" class="ruby-account-cancel" id="rubyAccountCancel">Cancel</button><button type="button" class="ruby-account-save" id="rubyAccountSave">Save Changes</button></div></div>`;
      settings.prepend(box);

      async function load(){
        const r=await sb.auth.getUser(),u=r.data?.user,m=u?.user_metadata||{};if(!u)return;
        document.getElementById('rubyEditName').value=m.full_name||m.name||'';
        document.getElementById('rubyEditUsername').value=m.username||'';
        document.getElementById('rubyEditBio').value=m.bio||'';
      }
      document.getElementById('rubyAccountSave').onclick=async()=>{
        const name=document.getElementById('rubyEditName').value.trim();const username=document.getElementById('rubyEditUsername').value.trim();const bio=document.getElementById('rubyEditBio').value.trim();
        const r=await sb.auth.updateUser({data:{full_name:name,name,username,bio}});if(r.error){alert(r.error.message);return}box.classList.remove('open');location.reload();
      };
      document.getElementById('rubyAccountCancel').onclick=()=>box.classList.remove('open');
      box.loadAccount=load;
    }

    function hookSettings(){
      accountEditor();
      const box=document.getElementById('rubyAccountEditor');if(!box)return;
      const rows=[...document.querySelectorAll('#settings button,.settings-page button,.ios-row')];
      const edit=rows.find(x=>/edit account/i.test(x.textContent||''));
      if(edit&&!edit.dataset.rubyEditHook){edit.dataset.rubyEditHook='1';edit.onclick=()=>{box.classList.add('open');box.loadAccount()};}
    }

    addSaveAccount();hookSettings();
    const mo=new MutationObserver(()=>{addSaveAccount();hookSettings()});mo.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{addWelcomeAuth();installAccountFeatures()},{once:true});
  else {addWelcomeAuth();installAccountFeatures();}
})();