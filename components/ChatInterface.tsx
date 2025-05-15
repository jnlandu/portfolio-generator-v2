import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Lightbulb } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface({ currentCode, onCodeUpdate }: any) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Hi there! How would you like to improve your portfolio? I can help with design changes, content updates, and more.' 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [suggestions] = useState([
    "Make the design more modern",
    "Use a dark theme",
    "Add a contact form section",
    "Make the colors more vibrant",
    "Improve the mobile responsiveness"
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    
    setLoading(true);
    
    // Add user message to chat
    const userMessage = { role: 'user', content: message };
    setChatHistory((prev : any) => [...prev, userMessage]);
    setMessage('');
    
    try {
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update portfolio');
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      const aiMessage = { role: 'assistant', content: data.message };
      setChatHistory((prev : any) => [...prev, aiMessage]);
      
      // Update code in parent component
      if (data.code) {
        onCodeUpdate(data.code);
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request. Please try again or rephrase your instruction.' 
      };
      setChatHistory((prev : any) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-indigo-50">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3">
            <Sparkles className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AI Design Assistant</h3>
            <p className="text-xs text-gray-500">Powered by advanced AI</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatHistory.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-lg shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white border border-gray-200 rounded-bl-none'
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
            <div className="max-w-[85%] p-3 rounded-lg shadow-sm bg-white border border-gray-200 rounded-bl-none">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
                <p className="text-gray-500 text-sm">Updating your portfolio...</p>
              </div>
            </div>
          </div>
        )}
        
        {chatHistory.length === 1 && !loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700">Try these suggestions</h4>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.map((suggestion, i) => (
                <button 
                  key={i}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex rounded-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-300 bg-white transition-all">
          <input
            ref={inputRef}
            type="text"
            className="flex-grow px-4 py-2 focus:outline-none text-gray-700 placeholder-gray-400"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !message.trim()}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 px-1">
          Ask to change colors, layouts, fonts, or add new sections to your portfolio
        </p>
      </div>
    </div>
  );
}