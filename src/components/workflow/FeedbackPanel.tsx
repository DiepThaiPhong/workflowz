import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Download, RefreshCw, Sparkles } from 'lucide-react';
import { useState } from 'react';

type FeedbackState = 'empty' | 'loading' | 'completed' | 'error';

interface FeedbackPanelProps {
  content: string;
  state: FeedbackState;
  isEn: boolean;
  onRetry?: () => void;
}

const FeedbackPanel = ({ content, state, isEn, onRetry }: FeedbackPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Empty state
  if (state === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#1a2119] flex items-center justify-center mb-3">
          <Sparkles size={20} className="text-[#92e600]/40" />
        </div>
        <p className="text-sm text-[#64748b]">
          {isEn 
            ? 'AI will generate a response when you click "Next"' 
            : 'AI sẽ tạo phản hồi khi bạn nhấn "Tiếp theo"'
          }
        </p>
      </div>
    );
  }

  // Loading state
  if (state === 'loading') {
    return (
      <div className="py-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#92e600]/10 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={18} className="text-[#92e600]" />
            </motion.div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {isEn ? 'AI is thinking...' : 'AI đang suy nghĩ...'}
            </p>
            <p className="text-xs text-[#64748b]">
              {isEn ? 'Crafting your response' : 'Đang tạo phản hồi'}
            </p>
          </div>
        </div>

        {/* Animated skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-[#1a2119] rounded-lg w-full animate-pulse" />
          <div className="h-4 bg-[#1a2119] rounded-lg w-4/5 animate-pulse" style={{ animationDelay: '100ms' }} />
          <div className="h-4 bg-[#1a2119] rounded-lg w-3/5 animate-pulse" style={{ animationDelay: '200ms' }} />
        </div>

        {/* Typing dots */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#1a2119]">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [-4, 4, -4], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                className="w-2 h-2 rounded-full bg-[#92e600]"
              />
            ))}
          </div>
          <span className="text-xs text-[#64748b]">
            {isEn ? 'Processing your request...' : 'Đang xử lý yêu cầu...'}
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (state === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-4"
      >
        <div className="px-4 py-3 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20">
          <p className="text-sm text-[#f87171] mb-3">
            {isEn 
              ? 'Something went wrong. Please try again.' 
              : 'Đã xảy ra lỗi. Vui lòng thử lại.'
            }
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ef4444]/20 text-[#f87171] text-xs font-semibold hover:bg-[#ef4444]/30 transition-colors"
            >
              <RefreshCw size={12} />
              {isEn ? 'Retry' : 'Thử lại'}
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // Completed state
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* AI response header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#92e600]/20 flex items-center justify-center">
            <Sparkles size={14} className="text-[#92e600]" />
          </div>
          <span className="text-xs font-semibold text-[#92e600]">
            {isEn ? 'AI Response' : 'Phản hồi AI'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-[#1a2119] text-[#a3c0d6] hover:text-[#92e600] hover:bg-[#92e600]/10 transition-colors"
          >
            {copied ? <Check size={12} className="text-[#92e600]" /> : <Copy size={12} />}
            {copied ? (isEn ? 'Copied' : 'Đã sao chép') : (isEn ? 'Copy' : 'Sao chép')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-[#1a2119] text-[#a3c0d6] hover:text-[#92e600] hover:bg-[#92e600]/10 transition-colors"
          >
            <Download size={12} />
            {isEn ? 'Save' : 'Lưu'}
          </motion.button>
        </div>
      </div>

      {/* Response content */}
      <div className="relative">
        <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-[#92e600]/50 via-[#92e600]/30 to-transparent rounded-full" />
        <div className="bg-[#0b0f0c] rounded-xl p-4 border border-[#1a2119] max-h-[320px] overflow-y-auto">
          <pre className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed font-sans">
            {content}
          </pre>
        </div>
      </div>

      {/* Success indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 text-xs text-[#92e600]"
      >
        <div className="w-4 h-4 rounded-full bg-[#92e600]/20 flex items-center justify-center">
          <Check size={10} className="text-[#92e600]" />
        </div>
        {isEn ? 'Response generated successfully' : 'Phản hồi đã được tạo thành công'}
      </motion.div>
    </motion.div>
  );
};

export default FeedbackPanel;
