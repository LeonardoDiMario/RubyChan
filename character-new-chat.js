/* Ruby Chan — Character picker New Chat buttons */
(function () {
  'use strict';

  const SUPABASE_URL = 'https://hcbajvladlvhklelbxdr.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_eKKXyB0rc7QUwTbbydi8Xw_t0n27eIj';
  const db = window.supabaseClient || (window.supabase && window.supabase.createClient
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true } })
    : null);

  async function newConversation(character) {
    if (!db || !character) return;
    const { data: sessionData } = await db.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) {
      document.getElementById('rubyAuthButton')?.click();
      return;
    }

    const { data: characterRow, error: charError } = await db
      .from('characters').select('id,name').eq('name', character).limit(1).maybeSingle();
    if (charError || !characterRow?.id) {
      if (typeof window.startChat === 'function') window.startChat(character);
      return;
    }

    const { data: conversation, error } = await db.from('conversations')
      .insert({ user_id: user.id, character_id: characterRow.id, title: character + ' Chat' })
      .select().single();

    if (error || !conversation) {
      console.error('New conversation failed:', error);
      return;
    }

    window.rubyCurrentConversation = conversation.id;
    window.rubyCurrentCharacter = character;
    if (typeof window.switchPage === 'function') window.switchPage('chat');
    window.dispatchEvent(new CustomEvent('rubychat:open', {
      detail: { character: character, conversation: conversation, messages: [] }
    }));
    if (typeof window.rubyLoadChatHistory === 'function') setTimeout(window.rubyLoadChatHistory, 50);
  }

  function install() {
    document.querySelectorAll('.character-card:not(.premium-card) .chat-btn').forEach(function (button) {
      if (button.dataset.rubyNewInstalled === '1') return;
      const card = button.closest('.character-card');
      const name = card?.querySelector('h3')?.textContent?.trim();
      if (!name) return;
      button.dataset.rubyNewInstalled = '1';
      button.textContent = 'New';
      button.onclick = function (event) {
        event.preventDefault();
        newConversation(name);
      };
    });

    document.querySelectorAll('.premium-card .gem-buy-btn').forEach(function (button) {
      if (/Unlocked.*Chat/i.test(button.textContent)) button.textContent = '✓ Unlocked — New';
    });
  }

  const observer = new MutationObserver(install);
  function boot() {
    install();
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
