import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Send, MessageCircle, Trash2, Lightbulb } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import PageTransition from '../components/PageTransition';
import { ChatMessage } from '../types';
import { askTutor } from '../services/geminiService';
import useLocalStorage from '../hooks/useLocalStorage';

const ChatTutorPage = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useLocalStorage<ChatMessage[]>('skillbridge-chat', []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Quick prompts – bilingual
  const quickPrompts = [
    t('nav.tutor') === 'AI Mentor' ? 'What is AI?' : 'AI là gì?',
    'Python cơ bản',
    'Viết CV hiện đại',
    'Prompt hay cho Gemini',
    'LinkedIn tips',
    'An toàn mạng xã hội',
  ];

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [history, isLoading]);

  const sendMessage = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || isLoading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: message, timestamp: new Date().toISOString() };
    setHistory((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const { text: reply, confidence } = await askTutor(message, history);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'ai', content: reply, timestamp: new Date().toISOString(), confidence };
      setHistory((prev) => [...prev, aiMsg]);
    } catch {
      setHistory((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', content: 'Xin lỗi, mình đang gặp sự cố kỹ thuật. Vui lòng thử lại sau! 🙏', timestamp: new Date().toISOString(), confidence: 0 }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearHistory = () => {
    if (window.confirm(t('tutor.clearConfirm'))) setHistory([]);
  };

  const isEmpty = history.length === 0;

  return (
    <PageTransition>
      <div className="flex flex-col h-screen pt-16">
        {/* Chat header */}
        <div className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                <MessageCircle size={14} className="text-primary" />
                {t('tutor.title')}
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-[#e9eff5] dark:text-[#cedde9]">{t('tutor.online')}</span>
              </div>
            </div>
          </div>
          {!isEmpty && (
            <button onClick={clearHistory} className="p-2 rounded-lg text-[#e9eff5] hover:text-accent hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-colors" title={t('tutor.clearHistory')}>
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 dark:bg-surface-dark/50 space-y-1">
          {isEmpty && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full gap-5 text-center py-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-4xl">🤖</div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{t('tutor.welcomeTitle')}</h2>
                <p className="text-sm text-[#cedde9] dark:text-[#e9eff5] max-w-xs">{t('tutor.welcomeDesc')}</p>
              </div>
              <div className="text-xs text-[#e9eff5] dark:text-[#cedde9] flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                <Lightbulb size={12} />{t('tutor.historyNote')}
              </div>
            </motion.div>
          )}
          <AnimatePresence>
            {history.map((msg) => (
              <ChatBubble key={msg.id} role={msg.role} content={msg.content} confidence={msg.confidence}
                timestamp={msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : undefined} />
            ))}
            {isLoading && <ChatBubble key="typing" role="ai" content="" isTyping />}
          </AnimatePresence>
        </div>

        {/* Quick prompts */}
        {isEmpty && (
          <div className="px-4 pb-2 bg-gray-50 dark:bg-surface-dark/50">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {quickPrompts.map((p) => (
                <button key={p} onClick={() => sendMessage(p)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3">
          <div className="flex items-end gap-2 max-w-3xl mx-auto">
            <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder={t('tutor.placeholder')} rows={1} className="input-field resize-none max-h-32 flex-1 leading-relaxed"
              style={{ minHeight: '44px' }} disabled={isLoading} />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage()} disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-xl bg-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white hover:bg-primary-500 transition-colors flex-shrink-0">
              <Send size={18} />
            </motion.button>
          </div>
          <p className="text-center text-[11px] text-gray-300 dark:text-gray-600 mt-2">
            ✦ {t('common.poweredByGemini')} · {t('common.disclaimer')}
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default ChatTutorPage;
