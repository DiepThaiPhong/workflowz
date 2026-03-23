import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, ChevronDown, ChevronUp, Lightbulb, Zap } from 'lucide-react';
import { ChatMessage } from '../../types';
import { askTutor } from '../../services/geminiService';

interface AITutorPanelProps {
  workflowTitle?: string;   // Current workflow context for RAG
  currentStep?: string;     // Current block content for RAG
  className?: string;
}

const QUICK_TIPS_VI = [
  'Giải thích bước này',
  'Cho ví dụ cụ thể',
  'Tại sao bước này quan trọng?',
  'Mẹo để làm tốt hơn',
];

const QUICK_TIPS_EN = [
  'Explain this step',
  'Give a specific example',
  'Why is this step important?',
  'Tips to do this better',
];

const AITutorPanel = ({ workflowTitle, currentStep, className = '' }: AITutorPanelProps) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const quickTips = isEn ? QUICK_TIPS_EN : QUICK_TIPS_VI;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const buildContext = (query: string) => {
    if (!workflowTitle && !currentStep) return query;
    const ctx = [
      workflowTitle ? `[Workflow: "${workflowTitle}"]` : '',
      currentStep ? `[Current step: "${currentStep}"]` : '',
      query,
    ].filter(Boolean).join(' | ');
    return ctx;
  };

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      workflowContext: currentStep,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const contextualQuery = buildContext(content);
      const { text: reply, confidence } = await askTutor(contextualQuery, messages);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: reply,
        timestamp: new Date().toISOString(),
        confidence,
        workflowContext: workflowTitle,
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: isEn ? 'Sorry, I ran into an issue. Please try again!' : 'Xin lỗi, mình gặp sự cố kỹ thuật. Vui lòng thử lại!',
        timestamp: new Date().toISOString(),
        confidence: 0,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
            <Zap size={14} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t('tutor.title')}</h3>
            {workflowTitle && (
              <p className="text-[10px] text-primary truncate max-w-[130px]">📌 {workflowTitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {collapsed ? <ChevronDown size={14} className="text-[#e9eff5]" /> : <ChevronUp size={14} className="text-[#e9eff5]" />}
        </div>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-col flex-1 overflow-hidden"
            style={{ maxHeight: '60vh' }}
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
              {messages.length === 0 ? (
                <div className="text-center py-4">
                  <Lightbulb size={22} className="text-yellow-400 mx-auto mb-2" />
                  <p className="text-xs text-[#cedde9] dark:text-[#e9eff5]">
                    {isEn
                      ? 'Ask me anything about this workflow step!'
                      : 'Hỏi mình bất cứ điều gì về bước này!'}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`text-xs leading-relaxed px-3 py-2 rounded-xl ${
                      msg.role === 'user'
                        ? 'bg-primary text-white ml-4 rounded-tr-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 mr-4 rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                    {msg.confidence !== undefined && msg.role === 'ai' && (
                      <div className="mt-1 text-[10px] opacity-50">
                        {t('common.confidenceLabel')}: {msg.confidence}%
                      </div>
                    )}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl mr-4 rounded-tl-sm">
                  {[0,1,2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1.5 h-1.5 bg-primary rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick tips */}
            {messages.length === 0 && (
              <div className="px-3 pb-2 flex flex-col gap-1">
                {quickTips.map((tip) => (
                  <button
                    key={tip}
                    onClick={() => sendMessage(tip)}
                    className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary/10 text-gray-600 dark:text-gray-300 hover:text-primary transition-all"
                  >
                    💡 {tip}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-2 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={isEn ? 'Ask about this step...' : 'Hỏi về bước này...'}
                className="flex-1 text-xs px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border-none outline-none focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white disabled:opacity-40 flex-shrink-0"
              >
                <MessageCircle size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AITutorPanel;
