(() => {
  'use strict';
  const state = { page: 'home', selectedCharacter: null };
  const $ = (s) => document.querySelector(s);

  function render() {
    document.querySelectorAll('.v2-page').forEach(p => p.classList.toggle('active', p.id === `v2-${state.page}`));
    document.querySelectorAll('.v2-nav button').forEach(b => b.classList.toggle('active', b.dataset.page === state.page));
    if (state.page === 'home') $('#v2Title').textContent = window.rubyUser ? `Welcome, ${window.rubyUser.name || 'Mario'}` : 'Welcome to Ruby Chan';
  }

  window.v2Navigate = (page) => { state.page = page; render(); window.scrollTo(0,0); };
  window.v2SelectCharacter = (name) => {
    state.selectedCharacter = name;
    const detail = $('#v2-character-detail');
    const list = $('#v2-character-list');
    detail.querySelector('[data-name]').textContent = name;
    list.classList.add('hidden');
    detail.classList.remove('hidden');
  };
  window.v2BackCharacters = () => { $('#v2-character-detail').classList.add('hidden'); $('#v2-character-list').classList.remove('hidden'); };
  window.v2Chat = (name) => {
    window.v2Navigate('chat');
    $('#v2ChatCharacter').textContent = name;
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.v2-nav button').forEach(b => b.addEventListener('click', () => window.v2Navigate(b.dataset.page)));
    $('#v2Search').addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.v2-character').forEach(c => c.hidden = q && !c.dataset.name.toLowerCase().includes(q));
    });
    render();
    document.documentElement.classList.add('v2-ready');
  });
})();
