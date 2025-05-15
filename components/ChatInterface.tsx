import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface({ currentCode, onCodeUpdate }: any) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Hi there! How would you like to improve your portfolio? You can ask me to change colors, update layouts, add sections, or modify content.' 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    
    setLoading(true);
    
    // Add user message to chat
    const userMessage = { role: 'user', content: message };
    setChatHistory((prev : any) => [...prev, userMessage]);
    setMessage(''); // Clear input immediately for better UX
    
    try {
      // Call the update API
      const response = await fetch('/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
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
    } catch (error) {
      console.error('Error updating portfolio:', error);
      // Add error message to chat
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request. Please try again or rephrase your instruction.' 
      };
      setChatHistory((prev : any) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
          <Sparkles className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">AI Design Assistant</h2>
          <p className="text-xs text-gray-500">Powered by Groq LLM</p>
        </div>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4" style={{ minHeight: "280px" }}>
        {chatHistory.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 rounded-tl-none'
              }`}
            >
              <p className={msg.role === 'user' ? 'text-white' : 'text-gray-700'}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="max-w-[80%] p-3 rounded-2xl shadow-sm bg-white border border-gray-200 rounded-tl-none">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
                <p className="text-gray-500 text-sm">Updating your portfolio...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 bg-white transition-all">
          <input
            ref={inputRef}
            type="text"
            className="flex-grow p-3 rounded-l-lg focus:outline-none text-gray-700 placeholder-gray-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a request to update your portfolio..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !message.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[4rem]"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400 px-1">
          Ask to change colors, layouts, fonts, or add new sections to your portfolio
        </p>
      </div>
    </div>
  );
}

