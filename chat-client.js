/* Ruby Chan — Supabase character chat client */
(function () {
  const db = window.supabaseClient || (window.supabase && window.supabase.createClient ? window.supabase.createClient('https://hcbajvladlvhklelbxdr.supabase.co','sb_publishable_eKKXyB0rc7QUwTbbydi8Xw_t0n27eIj', { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null);
  let activeCharacter = null;
  let activeConversation = null;

  function esc(value) {
    return String(value ?? '').replace(/[&<>\'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function ensureStyles() {
    if (document.getElementById('ruby-kindroid-chat-style')) return;
    const style = document.createElement('style');
    style.id = 'ruby-kindroid-chat-style';
    style.textContent = `
      #rubyKindroidChat{position:fixed;inset:0;z-index:10000;background:#f2f2f7;display:none;flex-direction:column}
      #rubyKindroidChat.open{display:flex}
      .rk-head{height:64px;display:flex;align-items:center;gap:12px;padding:10px 14px;background:rgba(255,255,255,.95);border-bottom:1px solid rgba(60,60,67,.12)}
      .rk-back{border:0;background:#f2f2f7;border-radius:12px;width:40px;height:40px;font-size:22px;cursor:pointer}
      .rk-title{font-weight:800;font-size:17px;flex:1}.rk-status{font-size:11px;color:#34c759}
      .rk-messages{flex:1;overflow-y:auto;padding:18px 14px 100px;display:flex;flex-direction:column;gap:9px}
      .rk-bubble{max-width:82%;padding:10px 13px;border-radius:17px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-break:break-word}
      .rk-user{align-self:flex-end;background:#7c3aed;color:#fff;border-bottom-right-radius:5px}.rk-ai{align-self:flex-start;background:#fff;border:1px solid rgba(60,60,67,.10);border-bottom-left-radius:5px}
      .rk-compose{position:fixed;left:0;right:0;bottom:0;padding:10px 12px;background:rgba(255,255,255,.96);border-top:1px solid rgba(60,60,67,.12);display:flex;gap:8px}
      .rk-input{flex:1;border:1px solid #d1d1d6;border-radius:20px;padding:10px 13px;font:inherit;outline:none}.rk-send{width:44px;border:0;border-radius:50%;background:#7c3aed;color:#fff;font-size:18px}.rk-send:disabled{opacity:.45}
      .rk-empty{margin:auto;color:#8e8e93;text-align:center}.rk-error{align-self:center;color:#ff3b30;font-size:12px;text-align:center;padding:10px}
    `;
    document.head.appendChild(style);
  }

  function ensureUI() {
    ensureStyles();
    let root = document.getElementById('rubyKindroidChat');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'rubyKindroidChat';
    root.innerHTML = `
      <div class="rk-head"><button class="rk-back" id="rkBack">‹</button><div><div class="rk-title" id="rkTitle">Ruby Chan</div><div class="rk-status">AI Chat</div></div></div>
      <div class="rk-messages" id="rkMessages"><div class="rk-empty">Start a conversation ✨</div></div>
      <form class="rk-compose" id="rkForm"><input class="rk-input" id="rkInput" autocomplete="off" placeholder="Message..."><button class="rk-send" id="rkSend" type="submit">➤</button></form>
    `;
    document.body.appendChild(root);
    root.querySelector('#rkBack').onclick = () => root.classList.remove('open');
    root.querySelector('#rkForm').addEventListener('submit', sendMessage);
    return root;
  }

  function render(messages) {
    const box = document.getElementById('rkMessages');
    if (!box) return;
    box.innerHTML = '';
    if (!messages.length) { box.innerHTML = '<div class="rk-empty">Start a conversation ✨</div>'; return; }
    messages.forEach(m => {
      const div = document.createElement('div');
      div.className = 'rk-bubble ' + (m.role === 'user' ? 'rk-user' : 'rk-ai');
      div.innerHTML = esc(m.content);
      box.appendChild(div);
    });
    box.scrollTop = box.scrollHeight;
  }

  async function loadMessages(conversationId) {
    if (!db || !conversationId) return;
    const r = await db.from('messages').select('role,content,created_at').eq('conversation_id', conversationId).order('created_at',{ascending:true});
    if (!r.error) render(r.data || []);
  }

  async function openChat(detail) {
    activeCharacter = detail.character;
    activeConversation = detail.conversation || null;
    if (!activeConversation?.id && window.rubyCurrentConversation) {
      activeConversation = { id: window.rubyCurrentConversation };
    }
    const root = ensureUI();
    root.querySelector('#rkTitle').textContent = activeCharacter || 'Ruby Chan';
    root.classList.add('open');
    render(detail.messages || []);
    if (activeConversation?.id) await loadMessages(activeConversation.id);
  }

  async function findCharacter(name) {
    if (!db || !name) return null;
    const { data, error } = await db.from('characters').select('id,name').eq('name', name).limit(1).maybeSingle();
    if (error) throw new Error('Could not load character: ' + error.message);
    if (!data?.id) throw new Error('Character not found: ' + name);
    return data;
  }

  async function sendMessage(event) {
    event.preventDefault();
    const input = document.getElementById('rkInput');
    const send = document.getElementById('rkSend');
    const message = input?.value.trim();
    if (!message || !activeCharacter || !db) return;

    if (!activeConversation?.id && window.rubyCurrentConversation) {
      activeConversation = { id: window.rubyCurrentConversation };
    }

    input.value = '';
    send.disabled = true;
    const box = document.getElementById('rkMessages');

    // Show the user's message immediately.
    const userBubble = document.createElement('div');
    userBubble.className = 'rk-bubble rk-user';
    userBubble.textContent = message;
    box.appendChild(userBubble);
    box.scrollTop = box.scrollHeight;

    try {
      const character = await findCharacter(activeCharacter);

      const { data, error } = await db.functions.invoke('chat', {
        body: {
          character_id: character.id,
          message,
          conversation_id: activeConversation?.id || null
        }
      });

      if (error) {
        let details = error.message || String(error);
        if (error.context) {
          try {
            const responseBody = await error.context.json();
            if (responseBody?.error) {
              details = responseBody.details ? `${responseBody.error}: ${responseBody.details}` : responseBody.error;
            }
          } catch (_) {}
        }
        throw new Error(details);
      }

      const reply = data?.reply || '';
      if (!reply) throw new Error('AI returned an empty reply');

      // The Edge Function already saves both the user message and AI reply.
      // Reload the conversation so both bubbles are rendered from the database.
      if (activeConversation?.id) {
        await loadMessages(activeConversation.id);
      } else if (window.rubyCurrentConversation) {
        activeConversation = { id: window.rubyCurrentConversation };
        await loadMessages(activeConversation.id);
      } else {
        const aiBubble = document.createElement('div');
        aiBubble.className = 'rk-bubble rk-ai';
        aiBubble.textContent = reply;
        box.appendChild(aiBubble);
        box.scrollTop = box.scrollHeight;
      }
    } catch (err) {
      const e = document.createElement('div');
      e.className = 'rk-error';
      e.textContent = 'Chat error: ' + (err?.message || err);
      box.appendChild(e);
      input.value = message;
    } finally {
      send.disabled = false;
      input.focus();
    }
  }

  window.addEventListener('rubychat:open', e => openChat(e.detail || {}));
  window.addEventListener('rubychat:loaded', e => openChat(e.detail || {}));
})();
