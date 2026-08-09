/* Ruby Chan — Supabase Auth */
(function () {
  const SUPABASE_URL = 'https://hcbajvladlvhklelbxdr.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_eKKXyB0rc7QUwTbbydi8Xw_t0n27eIj';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Ruby Chan: Supabase CDN did not load.');
    return;
  }

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  function ensureAuthUI() {
    if (!document.body || document.getElementById('rubyAuthModal')) return;

    const style = document.createElement('style');
    style.textContent = `
      #rubyAuthButton{
        position:static;
        flex:0 0 auto;
        border:0;
        border-radius:12px;
        padding:9px 13px;
        background:#7c3aed;
        color:#fff;
        font-weight:700;
        cursor:pointer;
        white-space:nowrap;
        z-index:30;
      }
      #rubyAuthButton:active{transform:scale(.96)}
      #rubyAuthModal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.45);padding:20px}
      #rubyAuthModal.show{display:flex}
      #rubyAuthBox{width:min(390px,100%);background:#fff;border-radius:20px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.25)}
      #rubyAuthBox input{display:block;width:100%;box-sizing:border-box;margin:9px 0;padding:12px;border:1px solid #ddd;border-radius:10px}
      #rubyAuthBox button{border:0;border-radius:10px;padding:11px 14px;cursor:pointer;font-weight:700}
      #rubyAuthSubmit{width:100%;background:#7c3aed;color:#fff;margin-top:8px}
      #rubyAuthSwitch{width:100%;margin-top:8px}
      #rubyAuthClose{float:right;background:transparent;font-size:20px;padding:0}
      #rubyAuthMessage{min-height:20px;margin-top:10px;font-size:13px;color:#666}
      #rubyAccountCard{margin-bottom:14px;background:#fff;border:1px solid rgba(60,60,67,.10);border-radius:16px;padding:16px}
      #rubyAccountCard .ruby-account-name{font-size:17px;font-weight:800;color:#1c1c1e}
      #rubyAccountCard .ruby-account-meta{margin-top:5px;color:#8e8e93;font-size:12px;line-height:1.6}
      #rubyAccountCard .ruby-account-badge{display:inline-block;margin-top:10px;padding:5px 9px;border-radius:999px;background:#f3e8ff;color:#7c3aed;font-size:11px;font-weight:700}
    `;
    document.head.appendChild(style);

    const button = document.createElement('button');
    button.id = 'rubyAuthButton';
    button.type = 'button';
    button.textContent = 'Login';

    const header = document.querySelector('header');
    if (header) header.appendChild(button);
    else document.body.appendChild(button);

    const modal = document.createElement('div');
    modal.id = 'rubyAuthModal';
    modal.innerHTML = `
      <div id="rubyAuthBox">
        <button id="rubyAuthClose" type="button">×</button>
        <h2 id="rubyAuthTitle">Login to Ruby Chan</h2>
        <div id="rubySignupFields" style="display:none">
          <input id="rubyAuthName" type="text" placeholder="Full name" autocomplete="name">
          <input id="rubyAuthUsername" type="text" placeholder="Username" autocomplete="username">
        </div>
        <input id="rubyAuthEmail" type="email" placeholder="Email" autocomplete="email">
        <input id="rubyAuthPassword" type="password" placeholder="Password" autocomplete="new-password">
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
    const signupFields = document.getElementById('rubySignupFields');

    function render() {
      title.textContent = signup ? 'Create your Ruby Chan account' : 'Login to Ruby Chan';
      submit.textContent = signup ? 'Sign Up' : 'Login';
      switchBtn.textContent = signup ? 'Back to Login' : 'Create account';
      signupFields.style.display = signup ? 'block' : 'none';
      message.textContent = '';
    }

    function open() { modal.classList.add('show'); }

    button.onclick = open;
    document.getElementById('rubyAuthClose').onclick = () => modal.classList.remove('show');
    switchBtn.onclick = () => { signup = !signup; render(); };

    function updateSettingsProfile(user) {
      const old = document.getElementById('rubyAccountCard');
      if (old) old.remove();
      if (!user) return;

      const name = user.user_metadata?.full_name || 'Ruby Chan member';
      const username = user.user_metadata?.username ? '@' + user.user_metadata.username : '';
      const email = user.email || '';

      const card = document.createElement('div');
      card.id = 'rubyAccountCard';
      card.innerHTML = `
        <div class="ruby-account-name">${escapeHtml(name)}</div>
        <div class="ruby-account-meta">${escapeHtml(username)}${username && email ? ' · ' : ''}${escapeHtml(email)}</div>
        <span class="ruby-account-badge">Signed in</span>`;

      const settingsSection = document.querySelector('.settings-section');
      const settingsPage = document.querySelector('[id*="settings"], .settings-page');
      if (settingsSection) settingsSection.parentNode.insertBefore(card, settingsSection);
      else if (settingsPage) settingsPage.prepend(card);
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
    }

    submit.onclick = async () => {
      const name = document.getElementById('rubyAuthName').value.trim();
      const username = document.getElementById('rubyAuthUsername').value.trim();
      const email = document.getElementById('rubyAuthEmail').value.trim();
      const password = document.getElementById('rubyAuthPassword').value;

      if (signup && (!name || !username)) {
        message.textContent = 'Enter your name and username.';
        return;
      }
      if (!email || !password) {
        message.textContent = 'Enter your email and password.';
        return;
      }
      if (signup && password.length < 6) {
        message.textContent = 'Password must be at least 6 characters.';
        return;
      }

      submit.disabled = true;
      message.textContent = 'Please wait…';

      try {
        const result = signup
          ? await client.auth.signUp({
              email,
              password,
              options: { data: { full_name: name, username } }
            })
          : await client.auth.signInWithPassword({ email, password });

        if (result.error) throw result.error;

        message.textContent = signup && !result.data.session
          ? 'Account created. Check your email to confirm it.'
          : 'Success.';

        if (result.data.session) {
          updateSettingsProfile(result.data.user);
          modal.classList.remove('show');
        }
      } catch (err) {
        message.textContent = err.message || 'Authentication failed.';
      } finally {
        submit.disabled = false;
      }
    };

    client.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        const name = session.user.user_metadata?.full_name || 'Account';
        button.textContent = name.length > 16 ? name.slice(0, 15) + '…' : name;
        button.onclick = () => {
          const settings = document.querySelector('[id*="settings"], .settings-page');
          if (settings) settings.scrollIntoView({ behavior:'smooth' });
          else updateSettingsProfile(session.user);
        };
        updateSettingsProfile(session.user);
      } else {
        button.textContent = 'Login';
        button.onclick = open;
        updateSettingsProfile(null);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureAuthUI, { once: true });
  } else {
    ensureAuthUI();
  }
})();
