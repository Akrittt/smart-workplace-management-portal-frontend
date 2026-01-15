import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Send, X, MessageCircle, Loader, Bot, User, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]); // Added isOpen to scroll when opening

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadChatHistory();
    }
  }, [isOpen]);

  const loadChatHistory = async () => {
    try {
      const response = await api.get('/ai-assistant/history');

      // Transform backend history to UI format
      const historyMessages = [];
      const sortedData = [...response.data].reverse();
      sortedData.forEach(msg => {
        // 1. Add User Message
        historyMessages.push({
          role: 'user',
          content: msg.message,
          timestamp: new Date(msg.createdAt)
        });
        // 2. Add AI Response
        historyMessages.push({
          role: 'assistant',
          content: msg.response,
          timestamp: new Date(msg.createdAt)
        });
      });

      // If history is empty, add welcome message
      if (historyMessages.length === 0) {
        historyMessages.push({
          role: 'assistant',
          content: "👋 Hi! I'm your AI workplace assistant. I can help you with:\n\n* Applying for leave\n* Filing complaints\n* Checking your leave balance\n\n**Try asking:** \"Apply for sick leave tomorrow\"",
          timestamp: new Date()
        });
      }

      setMessages(historyMessages);
    } catch (error) {
      console.error('Failed to load chat history', error);
      // Fallback welcome message
      setMessages([{
        role: 'assistant',
        content: "👋 Hi! I'm your AI workplace assistant. How can I help you today?",
        timestamp: new Date()
      }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    setLoading(true);

    try {
      const response = await api.post('/ai-assistant/chat', {
        message: userMessage
      });

      console.log('AI Response:', response.data);

      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error(error);
      toast.error('Failed to get response.');
      const errorMessage = {
        role: 'assistant',
        content: "⚠️ Sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "👋 Chat cleared. How can I help you now?",
      timestamp: new Date()
    }]);
  };

  const quickActions = [
    "Check my leave balance",
    "Apply for sick leave tomorrow",
    "File a complaint about AC",
    "Check status of my complaints"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-white/80">Powered by Llama 3</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
              title="Clear Chat"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                >
                  {/* Avatar */}
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border border-gray-200 text-primary-600'
                      }`}
                  >
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm ${msg.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                  >
                    <div className={`text-sm prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert text-white' : ''}`}>
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-0.5" {...props} />,
                            strong: ({ node, ...props }) => <span className="font-bold" {...props} />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>

                    <p
                      className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'
                        }`}
                    >
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 items-center bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-200">
                  <Loader className="animate-spin text-primary-600" size={18} />
                  <span className="text-xs text-gray-500 font-medium">Processing request...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions (Only show if few messages) */}
          {messages.length <= 2 && (
            <div className="p-3 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-500 mb-2 font-medium ml-1">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(action);
                      sendMessage();
                    }}
                    className="px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2.5 rounded-full transition-all shadow-sm hover:shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;