/* Ruby Chan — Supabase Auth */
(function () {
  const client = window.supabaseClient;
  if (!client) {
    console.error('Ruby Chan: supabaseClient was not found.');
    return;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' })[c];
    });
  }

  function ensureAuthUI() {
    if (document.getElementById('rubyAuthModal')) return;

    const style = document.createElement('style');
    style.textContent = `
      #rubyAuthButton{position:fixed;top:14px;right:14px;z-index:9998;border:0;border-radius:12px;padding:10px 14px;background:#7c3aed;color:#fff;font-weight:700;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.15)}
      #rubyAuthModal{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.45);padding:20px}
      #rubyAuthModal.show{display:flex}
      #rubyAuthBox{width:min(390px,100%);background:#fff;border-radius:20px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:inherit}
      #rubyAuthBox h2{margin:0 0 16px;color:#222}
      #rubyAuthBox input{display:block;width:100%;box-sizing:border-box;margin:9px 0;padding:12px;border:1px solid #ddd;border-radius:10px;font-size:15px}
      #rubyAuthBox button{border:0;border-radius:10px;padding:11px 14px;cursor:pointer;font-weight:700}
      #rubyAuthSubmit{width:100%;background:#7c3aed;color:#fff;margin-top:8px}
      #rubyAuthSwitch{background:#f1f1f5;color:#333;margin-top:8px;width:100%}
      #rubyAuthClose{float:right;background:transparent;font-size:20px;padding:0}
      #rubyAuthMessage{min-height:20px;margin-top:10px;font-size:13px;color:#666}
    `;
    document.head.appendChild(style);

    const button = document.createElement('button');
    button.id = 'rubyAuthButton';
    button.type = 'button';
    button.textContent = 'Login';
    document.body.appendChild(button);

    const modal = document.createElement('div');
    modal.id = 'rubyAuthModal';
    modal.innerHTML = `
      <div id="rubyAuthBox" role="dialog" aria-modal="true">
        <button id="rubyAuthClose" type="button">×</button>
        <h2 id="rubyAuthTitle">Login to Ruby Chan</h2>
        <input id="rubyAuthEmail" type="email" autocomplete="email" placeholder="Email" />
        <input id="rubyAuthPassword" type="password" autocomplete="current-password" placeholder="Password" />
        <button id="rubyAuthSubmit" type="button">Login</button>
        <button id="rubyAuthSwitch" type="button">Create account</button>
        <div id="rubyAuthMessage"></div>
      </div>`;
    document.body.appendChild(modal);

    let signup = false;
    const title = document.getElementById('rubyAuthTitle');
    const submit = document.getElementById('rubyAuthSubmit');
    const switchBtn = document.getElementById('rubyAuthSwitch');
    const message = document.getElementById('rubyAuthMessage');

    function render() {
      title.textContent = signup ? 'Create your Ruby Chan account' : 'Login to Ruby Chan';
      submit.textContent = signup ? 'Sign Up' : 'Login';
      switchBtn.textContent = signup ? 'Back to Login' : 'Create account';
      document.getElementById('rubyAuthPassword').autocomplete = signup ? 'new-password' : 'current-password';
      message.textContent = '';
    }

    button.onclick = () => modal.classList.add('show');
    document.getElementById('rubyAuthClose').onclick = () => modal.classList.remove('show');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('show'); };
    switchBtn.onclick = () => { signup = !signup; render(); };

    submit.onclick = async () => {
      const email = document.getElementById('rubyAuthEmail').value.trim();
      const password = document.getElementById('rubyAuthPassword').value;
      if (!email || !password) { message.textContent = 'Enter your email and password.'; return; }
      submit.disabled = true;
      message.textContent = 'Please wait…';
      try {
        let result;
        if (signup) {
          result = await client.auth.signUp({ email, password });
          if (result.error) throw result.error;
          message.textContent = result.data.session ? 'Account created and logged in.' : 'Account created. Check your email to confirm it.';
          if (result.data.session) modal.classList.remove('show');
        } else {
          result = await client.auth.signInWithPassword({ email, password });
          if (result.error) throw result.error;
          modal.classList.remove('show');
        }
      } catch (err) {
        message.textContent = err.message || 'Authentication failed.';
      } finally {
        submit.disabled = false;
      }
    };

    client.auth.onAuthStateChange(function (_event, session) {
      if (session && session.user) {
        button.textContent = 'Logout';
        button.onclick = async function () { await client.auth.signOut(); };
        button.title = escapeHtml(session.user.email || 'Signed in');
      } else {
        button.textContent = 'Login';
        button.onclick = () => modal.classList.add('show');
      }
    });

    client.auth.getSession().then(function (result) {
      if (result.data && result.data.session) {
        button.textContent = 'Logout';
        button.onclick = async function () { await client.auth.signOut(); };
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureAuthUI);
  else ensureAuthUI();
})();
