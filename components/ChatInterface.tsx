import { useState } from 'react';

export default function ChatInterface({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'How would you like to update your portfolio? You can ask me to change colors, add sections, or modify content.' }
  ]);
  const [isSending, setIsSending] = useState(false);
  
  const handleSend = async () => {
    if (!message.trim() || isSending) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsSending(true);
    
    try {
      // Call the update function
      const response = await onSendMessage(message);
      
      // Add AI response to chat
      const aiMessage = { role: 'assistant', content: response.message };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error updating portfolio:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while updating your portfolio.' 
      }]);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Chat with AI</h2>
      
      <div className="border rounded p-4 h-80 overflow-auto mb-4 bg-gray-50">
        {chatHistory.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-3 p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-100 ml-12' 
                : 'bg-gray-100 mr-12'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask for changes to your portfolio..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={isSending}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:opacity-50"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}