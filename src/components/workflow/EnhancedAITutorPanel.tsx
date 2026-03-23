import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Send, ChevronDown, ChevronUp, 
  MessageCircle, Wand2, BookOpen, Lightbulb,
  RotateCcw
} from 'lucide-react';
import { ChatMessage, WorkflowBlock } from '../../types';
import { askTutor } from '../../services/geminiService';

interface EnhancedAITutorPanelProps {
  workflowTitle?: string;
  currentBlock?: WorkflowBlock;
  userInputs?: Record<string, string>;
  className?: string;
  isEn: boolean;
}

const CONTEXTUAL_ACTIONS: Record<string, { en: string; vi: string; icon: typeof Lightbulb }[]> = {
  instruction: [
    { en: 'Explain this', vi: 'Giải thích', icon: BookOpen },
    { en: 'Why important?', vi: 'Tại sao quan trọng?', icon: Lightbulb },
  ],
  input: [
    { en: 'Help me start', vi: 'Giúp mình bắt đầu', icon: Wand2 },
    { en: 'Show example', vi: 'Xem ví dụ', icon: BookOpen },
    { en: 'Improve my input', vi: 'Cải thiện input', icon: Sparkles },
  ],
  aiPrompt: [
    { en: 'Explain result', vi: 'Giải thích kết quả', icon: BookOpen },
    { en: 'Make it better', vi: 'Cải thiện hơn', icon: Wand2 },
  ],
  decision: [
    { en: 'Compare options', vi: 'So sánh lựa chọn', icon: Lightbulb },
    { en: 'Recommend best', vi: 'Đề xuất tốt nhất', icon: Sparkles },
  ],
  output: [
    { en: 'Explain output', vi: 'Giải thích kết quả', icon: BookOpen },
    { en: 'How to use this?', vi: 'Sử dụng thế nào?', icon: Lightbulb },
  ],
};

const DEFAULT_ACTIONS = [
  { en: 'Explain this step', vi: 'Giải thích bước này', icon: BookOpen },
  { en: 'Give me an example', vi: 'Cho tôi ví dụ', icon: Lightbulb },
  { en: 'Tips to improve', vi: 'Mẹo cải thiện', icon: Sparkles },
];

const EnhancedAITutorPanel = ({
  workflowTitle,
  currentBlock,
  userInputs = {},
  className = '',
  isEn,
}: EnhancedAITutorPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get contextual actions based on current block type
  const contextualActions = currentBlock 
    ? CONTEXTUAL_ACTIONS[currentBlock.type] || DEFAULT_ACTIONS
    : DEFAULT_ACTIONS;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildContext = (query: string) => {
    const parts: string[] = [];
    if (workflowTitle) parts.push(`[Workflow: "${workflowTitle}"]`);
    if (currentBlock) {
      parts.push(`[Step: "${currentBlock.title}" - Type: ${currentBlock.type}]`);
      parts.push(`[Content: "${currentBlock.content}"]`);
    }
    const relevantInputs = Object.entries(userInputs)
      .filter(([_, v]) => v.trim())
      .map(([k, v]) => `${k}: "${v}"`)
      .join(', ');
    if (relevantInputs) parts.push(`[User inputs: ${relevantInputs}]`);
    parts.push(query);
    return parts.join('\n');
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
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const contextualQuery = buildContext(content);
      const { text: reply } = await askTutor(contextualQuery, messages);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: reply,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: isEn 
            ? 'Sorry, I encountered an issue. Please try again!' 
            : 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại!',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-[#1a2119] cursor-pointer hover:bg-[#0e150d]/50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-[#92e600]/15 flex items-center justify-center">
              <Sparkles size={14} className="text-[#92e600]" />
            </div>
            {/* Pulse indicator when active */}
            {!isCollapsed && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-lg bg-[#92e600]/20"
              />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {isEn ? 'AI Assistant' : 'Trợ lý AI'}
            </h3>
            {workflowTitle && (
              <p className="text-[10px] text-[#64748b] truncate max-w-[140px]">
                {workflowTitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearChat();
              }}
              className="p-1.5 rounded-lg hover:bg-[#1a2119] text-[#64748b] hover:text-white transition-colors"
            >
              <RotateCcw size={12} />
            </button>
          )}
          {isCollapsed ? (
            <ChevronDown size={14} className="text-[#64748b]" />
          ) : (
            <ChevronUp size={14} className="text-[#64748b]" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              {messages.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#1a2119] flex items-center justify-center mx-auto mb-3">
                    <MessageCircle size={20} className="text-[#64748b]" />
                  </div>
                  <p className="text-xs text-[#64748b] mb-1">
                    {isEn ? 'Need help with this step?' : 'Cần giúp đỡ với bước này?'}
                  </p>
                  <p className="text-[10px] text-[#3a4a42]">
                    {isEn ? 'Ask anything or use quick actions below' : 'Hỏi bất cứ điều gì hoặc dùng hành động nhanh'}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#92e600] text-[#0b0f0c] font-medium rounded-br-sm'
                          : 'bg-[#1a2119] text-gray-200 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1a2119]">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1.5 h-1.5 rounded-full bg-[#92e600]"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div className="px-3 pb-2 pt-1 border-t border-[#1a2119]/50">
              <p className="text-[10px] text-[#3a4a42] uppercase tracking-wider mb-2">
                {isEn ? 'Quick Actions' : 'Hành động nhanh'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {contextualActions.slice(0, 3).map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.en}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => sendMessage(isEn ? action.en : action.vi)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px]
                        bg-[#0e150d] border border-[#1a2119] text-[#a3c0d6]
                        hover:border-[#92e600]/30 hover:text-[#92e600] transition-all
                        disabled:opacity-40"
                    >
                      <Icon size={11} />
                      {isEn ? action.en : action.vi}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Input area */}
            <div className="p-3 border-t border-[#1a2119]">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={isEn ? 'Ask anything...' : 'Hỏi bất cứ điều gì...'}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#0b0f0c] border border-[#1a2119]
                    text-xs text-white placeholder:text-[#3a4a42]
                    focus:outline-none focus:border-[#92e600]/40 transition-colors"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 rounded-lg bg-[#92e600] flex items-center justify-center
                    text-[#0b0f0c] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  <Send size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedAITutorPanel;
