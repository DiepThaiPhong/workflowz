import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, Sparkles, Zap } from 'lucide-react';
import { askTutor } from '../services/geminiService';

const GREEN = '#92e600';
const DARK = '#0b0f0c';
const PANEL = '#0e150d';

const QUICK_SUGGESTIONS_EN = [
  'What is WorkFlowz?',
  'How do I run a workflow?',
  'How do I become a Creator?',
  'What workflows are available?',
];
const QUICK_SUGGESTIONS_VI = [
  'WorkFlowz là gì?',
  'Cách chạy một workflow?',
  'Làm sao trở thành Creator?',
  'Có những workflow nào?',
];

interface Message { role: 'user' | 'ai'; text: string }

export default function FloatingAIChat() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = isEn ? QUICK_SUGGESTIONS_EN : QUICK_SUGGESTIONS_VI;

  const greetingMsg: Message = {
    role: 'ai',
    text: isEn
      ? "👋 Hi! I'm your WorkFlowz AI Mentor. Ask me anything about workflows, learning, or creating!"
      : '👋 Xin chào! Tôi là AI Mentor của WorkFlowz. Hỏi tôi bất cứ điều gì về workflow, học tập, hay tạo nội dung nhé!'
  };

  // Populate greeting when first opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([greetingMsg]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const result = await askTutor(text, []);
      setMessages(prev => [...prev, { role: 'ai', text: result.text }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: isEn ? 'Sorry, an error occurred. Please try again.' : 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="w-80 rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: PANEL,
              border: `1px solid rgba(146,230,0,0.2)`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              maxHeight: '440px',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'rgba(146,230,0,0.12)', background: 'rgba(146,230,0,0.06)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: GREEN }}>
                <Sparkles size={13} color={DARK} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">WorkFlowz AI Mentor</p>
                <p className="text-[10px] text-gray-500">{isEn ? 'Powered by Gemini' : 'Được hỗ trợ bởi Gemini'}</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5" style={{ minHeight: 160, maxHeight: 260 }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed"
                    style={msg.role === 'user'
                      ? { background: GREEN, color: DARK, borderRadius: '16px 16px 4px 16px' }
                      : { background: 'rgba(255,255,255,0.06)', color: '#d1d5db', borderRadius: '16px 16px 16px 4px' }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl flex items-center gap-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Quick suggestions (show only if no user messages yet) */}
              {messages.filter(m => m.role === 'user').length === 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {suggestions.map(s => (
                    <button key={s} onClick={() => sendMessage(s)}
                      className="text-[10px] px-2 py-1 rounded-full border transition-all hover:text-white"
                      style={{ borderColor: 'rgba(146,230,0,0.25)', color: '#9ca3af' }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 border-t" style={{ borderColor: 'rgba(146,230,0,0.1)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder={isEn ? 'Ask anything...' : 'Hỏi bất cứ điều gì...'}
                className="flex-1 text-xs px-3 py-2 rounded-xl text-white placeholder-gray-600 outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(146,230,0,0.15)' }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all"
                style={{ background: GREEN }}
              >
                <Send size={13} color={DARK} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating bubble */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        animate={!open ? { boxShadow: ['0 0 0 0 rgba(146,230,0,0.4)', '0 0 0 12px rgba(146,230,0,0)', '0 0 0 0 rgba(146,230,0,0)'] } : {}}
        transition={!open ? { repeat: Infinity, duration: 2.5, ease: 'easeOut' } : {}}
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: GREEN, boxShadow: '0 4px 20px rgba(146,230,0,0.4)' }}
      >
        {open ? <X size={22} color={DARK} /> : <Zap size={22} color={DARK} fill={DARK} />}
      </motion.button>
    </div>
  );
}
