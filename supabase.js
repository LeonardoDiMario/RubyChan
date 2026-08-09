/* Ruby Chan — Supabase client */
(function () {
  const SUPABASE_URL = "https://hcbajvladlvhklelbxdr.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_eKKXyB0rc7QUwTbbydi8Xw_t0n27eIj";

  if (!window.supabase) {
    console.error("Ruby Chan: Supabase CDN has not loaded yet.");
    return;
  }

  window.rubySupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
})();
