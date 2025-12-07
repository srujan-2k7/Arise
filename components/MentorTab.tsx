import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { createChatSession, sendMessageToAsh } from '../services/geminiService';
import { ChatMessage } from '../types';
import { motion } from 'framer-motion';

export const MentorTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello. I am Ash. What is your objective?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = createChatSession();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToAsh(chatSessionRef.current, userMsg.text);
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = { role: 'model', text: "Connection interruption.", timestamp: Date.now() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black pb-20">
      <header className="p-4 border-b border-zinc-900 bg-black/90 backdrop-blur sticky top-0 z-10 flex items-center space-x-4">
         <div className="relative">
             <div className="w-12 h-12 rounded-full bg-zinc-900 border border-arise-red flex items-center justify-center text-arise-red shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                 <Bot size={24} />
             </div>
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
         </div>
         <div>
             <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Ash</h2>
             <p className="text-[10px] text-zinc-500 uppercase tracking-widest">System Intelligence</p>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-line shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-zinc-800 text-white rounded-tr-none border border-zinc-700' 
                  : 'bg-zinc-950 text-gray-300 rounded-tl-none border border-arise-border'
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-zinc-950 border border-arise-border p-4 rounded-2xl rounded-tl-none flex items-center space-x-2">
                    <Loader2 className="animate-spin text-arise-red" size={16} />
                    <span className="text-xs text-zinc-500 animate-pulse">Analyzing...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-black border-t border-zinc-900">
        <div className="flex space-x-2 bg-zinc-900/50 p-1.5 rounded-full border border-zinc-800">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Enter command..."
            className="flex-1 bg-transparent px-4 py-2 text-white focus:outline-none placeholder-zinc-600 font-sans"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`bg-arise-red text-white w-10 h-10 rounded-full flex items-center justify-center transition-all ${isLoading ? 'opacity-50' : 'hover:bg-red-600 hover:shadow-[0_0_10px_rgba(220,38,38,0.5)]'}`}
          >
            <Send size={18} className={isLoading ? 'opacity-0' : 'ml-0.5'} />
          </button>
        </div>
      </div>
    </div>
  );
};