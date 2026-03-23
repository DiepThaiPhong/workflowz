import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, Play, Lock, ChevronRight } from 'lucide-react';
import { WorkflowBlock } from '../../types';

interface StepSidebarProps {
  blocks: WorkflowBlock[];
  currentIndex: number;
  completedSteps: Set<string>;
  userInputs: Record<string, string>;
  onStepClick: (index: number) => void;
  isEn: boolean;
}

const BLOCK_ICONS: Record<string, string> = {
  instruction: '📖',
  input: '✏️',
  aiPrompt: '🤖',
  decision: '🔀',
  output: '📄',
};

const BLOCK_COLORS: Record<string, string> = {
  instruction: '#64748b',
  input: '#60a5fa',
  aiPrompt: '#a78bfa',
  decision: '#fb923c',
  output: '#34d399',
};

const StepSidebar = ({
  blocks,
  currentIndex,
  completedSteps,
  userInputs,
  onStepClick,
  isEn,
}: StepSidebarProps) => {
  const completedCount = completedSteps.size;
  const totalSteps = blocks.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const canNavigateTo = (index: number): boolean => {
    // Can always go back or to current
    if (index <= currentIndex) return true;
    // Can go to next if current is completed
    if (index === currentIndex + 1) {
      const currentBlock = blocks[currentIndex];
      if (currentBlock.type === 'input') {
        return (userInputs[currentBlock.id] || '').trim().length > 0;
      }
      if (currentBlock.type === 'decision') {
        return !!(userInputs[currentBlock.id]);
      }
      return completedSteps.has(currentBlock.id);
    }
    // Cannot skip ahead more than one step
    return false;
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0d0b] border-r border-[#1a2119]">
      {/* Header with progress */}
      <div className="p-4 border-b border-[#1a2119]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#a3c0d6] uppercase tracking-wider">
            {isEn ? 'Workflow Progress' : 'Tiến trình'}
          </span>
          <span className="text-sm font-bold text-[#92e600]">
            {completedCount}/{totalSteps}
          </span>
        </div>
        
        {/* Circular progress indicator */}
        <div className="relative w-16 h-16 mx-auto mb-3">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle
              className="text-[#1a2119]"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              r="15.5"
              cx="18"
              cy="18"
            />
            <motion.circle
              className="text-[#92e600]"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              r="15.5"
              cx="18"
              cy="18"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 100' }}
              animate={{ strokeDasharray: `${progressPercent} ${100 - progressPercent}` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Step list */}
      <div className="flex-1 overflow-y-auto py-2 px-3">
        <nav className="space-y-1">
          <AnimatePresence>
            {blocks.map((block, index) => {
              const isCompleted = completedSteps.has(block.id);
              const isCurrent = index === currentIndex;
              const isLocked = !canNavigateTo(index);
              const color = BLOCK_COLORS[block.type] || BLOCK_COLORS.instruction;
              const hasInput = block.type === 'input' && (userInputs[block.id] || '').trim().length > 0;

              return (
                <motion.button
                  key={block.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  onClick={() => canNavigateTo(index) && onStepClick(index)}
                  disabled={isLocked}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 group relative
                    ${isCurrent 
                      ? 'bg-[#92e600]/10 border border-[#92e600]/30' 
                      : isCompleted 
                        ? 'bg-[#1a2119]/50 border border-transparent hover:border-[#92e600]/20' 
                        : isLocked
                          ? 'opacity-40 cursor-not-allowed border border-transparent'
                          : 'border border-transparent hover:border-[#1a2119] hover:bg-[#0e150d]'
                    }
                  `}
                >
                  {/* Active indicator glow */}
                  {isCurrent && (
                    <motion.div
                      layoutId="activeStep"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                      style={{ background: '#92e600', boxShadow: '0 0 12px #92e600' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Step number / status icon */}
                  <div
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      transition-all duration-200
                      ${isCompleted 
                        ? 'bg-[#92e600]/20' 
                        : isCurrent 
                          ? 'bg-[#92e600]/15 ring-2 ring-[#92e600]/40' 
                          : 'bg-[#1a2119]'
                      }
                    `}
                    style={isCurrent ? { boxShadow: `0 0 16px ${color}30` } : {}}
                  >
                    {isCompleted ? (
                      <Check size={14} className="text-[#92e600]" />
                    ) : isCurrent ? (
                      <Play size={12} className="text-[#92e600]" fill="currentColor" />
                    ) : isLocked ? (
                      <Lock size={12} className="text-[#4b5563]" />
                    ) : (
                      <span className="text-xs font-bold text-[#64748b]">{index + 1}</span>
                    )}
                  </div>

                  {/* Step info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm">{BLOCK_ICONS[block.type]}</span>
                      <span 
                        className={`text-xs font-semibold truncate ${
                          isCurrent ? 'text-white' : isCompleted ? 'text-[#a3c0d6]' : 'text-[#64748b]'
                        }`}
                      >
                        {block.title}
                      </span>
                    </div>
                    {hasInput && (
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]" />
                        <span className="text-[10px] text-[#60a5fa]">
                          {isEn ? 'Input added' : 'Đã nhập'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Arrow indicator */}
                  {isCurrent && (
                    <ChevronRight size={14} className="text-[#92e600]" />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </nav>
      </div>

      {/* XP indicator */}
      <div className="p-4 border-t border-[#1a2119]">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#92e600]/5 border border-[#92e600]/20">
          <span className="text-lg">⚡</span>
          <div className="flex-1">
            <div className="text-[10px] text-[#a3c0d6] uppercase tracking-wider mb-0.5">
              {isEn ? 'XP Earned' : 'XP đã nhận'}
            </div>
            <div className="text-sm font-bold text-[#92e600]">
              +{completedCount * 15} XP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepSidebar;
