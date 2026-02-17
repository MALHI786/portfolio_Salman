document.addEventListener('DOMContentLoaded', () => {
  const chatBtn = document.getElementById('chat-widget-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('close-chat-btn');
  const sendBtn = document.getElementById('send-msg-btn');
  const inputField = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages');

  // Use n8n webhook (proxy to LongCat) so API key stays server-side
  const N8N_WEBHOOK_URL = 'https://mypcjnaab123.app.n8n.cloud/webhook/portfolio-chat';

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

      // Extract clean answer from various response formats
      let botReply = '';

      // n8n Respond to Webhook format: { answer: "..." }
      if (data.answer) {
        botReply = data.answer;
      }
      // OpenAI / LongCat format: { choices: [{ message: { content: "..." } }] }
      else if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        botReply = data.choices[0].message.content;
      }
      // Other formats
      else if (data.text) {
        botReply = data.text;
      } else if (data.content) {
        botReply = data.content;
      } else if (data.message && typeof data.message === 'object' && data.message.content) {
        botReply = data.message.content;
      } else if (typeof data.message === 'string') {
        botReply = data.message;
      } else {
        botReply = 'Sorry, I could not process the response. Please try again.';
      }

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

  function formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic
      .replace(/`([^`]+)`/g, '<code>$1</code>')          // Inline code
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')           // H3 headings
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')            // H2 headings
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')             // H1 headings
      .replace(/^- (.*$)/gm, '<li>$1</li>')             // List items
      .replace(/\n([0-9]+\. )(.*$)/gm, '<li>$2</li>')   // Numbered lists
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')        // Wrap lists
      .replace(/\n\n/g, '</p><p>')                       // Paragraphs
      .replace(/\n/g, '<br>');                          // Line breaks
  }

  function addMessage(text, sender, isLoading = false) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    
    if (sender === 'bot' && !isLoading) {
      div.innerHTML = '<p>' + formatMarkdown(text) + '</p>';
    } else {
      div.textContent = text;
    }
    
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
