/* Ruby Chan — Supabase Auth */
(function () {
  // index.html already loads the Supabase CDN. Its client is kept in a
  // const there, so it is not available as window.supabaseClient.
  // Create a dedicated client here instead of relying on that lexical const.
  const SUPABASE_URL = 'https://hcbajvladlvhklelbxdr.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_eKKXyB0rc7QUwTbbydi8Xw_t0n27eIj';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Ruby Chan: Supabase CDN did not load.');
    return;
  }

  const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  function ensureAuthUI() {
    if (!document.body || document.getElementById('rubyAuthModal')) return;

    const style = document.createElement('style');
    style.textContent = `
      #rubyAuthButton{position:fixed;top:14px;right:14px;z-index:9998;border:0;border-radius:12px;padding:10px 14px;background:#7c3aed;color:#fff;font-weight:700;cursor:pointer}
      #rubyAuthModal{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.45);padding:20px}
      #rubyAuthModal.show{display:flex}
      #rubyAuthBox{width:min(390px,100%);background:#fff;border-radius:20px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.25)}
      #rubyAuthBox input{display:block;width:100%;box-sizing:border-box;margin:9px 0;padding:12px;border:1px solid #ddd;border-radius:10px}
      #rubyAuthBox button{border:0;border-radius:10px;padding:11px 14px;cursor:pointer;font-weight:700}
      #rubyAuthSubmit{width:100%;background:#7c3aed;color:#fff;margin-top:8px}
      #rubyAuthSwitch{width:100%;margin-top:8px}
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
      <div id="rubyAuthBox">
        <button id="rubyAuthClose" type="button">×</button>
        <h2 id="rubyAuthTitle">Login to Ruby Chan</h2>
        <input id="rubyAuthEmail" type="email" placeholder="Email" autocomplete="email">
        <input id="rubyAuthPassword" type="password" placeholder="Password" autocomplete="current-password">
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
      message.textContent = '';
    }

    function open() {
      modal.classList.add('show');
    }

    button.onclick = open;
    document.getElementById('rubyAuthClose').onclick = () => modal.classList.remove('show');
    switchBtn.onclick = () => { signup = !signup; render(); };

    submit.onclick = async () => {
      const email = document.getElementById('rubyAuthEmail').value.trim();
      const password = document.getElementById('rubyAuthPassword').value;

      if (!email || !password) {
        message.textContent = 'Enter your email and password.';
        return;
      }

      submit.disabled = true;
      message.textContent = 'Please wait…';

      try {
        const result = signup
          ? await client.auth.signUp({ email, password })
          : await client.auth.signInWithPassword({ email, password });

        if (result.error) throw result.error;

        message.textContent = signup && !result.data.session
          ? 'Account created. Check your email to confirm it.'
          : 'Success.';

        if (result.data.session) modal.classList.remove('show');
      } catch (err) {
        message.textContent = err.message || 'Authentication failed.';
      } finally {
        submit.disabled = false;
      }
    };

    client.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        button.textContent = 'Logout';
        button.onclick = async () => { await client.auth.signOut(); };
      } else {
        button.textContent = 'Login';
        button.onclick = open;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureAuthUI, { once: true });
  } else {
    ensureAuthUI();
  }
})();
