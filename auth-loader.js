// This file loads the Ruby Chan authentication module when used from a script tag.
const s = document.createElement('script');
s.src = './auth.js';
s.defer = true;
document.head.appendChild(s);

const welcomeAuth = document.createElement('script');
welcomeAuth.src = './welcome-auth.js';
welcomeAuth.defer = true;
document.head.appendChild(welcomeAuth);
