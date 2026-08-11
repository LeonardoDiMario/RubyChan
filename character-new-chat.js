/* Ruby Chan — clean character selection + single-character detail */
(function () {
  'use strict';
  if (window.__rubyCharacterCleanV2) return;
  window.__rubyCharacterCleanV2 = true;

  const details = {
    Sakura: 'Warm, cheerful and affectionate. She keeps conversations light, caring and playful while making the user feel comfortable.',
    Yuna: 'Calm, gentle and mysterious. She listens carefully and responds with thoughtful, friendly energy.',
    Rin: 'Elegant, quiet and intelligent. She prefers composed, thoughtful conversations with a clever touch.',
    Akari: 'Confident, creative and lively. She brings energetic ideas and a bold personality to conversations.',
    Hana: 'Kind, caring and soft-spoken. She focuses on supportive, warm and natural conversation.',
    Reina: 'Elegant, mature and calm. She gives composed, thoughtful and reassuring conversation.'
  };

  const style = document.createElement('style');
  style.id = 'ruby-character-clean-v2-style';
  style.textContent = `
    #page-characters .character-card{cursor:pointer;transition:border-color .2s,box-shadow .2s,transform .2s;}
    #page-characters .character-card:hover{transform:translateY(-2px);}
    #page-characters .character-card.ruby-detail-hidden{display:none!important;}
    #page-characters .character-card .character-ability,
    #page-characters .character-card .character-description,
    #page-characters .character-card .ruby-personality,
    #page-characters .character-card .ruby-character-actions,
    #page-characters .character-card .ruby-character-ability,
    #page-characters .character-card .chat-btn{display:none!important;}
    .ruby-character-detail{display:none;position:relative;min-height:calc(100vh - 190px);padding:8px 2px 20px;}
    .ruby-character-detail.open{display:block;}
    .ruby-character-back{position:absolute;top:0;right:0;width:42px;height:42px;border:1px solid rgba(124,58,237,.14);border-radius:14px;background:#fff;color:#7c3aed;font-size:27px;line-height:1;cursor:pointer;box-shadow:0 7px 20px rgba(60,40,120,.08);}
    .ruby-character-detail-card{margin-top:8px;padding:24px 18px 20px;border-radius:26px;background:linear-gradient(150deg,#fff,#faf7ff);border:1px solid rgba(124,58,237,.14);box-shadow:0 18px 45px rgba(60,40,120,.10);text-align:center;}
    .ruby-character-detail-card img{width:138px;height:138px;border-radius:26px;object-fit:cover;object-position:center top;border:2px solid rgba(124,58,237,.14);box-shadow:0 12px 30px rgba(60,40,120,.13);}
    .ruby-character-detail-card h2{margin:15px 0 5px;font-size:24px;color:#21172d;}
    .ruby-character-tags{font-size:13px;color:#7c3aed;font-weight:750;margin-bottom:18px;}
    .ruby-character-personality{padding:15px 14px;border-radius:17px;background:#fff;border:1px solid rgba(124,58,237,.11);text-align:left;color:#5e5667;font-size:13px;line-height:1.65;box-shadow:0 7px 20px rgba(60,40,120,.05);}
    .ruby-character-personality strong{display:block;color:#21172d;font-size:14px;margin-bottom:4px;}
    .ruby-character-detail-chat{width:100%;margin-top:16px;padding:13px;border:0;border-radius:13px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:850;font-size:14px;cursor:pointer;box-shadow:0 10px 24px rgba(124,58,237,.22);}
  `;
  document.head.appendChild(style);

  function getImage(card) {
    return card.querySelector('.avatar-img')?.src || '';
  }

  function openDetail(card) {
    const page = document.getElementById('page-characters');
    const grid = page?.querySelector('.characters-grid');
    const search = page?.querySelector('.character-search,.ruby-platform-search');
    const subtitle = page?.querySelector('.section-subtitle');
    const detail = page?.querySelector('.ruby-character-detail');
    if (!page || !grid || !detail) return;

    const name = card.dataset.rubyCharacter;
    const tags = card.dataset.rubyTags || '';
    const image = card.dataset.rubyImage || '';
    const description = details[name] || 'A unique AI character with a distinct personality and conversation style.';

    grid.querySelectorAll('.character-card').forEach(c => c.classList.add('ruby-detail-hidden'));
    if (search) search.style.display = 'none';
    if (subtitle) subtitle.style.display = 'none';
    detail.innerHTML = `
      <button type="button" class="ruby-character-back" aria-label="Back">‹</button>
      <div class="ruby-character-detail-card">
        <img src="${image}" alt="${name}">
        <h2>${name}</h2>
        <div class="ruby-character-tags">${tags}</div>
        <div class="ruby-character-personality"><strong>Personality</strong>${description}</div>
        <button type="button" class="ruby-character-detail-chat">Chat</button>
      </div>`;
    detail.classList.add('open');

    detail.querySelector('.ruby-character-back').onclick = function () {
      detail.classList.remove('open');
      detail.innerHTML = '';
      grid.querySelectorAll('.character-card').forEach(c => c.classList.remove('ruby-detail-hidden'));
      if (search) search.style.display = '';
      if (subtitle) subtitle.style.display = '';
    };

    detail.querySelector('.ruby-character-detail-chat').onclick = function () {
      if (typeof window.rubyShowCharacterHistory === 'function') window.rubyShowCharacterHistory(name);
      else if (typeof window.startChat === 'function') window.startChat(name);
    };
  }

  function clean() {
    const page = document.getElementById('page-characters');
    const grid = page?.querySelector('.characters-grid');
    if (!page || !grid) return;

    let detail = page.querySelector('.ruby-character-detail');
    if (!detail) {
      detail = document.createElement('div');
      detail.className = 'ruby-character-detail';
      grid.insertAdjacentElement('afterend', detail);
    }

    grid.querySelectorAll('.character-card').forEach(card => {
      const name = card.querySelector('h3')?.textContent?.trim();
      if (!name) return;
      const p = card.querySelector('p');
      const tags = p?.textContent?.trim() || '';
      const image = getImage(card);
      card.dataset.rubyCharacter = name;
      card.dataset.rubyTags = tags;
      card.dataset.rubyImage = image;

      // Keep only name + the short personality line on the selection card.
      card.querySelectorAll('.character-ability,.character-description,.ruby-personality,.ruby-character-actions,.ruby-character-ability,.chat-btn').forEach(el => el.remove());
      if (!p) {
        const line = document.createElement('p');
        line.textContent = tags;
        card.appendChild(line);
      }

      if (!card.dataset.rubyDetailHooked) {
        card.dataset.rubyDetailHooked = '1';
        card.setAttribute('tabindex', '0');
        card.onclick = function (event) {
          if (event.target.closest('button,a,input')) return;
          openDetail(card);
        };
        card.onkeydown = function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDetail(card);
          }
        };
      }
    });
  }

  function boot() {
    clean();
    const mo = new MutationObserver(() => requestAnimationFrame(clean));
    if (document.body) mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
