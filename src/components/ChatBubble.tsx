import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

interface ChatBubbleProps {
  role: 'ai' | 'user';
  content: string;
  confidence?: number;
  timestamp?: string;
  isTyping?: boolean;
}

// Typing indicator dots animation
const TypingDots = () => (
  <div className="flex gap-1 items-center px-2 py-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 rounded-full bg-primary-400"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
      />
    ))}
  </div>
);

const ChatBubble = ({ role, content, confidence, timestamp, isTyping }: ChatBubbleProps) => {
  const isAI = role === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, x: isAI ? -20 : 20, y: 5 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`flex gap-2 ${isAI ? 'justify-start' : 'justify-end'} mb-3`}
    >
      {/* AI Avatar */}
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div className={`flex flex-col gap-1 ${isAI ? 'items-start' : 'items-end'} max-w-[80%]`}>
        {/* Bubble */}
        <div className={isAI ? 'chat-bubble-ai' : 'chat-bubble-user'}>
          {isTyping ? (
            <TypingDots />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 px-1">
          {timestamp && (
            <span className="text-[11px] text-gray-400 dark:text-gray-500">{timestamp}</span>
          )}
          {isAI && confidence !== undefined && !isTyping && (
            <span className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
              ✦ Powered by Gemini · Độ tự tin: {confidence}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
