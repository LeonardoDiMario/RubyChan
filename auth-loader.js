// This file loads the Ruby Chan authentication and chat modules.
const authScript = document.createElement('script');
authScript.src = './auth.js';
authScript.defer = true;
document.head.appendChild(authScript);

const welcomeAuth = document.createElement('script');
welcomeAuth.src = './welcome-auth.js';
welcomeAuth.defer = true;
document.head.appendChild(welcomeAuth);

const chatSync = document.createElement('script');
chatSync.src = './chat-sync.js';
chatSync.defer = true;
document.head.appendChild(chatSync);

const chatClient = document.createElement('script');
chatClient.src = './chat-client.js';
chatClient.defer = true;
document.head.appendChild(chatClient);
