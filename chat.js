document.addEventListener('DOMContentLoaded', () => {
  const chatBtn = document.getElementById('chat-widget-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('close-chat-btn');
  const sendBtn = document.getElementById('send-msg-btn');
  const inputField = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages');

  // LOCAL n8n webhook (change to ngrok URL for public deployment)
  const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/portfolio-chat';

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

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
      addMessage('Error: ' + error.message, 'bot');
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
