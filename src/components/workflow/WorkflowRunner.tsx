import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronLeft, Play, MessageSquare, CheckCircle, Copy, Download } from 'lucide-react';
import { Workflow, WorkflowRunState, InteractionMode } from '../../types';
import { askTutor } from '../../services/geminiService';

interface WorkflowRunnerProps {
  workflow: Workflow;
  onComplete?: (artifact: string) => void;
}

const MODE_ICONS = {
  'workflow': <Play size={14} />,
  'qa': <MessageSquare size={14} />,
};

const MODE_LABELS_VI = { 'workflow': 'Workflow', 'qa': 'Hỏi & Đáp' };
const MODE_LABELS_EN = { 'workflow': 'Workflow', 'qa': 'Q & A' };

const WorkflowRunner = ({ workflow, onComplete }: WorkflowRunnerProps) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const modeLabels = isEn ? MODE_LABELS_EN : MODE_LABELS_VI;

  const [mode, setMode] = useState<InteractionMode>(workflow.interactionMode);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [outputArtifact, setOutputArtifact] = useState('');
  const [copied, setCopied] = useState(false);

  const blocks = workflow.blocks;
  const block = blocks[currentIdx];
  const isLast = currentIdx === blocks.length - 1;
  const isFirst = currentIdx === 0;
  const progress = Math.round(((currentIdx + 1) / blocks.length) * 100);

  const resolveTemplate = (template: string) => {
    let result = template;
    // Replace {{blockId}} with actual user input or AI response
    Object.entries(userInputs).forEach(([blockId, val]) => {
      result = result.replace(new RegExp(`\\{\\{${blockId}\\}\\}`, 'g'), val);
    });
    Object.entries(aiResponses).forEach(([blockId, val]) => {
      result = result.replace(new RegExp(`\\{\\{${blockId}\\}\\}`, 'g'), val);
    });
    return result;
  };

  const handleNext = async () => {
    if (block.type === 'aiPrompt' && !aiResponses[block.id]) {
      // Generate AI response
      setIsGenerating(true);
      const resolvedPrompt = resolveTemplate(block.content);
      try {
        const { text, confidence } = await askTutor(resolvedPrompt, []);
        setAiResponses((prev) => ({ ...prev, [block.id]: text }));
        // If this is the last output block, set artifact
        if (isLast || blocks[currentIdx + 1]?.type === 'output') {
          setOutputArtifact(text);
        }
      } catch {
        setAiResponses((prev) => ({ ...prev, [block.id]: 'Đã xảy ra lỗi kỹ thuật. Vui lòng thử lại.' }));
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    if (isLast) {
      // Compile artifact
      const artifact = block.type === 'output'
        ? (aiResponses[blocks[currentIdx - 1]?.id] || outputArtifact || 'Workflow hoàn thành!')
        : outputArtifact;
      setOutputArtifact(artifact);
      setCompleted(true);
      onComplete?.(artifact);
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const canProceed = () => {
    if (block.type === 'input') return (userInputs[block.id] || '').trim().length > 0;
    if (block.type === 'decision') return !!(userInputs[block.id]);
    return true;
  };

  const copyArtifact = () => {
    navigator.clipboard.writeText(outputArtifact);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (completed) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6">
        {/* Success header */}
        <div className="text-center py-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <CheckCircle size={56} className="text-primary mx-auto mb-3" fill="currentColor" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isEn ? '🎉 Workflow Complete!' : '🎉 Workflow hoàn thành!'}
          </h2>
          <p className="text-[#cedde9] dark:text-[#e9eff5]">
            {isEn ? 'Your output artifact has been generated.' : 'Kết quả đầu ra đã được tạo thành công.'}
          </p>
        </div>

        {/* Output artifact */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">
              📄 {isEn ? 'Output Artifact' : 'Kết quả đầu ra'}
            </h3>
            <div className="flex gap-2">
              <button onClick={copyArtifact} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all">
                <Copy size={12} />{copied ? '✓' : (isEn ? 'Copy' : 'Sao chép')}
              </button>
              <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all">
                <Download size={12} />{isEn ? 'Save' : 'Lưu'}
              </button>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto font-mono">
            {outputArtifact || (isEn ? 'Workflow completed successfully!' : 'Workflow đã hoàn thành thành công!')}
          </div>
        </div>

        <button onClick={() => { setCompleted(false); setCurrentIdx(0); setUserInputs({}); setAiResponses({}); }}
          className="btn-secondary text-sm text-center">
          {isEn ? '↺ Run again' : '↺ Chạy lại'}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Mode selector */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {(Object.keys(MODE_ICONS) as InteractionMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
              mode === m ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-[#cedde9] dark:text-[#e9eff5] hover:text-gray-700'
            }`}
          >
            {MODE_ICONS[m]}
            <span className="hidden sm:inline">{modeLabels[m]}</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-[#e9eff5]">
          <span>{isEn ? `Step ${currentIdx + 1} of ${blocks.length}` : `Bước ${currentIdx + 1}/${blocks.length}`}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* Block card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={block.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="glass-card p-5 min-h-[200px]"
        >
          {/* Block type badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-primary text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
              {block.type === 'aiPrompt' ? '🤖 AI' : block.type === 'input' ? '✏️' : block.type === 'output' ? '📄' : block.type === 'decision' ? '🔀' : '📖'}
              {' '}{block.type}
            </span>
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{block.title}</h2>

          {/* Content by block type */}
          {block.type === 'instruction' && (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{block.content}</p>
          )}

          {block.type === 'input' && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{block.content}</p>
              <textarea
                value={userInputs[block.id] || ''}
                onChange={(e) => setUserInputs((prev) => ({ ...prev, [block.id]: e.target.value }))}
                placeholder={block.placeholder || '...'}
                rows={4}
                className="input-field resize-none text-sm"
              />
            </div>
          )}

          {block.type === 'decision' && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{block.content}</p>
              <div className="flex flex-col gap-2">
                {(block.options || []).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setUserInputs((prev) => ({ ...prev, [block.id]: opt }))}
                    className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                      userInputs[block.id] === opt
                        ? 'border-primary bg-primary-50 dark:bg-primary/10 text-primary'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    {userInputs[block.id] === opt ? '✓ ' : ''}{opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {block.type === 'aiPrompt' && (
            <div>
              {isGenerating ? (
                <div className="flex items-center gap-3 py-6">
                  <div className="flex gap-1">
                    {[0,1,2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [-4, 4, -4] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[#cedde9] dark:text-[#e9eff5]">
                    {isEn ? 'AI is generating your response...' : 'AI đang tạo kết quả...'}
                  </p>
                </div>
              ) : aiResponses[block.id] ? (
                <div className="bg-primary-50 dark:bg-primary/10 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {aiResponses[block.id]}
                </div>
              ) : (
                <p className="text-sm text-[#cedde9] dark:text-[#e9eff5] italic">
                  {isEn ? 'Click "Next" to generate AI response...' : 'Nhấn "Tiếp theo" để AI tạo kết quả...'}
                </p>
              )}
            </div>
          )}

          {block.type === 'output' && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{block.content}</p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-sm text-[#e9eff5] dark:text-[#cedde9] italic">
                {isEn ? 'Output will appear once all steps are complete...' : 'Kết quả sẽ xuất hiện khi hoàn thành tất cả các bước...'}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          disabled={isFirst || isGenerating}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:border-primary/50 transition-all"
        >
          <ChevronLeft size={16} />{isEn ? 'Back' : 'Quay lại'}
        </button>
        <motion.button
          whileHover={canProceed() ? { scale: 1.02 } : {}}
          whileTap={canProceed() ? { scale: 0.97 } : {}}
          onClick={handleNext}
          disabled={!canProceed() || isGenerating}
          className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            isEn ? 'Generating...' : 'Đang tạo...'
          ) : isLast ? (
            <><CheckCircle size={16} />{isEn ? 'Complete' : 'Hoàn thành'}</>
          ) : (
            <>{isEn ? 'Next' : 'Tiếp theo'}<ChevronRight size={16} /></>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default WorkflowRunner;
