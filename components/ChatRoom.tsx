
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Resident } from '../types';
import { Send, User, MessageCircle } from 'lucide-react';

interface ChatRoomProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  currentUser: Resident;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ messages, onSendMessage, currentUser }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col h-[70vh] overflow-hidden">
      <div className="p-6 border-b flex items-center gap-3 bg-slate-50/50">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Ruang Chat Warga</h3>
          <p className="text-xs text-slate-400">Komunikasi terbuka antar warga KORWIL 1</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${isMe ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isMe ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <User className={`w-4 h-4 ${isMe ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <div>
                  {!isMe && <p className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">{msg.senderName}</p>}
                  <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                    isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[9px] text-slate-300 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
            <MessageCircle className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">Belum ada percakapan. Mulai sapa tetangga Anda!</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex gap-2 p-1.5 bg-slate-50 border rounded-full focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <input 
            type="text" 
            placeholder="Ketik pesan untuk warga lain..."
            className="flex-1 bg-transparent px-5 py-2 text-sm outline-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
