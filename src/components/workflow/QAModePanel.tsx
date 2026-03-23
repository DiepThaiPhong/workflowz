import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Sparkles, RotateCcw, MessageCircle,
  FileText, ArrowRight, CheckCircle2
} from 'lucide-react';
import { WorkflowBlock, ChatMessage } from '../../types';
import { askTutor } from '../../services/geminiService';

interface QAModePanelProps {
  workflowTitle: string;
  workflowDescription: string;
  blocks: WorkflowBlock[];
  completedSteps: Set<string>;
  userInputs: Record<string, string>;
  aiResponses: Record<string, string>;
  isEn: boolean;
  onSwitchToWorkflow: () => void;
}

const BLOCK_TYPE_LABELS: Record<string, { en: string; vi: string }> = {
  instruction: { en: 'Instruction', vi: 'Hướng dẫn' },
  input: { en: 'Your Input', vi: 'Nhập của bạn' },
  aiPrompt: { en: 'AI Generate', vi: 'AI tạo' },
  decision: { en: 'Decision', vi: 'Lựa chọn' },
  output: { en: 'Output', vi: 'Kết quả' },
};

export default function QAModePanel({
  workflowTitle,
  workflowDescription,
  blocks,
  completedSteps,
  userInputs,
  aiResponses,
  isEn,
  onSwitchToWorkflow,
}: QAModePanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Generate a comprehensive system context for the AI
  const buildSystemContext = () => {
    const parts: string[] = [];

    parts.push(`[WORKFLOW: "${workflowTitle}"]`);
    parts.push(`[DESCRIPTION: "${workflowDescription}"]`);
    parts.push(`[TOTAL STEPS: ${blocks.length}]`);

    blocks.forEach((block, idx) => {
      const completed = completedSteps.has(block.id);
      const label = BLOCK_TYPE_LABELS[block.type] || { en: block.type, vi: block.type };
      const status = completed ? '(completed)' : '(pending)';

      parts.push(
        `[Step ${idx + 1} ${status} - ${isEn ? label.en : label.vi}: "${block.title}"]`
      );
      if (block.type === 'instruction') {
        parts.push(`  Content: "${block.content}"`);
      }
      if (userInputs[block.id]) {
        parts.push(`  User input: "${userInputs[block.id]}"`);
      }
      if (aiResponses[block.id]) {
        parts.push(`  AI result: "${aiResponses[block.id].slice(0, 200)}..."`);
      }
    });

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
      const systemContext = buildSystemContext();
      const fullQuery = `${systemContext}\n\n[USER QUESTION]: ${content}`;
      const { text: reply } = await askTutor(fullQuery, messages);
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

  const suggestedQuestions = isEn
    ? [
        `What is this workflow about?`,
        `Help me understand step 1`,
        `I'm stuck, can you guide me?`,
        `What should I prepare?`,
        `Explain the overall process`,
      ]
    : [
        `Workflow này về gì?`,
        `Giúp mình hiểu bước 1`,
        `Mình đang bị kẹt, hãy hướng dẫn`,
        `Mình cần chuẩn bị gì?`,
        `Giải thích tổng quan quy trình`,
      ];

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-300px)]">
      {/* Q&A Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#92e600]/15 flex items-center justify-center">
            <MessageCircle size={20} className="text-[#92e600]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEn ? 'Ask & Learn' : 'Hỏi & Đáp'}
            </h2>
            <p className="text-xs text-[#64748b]">
              {isEn
                ? `${blocks.length} steps · ${completedSteps.size} completed`
                : `${blocks.length} bước · ${completedSteps.size} đã xong`}
            </p>
          </div>
        </div>
        <button
          onClick={onSwitchToWorkflow}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
            bg-[#92e600] text-[#0b0f0c] hover:bg-[#7ed321] transition-colors"
        >
          <ArrowRight size={12} />
          {isEn ? 'Workflow' : 'Workflow'}
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0 pr-1">
        {messages.length === 0 ? (
          /* Welcome state */
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 rounded-2xl bg-[#92e600]/10 border border-[#92e600]/20
                flex items-center justify-center mx-auto mb-4"
            >
              <Sparkles size={28} className="text-[#92e600]" />
            </motion.div>
            <h3 className="text-base font-bold text-white mb-1">
              {isEn ? 'Hi there!' : 'Xin chào!'}
            </h3>
            <p className="text-sm text-[#a3c0d6] max-w-sm mx-auto mb-2">
              {isEn
                ? `I can help you with the "${workflowTitle}" workflow. Ask me anything!`
                : `Mình có thể giúp bạn với workflow "${workflowTitle}". Hỏi bất cứ điều gì!`}
            </p>

            {/* Step overview */}
            <div className="mt-4 p-3 rounded-xl bg-[#0e150d] border border-[#1a2119] max-w-md mx-auto text-left">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-[#64748b]" />
                <span className="text-xs font-semibold text-[#a3c0d6]">
                  {isEn ? 'Workflow Steps' : 'Các bước workflow'}
                </span>
              </div>
              <div className="space-y-1.5">
                {blocks.map((block, idx) => {
                  const done = completedSteps.has(block.id);
                  return (
                    <div key={block.id} className="flex items-center gap-2">
                      <CheckCircle2
                        size={12}
                        className={done ? 'text-[#92e600]' : 'text-[#3a4a42]'}
                      />
                      <span
                        className={`text-xs ${done ? 'text-[#92e600]' : 'text-[#64748b]'}`}
                      >
                        {isEn ? block.title : block.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suggested questions */}
            <div className="mt-4">
              <p className="text-[10px] text-[#3a4a42] uppercase tracking-wider mb-2">
                {isEn ? 'Try asking' : 'Thử hỏi'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                {suggestedQuestions.map((q) => (
                  <motion.button
                    key={q}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessage(q)}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-lg text-xs
                      bg-[#0e150d] border border-[#1a2119] text-[#a3c0d6]
                      hover:border-[#92e600]/30 hover:text-[#92e600] transition-all
                      disabled:opacity-40"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Chat messages */
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#92e600] text-[#0b0f0c] font-medium rounded-2xl rounded-br-md'
                      : 'bg-[#1a2119] text-gray-200 rounded-2xl rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md bg-[#1a2119]">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                  className="w-2 h-2 rounded-full bg-[#92e600]"
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="mt-4 flex items-center gap-2">
        {messages.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            className="p-2.5 rounded-xl bg-[#0e150d] border border-[#1a2119] text-[#64748b]
              hover:text-white hover:border-[#92e600]/30 transition-all flex-shrink-0"
            title={isEn ? 'Clear chat' : 'Xoá chat'}
          >
            <RotateCcw size={16} />
          </motion.button>
        )}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={isEn ? 'Ask anything about this workflow...' : 'Hỏi bất cứ điều gì về workflow...'}
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#0b0f0c] border border-[#1a2119]
            text-sm text-white placeholder:text-[#3a4a42]
            focus:outline-none focus:border-[#92e600]/40 transition-colors"
          disabled={isLoading}
        />
        <motion.button
          whileHover={input.trim() && !isLoading ? { scale: 1.05 } : {}}
          whileTap={input.trim() && !isLoading ? { scale: 0.95 } : {}}
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-[#92e600] text-[#0b0f0c]
            disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
        >
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  );
}
