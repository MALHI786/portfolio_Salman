document.addEventListener('DOMContentLoaded', () => {
  const chatBtn = document.getElementById('chat-widget-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('close-chat-btn');
  const sendBtn = document.getElementById('send-msg-btn');
  const inputField = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages');

  // URL of your n8n Webhook - REPLACE THIS with your actual Production URL
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
      if (N8N_WEBHOOK_URL.includes('YOUR_N8N_WEBHOOK_URL_HERE')) {
        throw new Error('Please configure the Webhook URL in chat.js');
      }

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();

      // Remove loading and add Bot Message
      removeMessage(loadingId);

      // Handle response structure (adjust based on your n8n output)
      const botReply = data.answer || data.text || data.output || "I didn't get a proper response.";
      addMessage(botReply, 'bot');

    } catch (error) {
      removeMessage(loadingId);
      addMessage(`Error: ${error.message}. Make sure n8n is active and URL is set.`, 'bot');
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
