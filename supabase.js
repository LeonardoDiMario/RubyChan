/* Ruby Chan — ONE shared Supabase client */
(function () {
  const URL = "https://hcbajvladlvhklelbxdr.supabase.co";
  const KEY = "sb_publishable_eKKXyB0rc7QUwTbbydi8Xw_t0n27eIj";

  // index.html already creates a client. Reuse it instead of creating
  // another GoTrue client (multiple clients can fight over the auth lock).
  let client = window.supabaseClient || window.rubySupabase || null;

  if (!client) {
    try {
      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        client = supabaseClient;
      }
    } catch (_) {}
  }

  if (!client && window.supabase?.createClient) {
    client = window.supabase.createClient(URL, KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'rubychan-auth'
      }
    });
  }

  if (!client) {
    console.error('Ruby Chan: Supabase CDN has not loaded yet.');
    return;
  }

  window.rubySupabase = client;
  window.supabaseClient = client;
})();
