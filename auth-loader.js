// Ruby Chan client modules
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

const premiumUI = document.createElement('script');
premiumUI.src = './premium-ui.js';
premiumUI.defer = true;
document.head.appendChild(premiumUI);

const telegramBridge = document.createElement('script');
telegramBridge.src = './telegram-bridge.js';
telegramBridge.defer = true;
document.head.appendChild(telegramBridge);
