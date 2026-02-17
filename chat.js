document.addEventListener('DOMContentLoaded', () => {
  const chatBtn = document.getElementById('chat-widget-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('close-chat-btn');
  const sendBtn = document.getElementById('send-msg-btn');
  const inputField = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages');

  // Use n8n webhook (proxy to LongCat) so API key stays server-side
  const N8N_WEBHOOK_URL = 'https://applicable-lynelle-lovelessly.ngrok-free.dev/webhook/portfolio-chat';

  chatBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) inputField.focus();
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });

  sendBtn.addEventListener('click', sendMessage);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    inputField.value = '';
    inputField.disabled = true;
    sendBtn.disabled = true;

    const loadingId = addMessage('Thinking...', 'bot', true);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data = await response.json();
      if (Array.isArray(data)) data = data[0];

      console.log('Response:', data);
      removeMessage(loadingId);

      const botReply = data.answer || data.text || data.content ||
        (data.message && data.message.content) ||
        (typeof data.message === 'string' ? data.message : null) ||
        'Debug: ' + JSON.stringify(data);

      addMessage(botReply, 'bot');
    } catch (error) {
      removeMessage(loadingId);
      console.error('Chat error:', error);
      
      // Check if it's a network/connection error
      const isOffline = error.name === 'TypeError' || 
                       error.message.includes('Failed to fetch') ||
                       error.message.includes('NetworkError') ||
                       error.message.includes('network') ||
                       !navigator.onLine;
      
      // Check if it's a rate limit error
      const isRateLimit = error.message.includes('429') || 
                         error.message.includes('rate_limit_exceeded');
      
      if (isOffline) {
        addMessage('🔴 Connection failed. Please check your internet connection and try again.', 'bot');
      } else if (isRateLimit) {
        addMessage('⚠️ API rate limit reached. Please try again in a few moments.', 'bot');
      } else {
        addMessage('Sorry, I encountered an issue. Please try again or contact directly via email: salmanmalhig@gmail.com', 'bot');
      }
    } finally {
      inputField.disabled = false;
      sendBtn.disabled = false;
      inputField.focus();
    }
  }

  function addMessage(text, sender, isLoading = false) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.textContent = text;
    if (isLoading) div.id = 'loading-msg';
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return div.id;
  }

  function removeMessage(id) {
    const el = document.getElementById(id || 'loading-msg');
    if (el) el.remove();
  }
});
