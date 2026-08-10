// Ruby Chan — load shared client first, then feature modules.
// IMPORTANT: every module must reuse the same Supabase client.
(function () {
  const v = '20260810-2';
  const scripts = [
    `./supabase.js?v=${v}`,
    `./telegram-config.js?v=${v}`,
    `./auth.js?v=${v}`,
    `./welcome-auth.js?v=${v}`,
    `./chat-sync.js?v=${v}`,
    `./chat-client.js?v=${v}`,
    `./premium-ui.js?v=${v}`,
    `./telegram-bridge.js?v=${v}`,
    `./daily-bonus-fix.js?v=${v}`,
    `./character-new-chat.js?v=${v}`
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
