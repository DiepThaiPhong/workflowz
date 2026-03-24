import { useState, useCallback, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Star, Clock, Users, TrendingUp,
  Tag, Menu, X, ChevronRight, ChevronUp, MessageCircle,
  ChevronDown, Check, Play, Loader2
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { ALL_WORKFLOWS } from '../data/workflowData';
import { askTutor } from '../services/geminiService';
import type { InteractionMode, WorkflowBlock } from '../types';

// Import new components
import StepSidebar from '../components/workflow/StepSidebar';
import StepCard from '../components/workflow/StepCard';
import EnhancedAITutorPanel from '../components/workflow/EnhancedAITutorPanel';
import CompletionCelebration from '../components/workflow/CompletionCelebration';

// Block icons and colors for mobile progress
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

type FeedbackState = 'empty' | 'loading' | 'completed' | 'error';

export default function WorkflowRunnerPage() {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const navigate = useNavigate();

  const workflow = ALL_WORKFLOWS.find(w => w.id === id);

  // Runner state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('empty');
  const [error, setError] = useState<string | null>(null);
  const [outputArtifact, setOutputArtifact] = useState('');
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileAITutorOpen, setMobileAITutorOpen] = useState(false);

  // Can navigate to step helper — defined after 'blocks' (line 103) to avoid hoisting error
  // Intentionally stubbed here; real impl below after workflow guard
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const canNavigateTo = (_index: number): boolean => false;

  // Calculate XP
  const xpEarned = completedSteps.size * 15 + (isCompleted ? 50 : 0);

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20 gap-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-xl font-bold text-white">
          {isEn ? 'Workflow not found' : 'Workflow không tồn tại'}
        </h1>
        <Link 
          to="/marketplace" 
          className="px-4 py-2 rounded-lg font-semibold text-sm"
          style={{ background: '#92e600', color: '#0b0f0c' }}
        >
          ← {isEn ? 'Back to Marketplace' : 'Quay lại Marketplace'}
        </Link>
      </div>
    );
  }

  const title = isEn && workflow.titleEn ? workflow.titleEn : workflow.title;
  const desc = isEn && workflow.descriptionEn ? workflow.descriptionEn : workflow.description;
  const blocks = workflow.blocks;
  const block = blocks[currentIdx];
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === blocks.length - 1;

  // canNavigateTo — defined here so 'blocks' is in scope
  const canNavigateToBlock = useCallback((index: number): boolean => {
    if (index <= currentIdx) return true;
    if (index === currentIdx + 1) {
      const currentBlock = blocks[currentIdx];
      if (currentBlock.type === 'input') {
        return (userInputs[currentBlock.id] || '').trim().length > 0;
      }
      if (currentBlock.type === 'decision') {
        return !!(userInputs[currentBlock.id]);
      }
      return completedSteps.has(currentBlock.id);
    }
    return false;
  }, [currentIdx, blocks, userInputs, completedSteps]);

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  void canNavigateTo; void canNavigateToBlock;

  // Resolve template variables
  const resolveTemplate = (tmpl: string) => {
    let r = tmpl;
    Object.entries(userInputs).forEach(([k, v]) => {
      r = r.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
    });
    Object.entries(aiResponses).forEach(([k, v]) => {
      r = r.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
    });
    return r;
  };

  // Check if current step can proceed
  const canProceed = useCallback(() => {
    if (!block) return false;
    if (block.type === 'input') return (userInputs[block.id] || '').trim().length > 0;
    if (block.type === 'decision') return !!(userInputs[block.id]);
    if (block.type === 'aiPrompt') return feedbackState === 'completed';
    return true;
  }, [block, userInputs, feedbackState]);

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    if (!block) return;
    setUserInputs(prev => ({ ...prev, [block.id]: value }));
  }, [block]);

  // Handle AI generation
  const handleGenerate = async () => {
    if (!block || isGenerating) return;
    
    setIsGenerating(true);
    setFeedbackState('loading');
    setError(null);

    try {
      const resolvedPrompt = resolveTemplate(block.content);
      const { text } = await askTutor(resolvedPrompt, []);
      setAiResponses(prev => ({ ...prev, [block.id]: text }));
      setFeedbackState('completed');
      setCompletedSteps(prev => new Set([...prev, block.id]));
      
      if (isLast || blocks[currentIdx + 1]?.type === 'output') {
        setOutputArtifact(text);
      }
    } catch (err) {
      setFeedbackState('error');
      setError(isEn ? 'Failed to generate. Please try again.' : 'Tạo thất bại. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle next step
  const handleNext = async () => {
    if (!block || !canProceed()) return;

    // If AI block not generated yet, generate first
    if (block.type === 'aiPrompt' && feedbackState === 'empty') {
      await handleGenerate();
      return;
    }

    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, block.id]));

    if (isLast) {
      // Complete workflow
      const artifact = block.type === 'output'
        ? (aiResponses[blocks[currentIdx - 1]?.id] || outputArtifact || (isEn ? 'Workflow complete!' : 'Workflow hoàn thành!'))
        : outputArtifact;
      setOutputArtifact(artifact);
      setIsCompleted(true);
    } else {
      // Move to next step
      setCurrentIdx(p => p + 1);
      setFeedbackState(aiResponses[blocks[currentIdx + 1]?.id] ? 'completed' : 'empty');
    }
  };

  // Handle back
  const handleBack = () => {
    if (!isFirst) {
      setCurrentIdx(p => p - 1);
      const prevBlock = blocks[currentIdx - 1];
      if (prevBlock?.type === 'aiPrompt') {
        setFeedbackState(aiResponses[prevBlock.id] ? 'completed' : 'empty');
      } else {
        setFeedbackState('empty');
      }
    }
  };

  // Handle step click from sidebar
  const handleStepClick = (index: number) => {
    setCurrentIdx(index);
    const targetBlock = blocks[index];
    if (targetBlock?.type === 'aiPrompt') {
      setFeedbackState(aiResponses[targetBlock.id] ? 'completed' : 'empty');
    } else {
      setFeedbackState('empty');
    }
    setMobileSidebarOpen(false);
  };

  // Reset workflow
  const handleRestart = () => {
    setCurrentIdx(0);
    setUserInputs({});
    setAiResponses({});
    setCompletedSteps(new Set());
    setIsCompleted(false);
    setFeedbackState('empty');
    setError(null);
    setOutputArtifact('');
  };

  // Update feedback state when block changes
  useEffect(() => {
    if (block?.type === 'aiPrompt') {
      if (aiResponses[block.id]) {
        setFeedbackState('completed');
      } else {
        setFeedbackState('empty');
      }
    } else {
      setFeedbackState('empty');
    }
  }, [block?.id, block?.type, aiResponses]);

  // Completion screen
  if (isCompleted) {
    return (
      <CompletionCelebration
        workflowTitle={title}
        outputArtifact={outputArtifact}
        xpEarned={xpEarned}
        isEn={isEn}
        onRestart={handleRestart}
        onExit={() => navigate('/marketplace')}
      />
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0b0f0c] flex flex-col">
        {/* Top header bar - scrolls naturally with page */}
        <header className="bg-[#0e150d] border-b border-[#1a2119] px-4 sm:px-6 py-3">
          <div className="container-max">
            {/* Breadcrumb */}
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1 text-xs text-[#a3c0d6] hover:text-gray-300 mb-2 transition-colors"
            >
              <ArrowLeft size={12} />
              {isEn ? 'Back to Marketplace' : 'Quay lại Marketplace'}
            </Link>

            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-black text-white truncate">{title}</h1>
                <p className="text-xs text-[#a3c0d6] truncate">{desc}</p>
              </div>

              {/* Meta badges */}
              <div className="hidden sm:flex items-center gap-3 text-xs flex-shrink-0">
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star size={12} fill="currentColor" /> {workflow.rating}
                </span>
                <span className="flex items-center gap-1 text-[#a3c0d6]">
                  <Clock size={12} /> {workflow.estimatedMinutes}{isEn ? ' min' : ' phút'}
                </span>
                <span className="flex items-center gap-1 text-[#a3c0d6]">
                  <Users size={12} /> {workflow.runCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1" style={{ color: '#92e600' }}>
                  <TrendingUp size={12} /> {workflow.completionRate}%
                </span>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="lg:hidden p-2 rounded-lg bg-[#1a2119] text-[#a3c0d6]"
              >
                <Menu size={18} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-[#64748b] mb-1">
                <span>{isEn ? `Step ${currentIdx + 1} of ${blocks.length}` : `Bước ${currentIdx + 1}/${blocks.length}`}</span>
                <span className="text-[#92e600] font-semibold">
                  {Math.round(((currentIdx + 1) / blocks.length) * 100)}%
                </span>
              </div>
              <div className="h-1 rounded-full bg-[#1a2119] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: '#92e600' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIdx + 1) / blocks.length) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 flex">
          {/* Left sidebar - Step navigation (desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] self-start">
            <StepSidebar
              blocks={blocks}
              currentIndex={currentIdx}
              completedSteps={completedSteps}
              userInputs={userInputs}
              onStepClick={handleStepClick}
              isEn={isEn}
            />
          </aside>

          {/* Mobile sidebar overlay */}
          <AnimatePresence>
            {mobileSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                  onClick={() => setMobileSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden"
                >
                  <div className="h-full bg-[#0a0d0b] pt-4">
                    <div className="flex items-center justify-between px-4 mb-4">
                      <span className="text-sm font-bold text-white">
                        {isEn ? 'Steps' : 'Các bước'}
                      </span>
                      <button
                        onClick={() => setMobileSidebarOpen(false)}
                        className="p-1.5 rounded-lg bg-[#1a2119] text-[#a3c0d6]"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <StepSidebar
                      blocks={blocks}
                      currentIndex={currentIdx}
                      completedSteps={completedSteps}
                      userInputs={userInputs}
                      onStepClick={handleStepClick}
                      isEn={isEn}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Center - Step content */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-32 xl:pb-8">
            <div className="max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                {block && (
                  <StepCard
                    key={block.id}
                    block={block}
                    blockIndex={currentIdx}
                    totalBlocks={blocks.length}
                    userInput={userInputs[block.id] || ''}
                    aiResponse={aiResponses[block.id] || ''}
                    feedbackState={feedbackState}
                    isCompleted={completedSteps.has(block.id)}
                    canProceed={canProceed()}
                    isEn={isEn}
                    onInputChange={handleInputChange}
                    onGenerate={handleGenerate}
                    onNext={handleNext}
                    onBack={handleBack}
                    isFirst={isFirst}
                    isLast={isLast}
                    isGenerating={isGenerating}
                    hideNavButtons={true}
                  />
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* Right sidebar - AI Tutor (desktop) */}
          <aside className="hidden xl:block w-80 flex-shrink-0 border-l border-[#1a2119] bg-[#0a0d0b]">
            <EnhancedAITutorPanel
              workflowTitle={title}
              currentBlock={block}
              userInputs={userInputs}
              isEn={isEn}
              className="h-full"
            />
          </aside>
        </div>

        {/* Mobile AI Tutor Bottom Sheet */}
        <AnimatePresence>
          {mobileAITutorOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40 xl:hidden"
                onClick={() => setMobileAITutorOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed left-0 right-0 bottom-0 z-50 xl:hidden rounded-t-2xl bg-[#0a0d0b] max-h-[70vh] overflow-hidden border-t border-[#1a2119]"
              >
                <div className="h-full overflow-y-auto">
                  <EnhancedAITutorPanel
                    workflowTitle={title}
                    currentBlock={block}
                    userInputs={userInputs}
                    isEn={isEn}
                    className="h-full"
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Sticky Bottom CTA Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-30 xl:hidden bg-[#0e150d]/95 backdrop-blur-lg border-t border-[#1a2119] px-4 py-3 safe-area-bottom">
          <div className="flex items-center gap-3">
            {/* Mobile Step Navigation Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#1a2119] text-[#a3c0d6] min-w-[80px]"
              >
                <span className="text-sm font-bold text-[#92e600]">{currentIdx + 1}/{blocks.length}</span>
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Mobile AI Tutor Button */}
            <button
              onClick={() => setMobileAITutorOpen(true)}
              className="flex-shrink-0 p-2.5 rounded-xl bg-[#1a2119] text-[#a3c0d6] relative"
            >
              <MessageCircle size={18} />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#92e600]" />
            </button>

            {/* Primary Action Button */}
            <motion.button
              whileHover={canProceed() && !isGenerating ? { scale: 1.02 } : {}}
              whileTap={canProceed() && !isGenerating ? { scale: 0.98 } : {}}
              onClick={handleNext}
              disabled={!canProceed() || isGenerating}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm
                transition-all duration-200
                ${canProceed() && !isGenerating
                  ? 'text-[#0b0f0c] shadow-lg'
                  : 'bg-[#1a2119] text-[#4b5563] cursor-not-allowed'
                }
              `}
              style={canProceed() && !isGenerating ? {
                background: 'linear-gradient(135deg, #92e600 0%, #7ed321 100%)',
                boxShadow: '0 4px 16px rgba(146, 230, 0, 0.3)',
              } : {}}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 size={16} className="animate-spin" />
                  </motion.div>
                  <span className="truncate">{isEn ? 'Generating...' : 'Đang tạo...'}</span>
                </>
              ) : isLast ? (
                <>
                  <Check size={16} />
                  <span className="truncate">{isEn ? 'Complete' : 'Hoàn thành'}</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  <span className="truncate">{isEn ? 'Next Step' : 'Tiếp theo'}</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Tags section - hidden on mobile to save space */}
        {workflow.tags.length > 0 && (
          <div className="hidden sm:block border-t border-[#1a2119] px-4 sm:px-6 py-4 xl:pb-4 pb-24">
            <div className="container-max">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={14} className="text-[#64748b]" />
                {workflow.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-full border font-medium"
                    style={{ borderColor: 'rgba(146,230,0,0.2)', color: '#92e600', background: 'rgba(146,230,0,0.05)' }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
