import { useState } from 'react';


interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
export default function ChatInterface({ currentCode, onCodeUpdate }: any) {
  // const [message, setMessage] = useState('');
  // const [chatHistory, setChatHistory] = useState([
  //   { role: 'assistant', content: 'How would you like to update your portfolio? You can ask me to change colors, add sections, or modify content.' }
  // ]);
  const [isSending, setIsSending] = useState(false);
   const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    
    // Add user message to chat
    const userMessage = { role: 'user', content: message };
    setChatHistory((prev : any) => [...prev, userMessage]);
    
    try {
      // Call the update API
      const response = await fetch('/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          currentCode: currentCode
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      // Add AI response to chat
      const aiMessage = { role: 'assistant', content: data.message };
      setChatHistory((prev : any) => [...prev, aiMessage]);
      
      // Update the code in the parent component
      onCodeUpdate(data.code);
      
      setLoading(false);
      setMessage('');
    } catch (error) {
      console.error('Error updating portfolio:', error);
      // Add error message to chat
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      };
      setChatHistory((prev : any) => [...prev, errorMessage]);
      setLoading(false);
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
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={isSending}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:opacity-50"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}