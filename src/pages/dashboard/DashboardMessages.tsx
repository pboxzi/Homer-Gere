import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Inbox, Send, ArrowLeft, Circle, Trash2 } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const DashboardMessages: React.FC = () => {
  const { messages, addMessage, markThreadRead, addMessageThread, deleteMessageThread } = useDashboard();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');
  const [showNewThread, setShowNewThread] = useState(false);

  const thread = messages.find((t) => t.id === selectedThread);

  const handleSendReply = () => {
    if (!thread || !replyText.trim()) return;
    addMessage(thread.id, replyText.trim());
    setReplyText('');
  };

  const handleCreateThread = () => {
    if (!newSubject.trim() || !newBody.trim()) return;
    const threadId = addMessageThread(newSubject.trim(), newBody.trim());
    setSelectedThread(threadId);
    setNewSubject('');
    setNewBody('');
    setShowNewThread(false);
  };

  const senderLabel = (sender: string) => {
    if (sender === 'homer') return 'Homer Gere';
    if (sender === 'system') return 'System';
    return 'You';
  };

  const unreadCount = messages.filter((t) => !t.read).length;

  if (thread) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <button onClick={() => setSelectedThread(null)} className="flex items-center gap-2 text-sm text-[#57534E] hover:text-[#1C1917] transition-colors mb-4 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to messages
          </button>
          <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">{thread.subject}</h1>
        </motion.div>

        <div className="space-y-4">
          {thread.messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.sender === 'member' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.sender === 'member'
                  ? 'bg-[#1C1917] text-white'
                  : msg.sender === 'homer'
                    ? 'bg-[#A6852F]/10 border border-[#A6852F]/20'
                    : 'bg-[#F3F1ED] border border-[#E8E5DF]/60'
              }`}>
                {msg.sender !== 'member' && (
                  <p className="text-[10px] font-medium text-[#A6852F] mb-1">{senderLabel(msg.sender)}</p>
                )}
                <p className={`text-sm ${msg.sender === 'member' ? 'text-white' : 'text-[#1C1917]'}`}>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.sender === 'member' ? 'text-white/50' : 'text-[#57534E]/60'}`}>{msg.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
            placeholder="Type your reply..."
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E8E5DF]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30"
          />
          <button onClick={handleSendReply} className="w-10 h-10 rounded-xl bg-[#1C1917] text-white flex items-center justify-center hover:bg-[#292524] transition-colors cursor-pointer">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">My Messages</h1>
            <p className="text-sm text-[#57534E] mt-1">{unreadCount > 0 ? `${unreadCount} unread thread${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}</p>
          </div>
          <button onClick={() => setShowNewThread(!showNewThread)} className="inline-flex items-center gap-2 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer bg-[#A6852F]/10 px-3 py-1.5 rounded-xl">
            <Inbox className="w-3.5 h-3.5" /> New Thread
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showNewThread && (
          <motion.div className="rounded-2xl border border-[#A6852F]/8 bg-white p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow duration-500" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Subject"
              className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30"
            />
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Write your message..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleCreateThread} className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-medium px-5 py-2.5 rounded-2xl transition-all cursor-pointer">
                <Send className="w-4 h-4" /> Send
              </button>
              <button onClick={() => setShowNewThread(false)} className="text-sm text-[#57534E] hover:text-[#1C1917] px-4 py-2.5 cursor-pointer">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#A6852F]/20 bg-[#A6852F]/5 p-12 text-center shadow-sm hover:shadow-md transition-shadow duration-500">
            <Inbox className="w-8 h-8 text-[#57534E]/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-[#1C1917]">No messages yet</p>
            <p className="text-xs text-[#57534E] mt-1">Start a new thread to begin a conversation.</p>
            <button onClick={() => setShowNewThread(true)} className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer">
              <Inbox className="w-3 h-3" /> New Thread
            </button>
          </div>
        ) : (
          messages.map((t, i) => (
            <motion.button
              key={t.id}
              onClick={() => { setSelectedThread(t.id); markThreadRead(t.id); }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-500 cursor-pointer ${
                !t.read ? 'border-[#A6852F]/20 bg-[#A6852F]/5 shadow-sm hover:shadow-md' : 'border-[#A6852F]/8 bg-white hover:border-[#A6852F]/10 shadow-sm hover:shadow-md'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!t.read ? 'bg-[#A6852F]/10 text-[#A6852F]' : 'bg-[#F3F1ED] text-[#57534E]'}`}>
                <Inbox className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#1C1917] truncate">{t.subject}</p>
                  {!t.read && <Circle className="w-2 h-2 fill-[#A6852F] text-[#A6852F] shrink-0" />}
                </div>
                <p className="text-xs text-[#57534E] truncate mt-0.5">{t.lastMessage}</p>
                <p className="text-[10px] text-[#57534E]/60 mt-0.5">{t.lastDate}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteMessageThread(t.id); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E]/30 hover:text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
};
