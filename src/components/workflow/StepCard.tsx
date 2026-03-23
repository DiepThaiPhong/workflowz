import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, PenLine, Bot, GitBranch, FileOutput, 
  ChevronRight, Check, AlertCircle, Loader2 
} from 'lucide-react';
import { WorkflowBlock } from '../../types';
import InputBlock from './InputBlock';
import FeedbackPanel from './FeedbackPanel';

type BlockPhase = 'objective' | 'action' | 'result';
type FeedbackState = 'empty' | 'loading' | 'completed' | 'error';

interface StepCardProps {
  block: WorkflowBlock;
  blockIndex: number;
  totalBlocks: number;
  userInput: string;
  aiResponse: string;
  feedbackState: FeedbackState;
  isCompleted: boolean;
  canProceed: boolean;
  isEn: boolean;
  onInputChange: (value: string) => void;
  onGenerate: () => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  isGenerating: boolean;
  hideNavButtons?: boolean;
}

const BLOCK_CONFIG: Record<string, {
  icon: typeof BookOpen;
  enLabel: string;
  viLabel: string;
  color: string;
  bgGradient: string;
}> = {
  instruction: {
    icon: BookOpen,
    enLabel: 'INSTRUCTION',
    viLabel: 'HƯỚNG DẪN',
    color: '#64748b',
    bgGradient: 'from-[#64748b]/10 to-transparent',
  },
  input: {
    icon: PenLine,
    enLabel: 'YOUR INPUT',
    viLabel: 'NHẬP CỦA BẠN',
    color: '#60a5fa',
    bgGradient: 'from-[#60a5fa]/10 to-transparent',
  },
  aiPrompt: {
    icon: Bot,
    enLabel: 'AI GENERATE',
    viLabel: 'AI TẠO',
    color: '#a78bfa',
    bgGradient: 'from-[#a78bfa]/10 to-transparent',
  },
  decision: {
    icon: GitBranch,
    enLabel: 'DECISION',
    viLabel: 'LỰA CHỌN',
    color: '#fb923c',
    bgGradient: 'from-[#fb923c]/10 to-transparent',
  },
  output: {
    icon: FileOutput,
    enLabel: 'OUTPUT',
    viLabel: 'KẾT QUẢ',
    color: '#34d399',
    bgGradient: 'from-[#34d399]/10 to-transparent',
  },
};

const StepCard = ({
  block,
  blockIndex,
  totalBlocks,
  userInput,
  aiResponse,
  feedbackState,
  isCompleted,
  canProceed,
  isEn,
  onInputChange,
  onGenerate,
  onNext,
  onBack,
  isFirst,
  isLast,
  isGenerating,
}: StepCardProps) => {
  const config = BLOCK_CONFIG[block.type] || BLOCK_CONFIG.instruction;
  const Icon = config.icon;

  const getPrimaryAction = () => {
    if (block.type === 'aiPrompt' && feedbackState === 'empty') {
      return {
        label: isEn ? 'Generate with AI' : 'Tạo với AI',
        icon: Bot,
        onClick: onGenerate,
        disabled: isGenerating,
      };
    }
    if (block.type === 'aiPrompt' && feedbackState === 'loading') {
      return {
        label: isEn ? 'Generating...' : 'Đang tạo...',
        icon: Loader2,
        onClick: () => {},
        disabled: true,
      };
    }
    if (isLast) {
      return {
        label: isEn ? 'Complete Workflow' : 'Hoàn thành',
        icon: Check,
        onClick: onNext,
        disabled: !canProceed || isGenerating,
      };
    }
    return {
      label: isEn ? 'Next Step' : 'Bước tiếp theo',
      icon: ChevronRight,
      onClick: onNext,
      disabled: !canProceed || isGenerating,
    };
  };

  const primaryAction = getPrimaryAction();
  const PrimaryIcon = primaryAction.icon;

  return (
    <motion.div
      key={block.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Step header with breadcrumb and phase indicators */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#64748b] font-medium">
            {isEn ? `Step ${blockIndex + 1} of ${totalBlocks}` : `Bước ${blockIndex + 1}/${totalBlocks}`}
          </span>
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#92e600]/20 text-[#92e600] text-xs font-medium"
            >
              <Check size={10} />
              {isEn ? 'Completed' : 'Hoàn thành'}
            </motion.div>
          )}
        </div>
      </div>

      {/* Main card with gradient accent */}
      <div 
        className={`
          relative overflow-hidden rounded-2xl border bg-[#0e150d]
          transition-all duration-300
          ${canProceed ? 'border-[#92e600]/20' : 'border-[#1a2119]'}
        `}
        style={{
          boxShadow: canProceed 
            ? `0 0 40px ${config.color}10, 0 4px 24px rgba(0,0,0,0.3)` 
            : '0 4px 24px rgba(0,0,0,0.2)',
        }}
      >
        {/* Gradient accent at top */}
        <div 
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${config.bgGradient}`}
          style={{ 
            background: `linear-gradient(90deg, ${config.color}40 0%, transparent 100%)` 
          }}
        />

        {/* Card header - Block type badge */}
        <div className="px-6 py-4 border-b border-[#1a2119]/50">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${config.color}15` }}
            >
              <Icon size={18} style={{ color: config.color }} />
            </div>
            <div>
              <div 
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-widest"
                style={{ 
                  background: `${config.color}15`, 
                  color: config.color,
                  border: `1px solid ${config.color}30`,
                }}
              >
                {isEn ? config.enLabel : config.viLabel}
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{block.title}</h2>
            </div>
          </div>
        </div>

        {/* Card body - Content based on block type */}
        <div className="p-6 space-y-4">
          {/* Instruction block */}
          {block.type === 'instruction' && (
            <div className="bg-[#0b0f0c] rounded-xl p-5 border border-[#1a2119]">
              <p className="text-gray-200 leading-relaxed">{block.content}</p>
            </div>
          )}

          {/* Input block */}
          {(block.type === 'input' || block.type === 'decision') && (
            <InputBlock
              block={block}
              value={userInput}
              onChange={onInputChange}
              isEn={isEn}
            />
          )}

          {/* AI Prompt block */}
          {block.type === 'aiPrompt' && (
            <div className="space-y-4">
              <p className="text-sm text-[#e9eff5]">{block.content}</p>
              <FeedbackPanel
                content={aiResponse}
                state={feedbackState}
                isEn={isEn}
                onRetry={onGenerate}
              />
            </div>
          )}

          {/* Output block */}
          {block.type === 'output' && (
            <div className="space-y-4">
              <p className="text-sm text-[#e9eff5]">{block.content}</p>
              <FeedbackPanel
                content={aiResponse || (isEn ? 'Output will appear here...' : 'Kết quả sẽ xuất hiện ở đây...')}
                state={aiResponse ? 'completed' : 'empty'}
                isEn={isEn}
              />
            </div>
          )}
        </div>

        {/* Validation warning */}
        <AnimatePresence>
          {!canProceed && (block.type === 'input' || block.type === 'decision') && !isCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 pb-4"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20">
                <AlertCircle size={14} className="text-[#f59e0b]" />
                <span className="text-xs text-[#fbbf24]">
                  {block.type === 'decision'
                    ? (isEn ? 'Please select an option to continue' : 'Vui lòng chọn một tùy chọn để tiếp tục')
                    : (isEn ? 'Please provide input to continue' : 'Vui lòng nhập thông tin để tiếp tục')
                  }
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {/* Back button */}
        <motion.button
          whileHover={!isFirst ? { scale: 1.02 } : {}}
          whileTap={!isFirst ? { scale: 0.98 } : {}}
          onClick={onBack}
          disabled={isFirst || isGenerating}
          className={`
            flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
            transition-all duration-200
            ${isFirst || isGenerating
              ? 'opacity-30 cursor-not-allowed bg-[#1a2119] text-[#64748b] border border-[#1a2119]'
              : 'bg-[#0e150d] text-[#e9eff5] border border-[#1a2119] hover:border-[#92e600]/30 hover:bg-[#0e150d]'
            }
          `}
        >
          {isEn ? 'Back' : 'Quay lại'}
        </motion.button>

        {/* Primary action button */}
        <motion.button
          whileHover={canProceed && !isGenerating ? { scale: 1.02 } : {}}
          whileTap={canProceed && !isGenerating ? { scale: 0.98 } : {}}
          onClick={primaryAction.onClick}
          disabled={primaryAction.disabled}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base
            transition-all duration-200
            ${canProceed && !isGenerating
              ? 'text-[#0b0f0c] shadow-lg'
              : 'bg-[#1a2119] text-[#4b5563] cursor-not-allowed'
            }
          `}
          style={canProceed && !isGenerating ? {
            background: 'linear-gradient(135deg, #92e600 0%, #7ed321 100%)',
            boxShadow: '0 4px 24px rgba(146, 230, 0, 0.4), 0 0 0 1px rgba(146, 230, 0, 0.2)',
          } : {}}
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={18} />
              </motion.div>
              {isEn ? 'Generating...' : 'Đang tạo...'}
            </>
          ) : (
            <>
              <PrimaryIcon size={18} />
              {primaryAction.label}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StepCard;
