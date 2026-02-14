document.addEventListener('DOMContentLoaded', () => {
  const chatBtn = document.getElementById('chat-widget-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('close-chat-btn');
  const sendBtn = document.getElementById('send-msg-btn');
  const inputField = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages');

  // URL of your n8n Webhook
  const N8N_WEBHOOK_URL = 'https://mypcjnaab123.app.n8n.cloud/webhook/portfolio-chat';

  // Toggle Chat Window
  chatBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      inputField.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });

  // Send Message
  sendBtn.addEventListener('click', sendMessage);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    // Add User Message
    addMessage(text, 'user');
    inputField.value = '';
    inputField.disabled = true;
    sendBtn.disabled = true;

    // Add Loading Indicator
    const loadingId = addMessage('Typing...', 'bot', true);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      let data = await response.json();

      // n8n often returns an array [ { ... } ], so we take the first item
      if (Array.isArray(data) && data.length > 0) {
        data = data[0];
      }

      // Debug logging
      console.log('n8n Response:', data);

      // Remove loading
      removeMessage(loadingId);

      // Parse n8n response - handle multiple possible structures
      let botReply;
      if (typeof data === 'string') {
        botReply = data;
      } else if (data.answer) {
        botReply = data.answer;
      } else if (data.message && data.message.content) {
        botReply = data.message.content;
      } else if (data.message) {
        botReply = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
      } else if (data.content) {
        botReply = data.content;
      } else if (data.text) {
        botReply = data.text;
      } else if (data.output) {
        botReply = data.output;
      } else {
        // Fallback: show the raw JSON so we can debug what's happening
        botReply = "Debug: " + JSON.stringify(data);
      }

      addMessage(botReply, 'bot');

    } catch (error) {
      removeMessage(loadingId);
      console.error('Chat error:', error);
      addMessage(`Error: ${error.message}`, 'bot');
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
