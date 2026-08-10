// Ruby Chan — load shared client first, then feature modules.
// IMPORTANT: every module must reuse the same Supabase client.
(function () {
  const scripts = [
    './supabase.js',
    './telegram-config.js',
    './auth.js',
    './welcome-auth.js',
    './chat-sync.js',
    './chat-client.js',
    './premium-ui.js',
    './telegram-bridge.js',
    './daily-bonus-fix.js',
    './character-new-chat.js'
  ];

  let i = 0;
  function loadNext() {
    if (i >= scripts.length) return;
    const src = scripts[i++];
    const s = document.createElement('script');
    s.src = src;
    s.defer = false;
    s.onload = loadNext;
    s.onerror = () => {
      console.error('Ruby Chan: failed to load', src);
      loadNext();
    };
    document.head.appendChild(s);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNext, { once: true });
  } else {
    loadNext();
  }
})();
