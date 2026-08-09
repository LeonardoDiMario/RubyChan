/* Ruby Chan — Supabase character chat client + Energy + Daily Gift */
(function () {
  const SUPABASE_URL = 'https://hcbajvladlvhklelbxdr.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_eKKXyB0rc7QUwTbbydi8Xw_t0n27eIj';

  const db = window.supabaseClient ||
    (window.supabase && window.supabase.createClient
      ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        })
      : null);

  let activeCharacter = null;
  let activeConversation = null;
  let energy = null;
  const DAILY_BONUS = 25;
  const DAILY_KEY = 'rubychan_daily_bonus_claimed_v1';

  function esc(value) {
    return String(value ?? '').replace(/[&<>\'\"]/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[c]));
  }

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function isDailyClaimed() {
    return localStorage.getItem(DAILY_KEY) === todayKey();
  }

  function markDailyClaimed() {
    localStorage.setItem(DAILY_KEY, todayKey());
  }

  function updateTopEnergy(value) {
    if (value === undefined || value === null || Number.isNaN(Number(value))) return;
    energy = Number(value);
    const el = document.getElementById('energyValue');
    if (el) el.textContent = String(energy);
  }

  function ensureStyles() {
    if (document.getElementById('ruby-energy-gift-style')) return;
    const style = document.createElement('style');
    style.id = 'ruby-energy-gift-style';
    style.textContent = `
      #rubyDailyGift{
        position:fixed;
        right:18px;
        bottom:92px;
        width:58px;
        height:58px;
        z-index:9998;
        border:0;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        background:linear-gradient(135deg,#7c3aed,#a855f7);
        box-shadow:0 9px 26px rgba(124,58,237,.34),0 0 0 4px rgba(255,255,255,.86);
        color:#fff;
        font-size:27px;
        cursor:pointer;
        transition:transform .18s ease,opacity .18s ease;
        animation:rubyGiftFloat 2.2s ease-in-out infinite;
      }
      #rubyDailyGift:hover{transform:scale(1.07)}
      #rubyDailyGift:active{transform:scale(.92)}
      #rubyDailyGift.claimed{display:none}
      #rubyDailyGift .ruby-gift-badge{
        position:absolute;
        right:-2px;
        top:-2px;
        min-width:21px;
        height:21px;
        padding:0 5px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:999px;
        background:#ff3b30;
        color:#fff;
        font-size:9px;
        font-weight:900;
        border:2px solid #fff;
      }
      @keyframes rubyGiftFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
      #rubyGiftToast{
        position:fixed;
        left:50%;
        top:82px;
        transform:translateX(-50%);
        z-index:10001;
        display:none;
        max-width:calc(100vw - 32px);
        padding:12px 17px;
        border-radius:16px;
        background:#fff;
        color:#6d28d9;
        border:1px solid rgba(124,58,237,.16);
        box-shadow:0 12px 35px rgba(0,0,0,.15);
        font-size:13px;
        font-weight:800;
        text-align:center;
      }
      #rubyGiftToast.show{display:block}
      #rubyKindroidChat{position:fixed;inset:0;z-index:10000;background:#f2f2f7;display:none;flex-direction:column}
      #rubyKindroidChat.open{display:flex}
      .rk-head{height:64px;display:flex;align-items:center;gap:12px;padding:10px 14px;background:rgba(255,255,255,.97);border-bottom:1px solid rgba(60,60,67,.12)}
      .rk-back{border:0;background:#f2f2f7;border-radius:12px;width:40px;height:40px;font-size:22px;cursor:pointer}
      .rk-head-info{min-width:0;flex:1}.rk-title{font-weight:800;font-size:17px}.rk-status{font-size:11px;color:#34c759;margin-top:2px}
      .rk-messages{flex:1;overflow-y:auto;padding:18px 14px 100px;display:flex;flex-direction:column;gap:9px}
      .rk-bubble{max-width:82%;padding:10px 13px;border-radius:17px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-break:break-word}
      .rk-user{align-self:flex-end;background:#7c3aed;color:#fff;border-bottom-right-radius:5px}.rk-ai{align-self:flex-start;background:#fff;border:1px solid rgba(60,60,67,.10);border-bottom-left-radius:5px}
      .rk-compose{position:fixed;left:0;right:0;bottom:0;padding:10px 12px;background:rgba(255,255,255,.97);border-top:1px solid rgba(60,60,67,.12);display:flex;gap:8px}
      .rk-input{flex:1;border:1px solid #d1d1d6;border-radius:20px;padding:10px 13px;font:inherit;outline:none}.rk-send{width:44px;border:0;border-radius:50%;background:#7c3aed;color:#fff;font-size:18px}.rk-send:disabled{opacity:.45}
      .rk-empty{margin:auto;color:#8e8e93;text-align:center}.rk-error{align-self:center;color:#ff3b30;font-size:12px;text-align:center;padding:10px}
    `;
    document.head.appendChild(style);
  }

  function showToast(text) {
    const toast = document.getElementById('rubyGiftToast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(window.__rubyGiftToastTimer);
    window.__rubyGiftToastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function ensureDailyGift() {
    ensureStyles();
    if (document.getElementById('rubyDailyGift')) {
      syncGiftVisibility();
      return;
    }

    const gift = document.createElement('button');
    gift.id = 'rubyDailyGift';
    gift.type = 'button';
    gift.setAttribute('aria-label', 'Claim daily 25 Energy bonus');
    gift.innerHTML = '🎁<span class="ruby-gift-badge">+25</span>';
    gift.addEventListener('click', claimDailyBonus);
    document.body.appendChild(gift);

    const toast = document.createElement('div');
    toast.id = 'rubyGiftToast';
    document.body.appendChild(toast);
    syncGiftVisibility();
  }

  function syncGiftVisibility() {
    const gift = document.getElementById('rubyDailyGift');
    if (!gift) return;
    gift.classList.toggle('claimed', isDailyClaimed());
  }

  async function getUser() {
    if (!db) return null;
    const { data, error } = await db.auth.getUser();
    if (error) throw error;
    return data?.user || null;
  }

  async function getProfile(user) {
    const { data, error } = await db
      .from('profiles')
      .select('id,energy')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw new Error('Could not load profile: ' + error.message);
    if (!data) throw new Error('Profile not found for this account.');
    return data;
  }

  async function refreshEnergy() {
    if (!db) return;
    try {
      const user = await getUser();
      if (!user) return;
      const profile = await getProfile(user);
      updateTopEnergy(profile.energy);
    } catch (error) {
      console.warn('Energy refresh failed:', error?.message || error);
    }
  }

  async function changeEnergy(delta) {
    const user = await getUser();
    if (!user) throw new Error('Please login first.');

    const profile = await getProfile(user);
    const current = Number(profile.energy || 0);
    const next = Math.max(0, current + delta);

    const { data, error } = await db
      .from('profiles')
      .update({ energy: next })
      .eq('id', user.id)
      .select('energy')
      .single();

    if (error) throw new Error('Could not update energy: ' + error.message);
    updateTopEnergy(data.energy);
    return Number(data.energy);
  }

  async function claimDailyBonus() {
    if (!db) return;
    if (isDailyClaimed()) {
      syncGiftVisibility();
      return;
    }

    const gift = document.getElementById('rubyDailyGift');
    if (gift) gift.disabled = true;

    try {
      const user = await getUser();
      if (!user) throw new Error('Please login first.');

      // Daily claim is intentionally handled against the user's own profile row.
      // This keeps the gift independent from the chat Edge Function.
      const newEnergy = await changeEnergy(DAILY_BONUS);
      markDailyClaimed();
      syncGiftVisibility();
      showToast(`🎁 Daily bonus claimed! +${DAILY_BONUS} Energy  •  ${newEnergy} total`);
    } catch (error) {
      showToast('❌ ' + (error?.message || error));
    } finally {
      if (gift) gift.disabled = false;
    }
  }

  function ensureUI() {
    ensureDailyGift();
    let root = document.getElementById('rubyKindroidChat');
    if (root) return root;

    root = document.createElement('div');
    root.id = 'rubyKindroidChat';
    root.innerHTML = `
      <div class="rk-head">
        <button class="rk-back" id="rkBack" type="button">‹</button>
        <div class="rk-head-info">
          <div class="rk-title" id="rkTitle">Ruby Chan</div>
          <div class="rk-status">● AI Chat</div>
        </div>
      </div>
      <div class="rk-messages" id="rkMessages"><div class="rk-empty">Start a conversation ✨</div></div>
      <form class="rk-compose" id="rkForm">
        <input class="rk-input" id="rkInput" autocomplete="off" placeholder="Message...">
        <button class="rk-send" id="rkSend" type="submit">➤</button>
      </form>
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
    if (!messages.length) {
      box.innerHTML = '<div class="rk-empty">Start a conversation ✨</div>';
      return;
    }
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
    const r = await db.from('messages').select('role,content,created_at').eq('conversation_id', conversationId).order('created_at', { ascending: true });
    if (!r.error) render(r.data || []);
  }

  async function openChat(detail) {
    activeCharacter = detail.character;
    activeConversation = detail.conversation || null;
    if (!activeConversation?.id && window.rubyCurrentConversation) activeConversation = { id: window.rubyCurrentConversation };
    ensureDailyGift();
    const root = ensureUI();
    root.querySelector('#rkTitle').textContent = activeCharacter || 'Ruby Chan';
    root.classList.add('open');
    render(detail.messages || []);
    await refreshEnergy();
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

    try {
      const user = await getUser();
      if (!user) throw new Error('Please login first.');
      const profile = await getProfile(user);
      energy = Number(profile.energy || 0);
      updateTopEnergy(energy);
      if (energy <= 0) {
        showToast('⚡ No Energy. Claim your 🎁 Daily +25 bonus.');
        return;
      }
    } catch (error) {
      const box = document.getElementById('rkMessages');
      if (box) {
        const e = document.createElement('div');
        e.className = 'rk-error';
        e.textContent = 'Chat error: ' + (error?.message || error);
        box.appendChild(e);
      }
      return;
    }

    if (!activeConversation?.id && window.rubyCurrentConversation) activeConversation = { id: window.rubyCurrentConversation };
    input.value = '';
    send.disabled = true;
    const box = document.getElementById('rkMessages');
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
            if (responseBody?.error) details = responseBody.details ? `${responseBody.error}: ${responseBody.details}` : responseBody.error;
          } catch (_) {}
        }
        throw new Error(details);
      }

      const reply = data?.reply || '';
      if (!reply) throw new Error('AI returned an empty reply');

      // Deduct one Energy only after a successful AI reply.
      await changeEnergy(-1);

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
      await refreshEnergy();
    } finally {
      send.disabled = false;
      input.focus();
    }
  }

  window.addEventListener('rubychat:open', e => openChat(e.detail || {}));
  window.addEventListener('rubychat:loaded', e => openChat(e.detail || {}));

  function init() {
    ensureStyles();
    ensureDailyGift();
    refreshEnergy();
    if (db) db.auth.onAuthStateChange(() => setTimeout(() => {
      syncGiftVisibility();
      refreshEnergy();
    }, 0));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
