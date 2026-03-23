import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { WorkflowBlock } from '../../types';

interface InputBlockProps {
  block: WorkflowBlock;
  value: string;
  onChange: (value: string) => void;
  isEn: boolean;
  onValidChange?: (isValid: boolean) => void;
}

const InputBlock = ({ block, value, onChange, isEn, onValidChange }: InputBlockProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isInputBlock = block.type === 'input';
  const isDecisionBlock = block.type === 'decision';
  const hasValue = value.trim().length > 0;
  const isValid = hasValue;
  const charCount = value.length;
  const minChars = 10;

  // Notify parent of validity
  if (onValidChange) {
    onValidChange(isValid);
  }

  if (isDecisionBlock && block.options) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-[#e9eff5] leading-relaxed">{block.content}</p>
        
        <div className="space-y-2">
          {block.options.map((option, idx) => {
            const isSelected = value === option;
            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => onChange(option)}
                className={`
                  w-full px-4 py-3 rounded-xl border-2 text-left
                  transition-all duration-200 flex items-center gap-3
                  ${isSelected 
                    ? 'border-[#92e600] bg-[#92e600]/10 text-white' 
                    : 'border-[#1a2119] bg-[#0e150d] text-[#e9eff5] hover:border-[#92e600]/40 hover:bg-[#92e600]/5'
                  }
                `}
              >
                {/* Selection indicator */}
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    transition-all duration-200 flex-shrink-0
                    ${isSelected 
                      ? 'border-[#92e600] bg-[#92e600]' 
                      : 'border-[#3a4a42]'
                    }
                  `}
                >
                  {isSelected && <Check size={12} className="text-[#0b0f0c]" />}
                </div>
                
                <span className="font-medium text-sm">{option}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Instruction text */}
      <p className="text-sm text-[#e9eff5] leading-relaxed">{block.content}</p>

      {/* Hint toggle */}
      {block.placeholder && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#92e600] transition-colors"
        >
          {showHint ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {isEn ? 'Show hint' : 'Xem gợi ý'}
        </button>
      )}

      <AnimatePresence>
        {showHint && block.placeholder && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-2 rounded-lg bg-[#1a2119]/50 border border-[#1a2119] text-xs text-[#a3c0d6] italic">
              💡 {block.placeholder}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text input area */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={block.placeholder || (isEn ? 'Type your response...' : 'Nhập câu trả lời của bạn...')}
          rows={5}
          className={`
            w-full rounded-xl px-4 py-3 text-sm text-white
            bg-[#0b0f0c] border-2 outline-none
            resize-none transition-all duration-200
            placeholder:text-[#3a4a42]
            ${isFocused 
              ? 'border-[#92e600] ring-4 ring-[#92e600]/10' 
              : hasValue 
                ? 'border-[#92e600]/40' 
                : 'border-[#1a2119] hover:border-[#2a3a32]'
            }
          `}
        />

        {/* Character count & status */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {charCount > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-[10px] font-medium ${
                charCount < minChars ? 'text-[#f59e0b]' : 'text-[#64748b]'
              }`}
            >
              {charCount} {isEn ? 'chars' : 'ký tự'}
            </motion.span>
          )}
        </div>
      </div>

      {/* Validation feedback */}
      <AnimatePresence>
        {hasValue && charCount < minChars && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20"
          >
            <AlertCircle size={14} className="text-[#f59e0b]" />
            <span className="text-xs text-[#fbbf24]">
              {isEn 
                ? `Add ${minChars - charCount} more characters for better AI results` 
                : `Thêm ${minChars - charCount} ký tự nữa để AI trả lời tốt hơn`
              }
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success indicator */}
      <AnimatePresence>
        {isValid && charCount >= minChars && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2"
          >
            <div className="w-5 h-5 rounded-full bg-[#92e600]/20 flex items-center justify-center">
              <Check size={12} className="text-[#92e600]" />
            </div>
            <span className="text-xs text-[#92e600] font-medium">
              {isEn ? 'Ready to continue' : 'Sẵn sàng tiếp tục'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputBlock;
