import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Sparkles, ArrowRight, Smartphone, Code2, Briefcase, PenLine, Database, User, Loader2, Save, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Block {
  type: string;
  label: string;
  content: string;
}

interface SuggestedWorkflow {
  title: string;
  description: string;
  category: string;
  level: string;
  blocks: Block[];
}

const CATEGORIES = [
  { id: 'writing', icon: PenLine, color: '#00A651' },
  { id: 'coding', icon: Code2, color: '#00D4FF' },
  { id: 'business', icon: Briefcase, color: '#7B61FF' },
  { id: 'personal', icon: User, color: '#FF6B35' },
  { id: 'data', icon: Database, color: '#F59E0B' },
  { id: 'digital', icon: Smartphone, color: '#EC4899' },
];

const EXAMPLE_IDEAS = [
  { en: 'Write a viral LinkedIn post', vi: 'Viết LinkedIn post viral' },
  { en: 'Create a 30-day study plan', vi: 'Tạo kế hoạch học 30 ngày' },
  { en: 'Build a personal brand pitch', vi: 'Xây dựng thương hiệu cá nhân' },
  { en: 'Analyze sales data insights', vi: 'Phân tích dữ liệu bán hàng' },
  { en: 'Design a onboarding checklist', vi: 'Thiết kế checklist onboarding' },
  { en: 'Create a Python beginner tutorial', vi: 'Tạo hướng dẫn Python cơ bản' },
];

// Mock AI workflow generation
const generateWorkflow = async (category: string, goal: string, isEn: boolean): Promise<SuggestedWorkflow> => {
  await new Promise(r => setTimeout(r, 2000));
  
  const templates: Record<string, SuggestedWorkflow> = {
    writing: {
      title: isEn ? goal || 'Professional Writing Workflow' : goal || 'Workflow Viết Chuyên Nghiệp',
      description: isEn ? 'A step-by-step AI-powered writing assistant workflow' : 'Workflow hỗ trợ viết có AI từng bước',
      category: 'writing',
      level: 'beginner',
      blocks: [
        { type: 'instruction', label: isEn ? 'Define Purpose' : 'Xác định mục tiêu', content: isEn ? 'Clarify the goal and audience for your writing' : 'Làm rõ mục tiêu và đối tượng viết' },
        { type: 'input', label: isEn ? 'Your Topic' : 'Chủ đề của bạn', content: isEn ? 'What do you want to write about?' : 'Bạn muốn viết về điều gì?' },
        { type: 'aiPrompt', label: isEn ? 'AI Draft' : 'AI Tạo nháp', content: isEn ? 'Generate a professional draft based on the topic and purpose' : 'Tạo bản nháp chuyên nghiệp dựa trên chủ đề' },
        { type: 'input', label: isEn ? 'Your Feedback' : 'Phản hồi của bạn', content: isEn ? 'What adjustments do you want?' : 'Bạn muốn điều chỉnh gì?' },
        { type: 'aiPrompt', label: isEn ? 'Refined Version' : 'Phiên bản cải thiện', content: isEn ? 'Refine and polish the draft' : 'Cải thiện và hoàn thiện bản nháp' },
        { type: 'output', label: isEn ? 'Final Output' : 'Kết quả cuối', content: isEn ? 'Your polished piece is ready!' : 'Bài viết của bạn đã sẵn sàng!' },
      ],
    },
    coding: {
      title: isEn ? goal || 'Code Review Workflow' : goal || 'Workflow Review Code',
      description: isEn ? 'AI-assisted code review and improvement workflow' : 'Workflow review và cải thiện code với AI',
      category: 'coding',
      level: 'intermediate',
      blocks: [
        { type: 'instruction', label: isEn ? 'Paste Your Code' : 'Dán Code Vào', content: isEn ? 'Paste the code you want to review' : 'Dán code bạn muốn review vào' },
        { type: 'input', label: isEn ? 'Code Input' : 'Code đầu vào', content: isEn ? 'Paste your code here' : 'Dán code vào đây' },
        { type: 'aiPrompt', label: isEn ? 'AI Code Review' : 'AI Review Code', content: isEn ? 'Review the code for bugs, performance, and best practices' : 'Review code về lỗi, hiệu năng và best practices' },
        { type: 'output', label: isEn ? 'Review Report' : 'Báo cáo Review', content: isEn ? 'Detailed code review with suggestions' : 'Báo cáo review chi tiết với gợi ý' },
      ],
    },
    business: {
      title: isEn ? goal || 'Business Plan Workflow' : goal || 'Workflow Kế Hoạch Kinh Doanh',
      description: isEn ? 'Generate a complete business plan with AI assistance' : 'Tạo kế hoạch kinh doanh hoàn chỉnh với AI',
      category: 'business',
      level: 'intermediate',
      blocks: [
        { type: 'input', label: isEn ? 'Business Idea' : 'Ý tưởng kinh doanh', content: isEn ? 'Describe your business idea in 2-3 sentences' : 'Mô tả ý tưởng kinh doanh trong 2-3 câu' },
        { type: 'aiPrompt', label: isEn ? 'Market Analysis' : 'Phân tích thị trường', content: isEn ? 'Analyze the market, competitors, and opportunity' : 'Phân tích thị trường, đối thủ và cơ hội' },
        { type: 'aiPrompt', label: isEn ? 'Revenue Model' : 'Mô hình doanh thu', content: isEn ? 'Suggest 3 revenue models for this business' : 'Gợi ý 3 mô hình doanh thu cho kinh doanh này' },
        { type: 'output', label: isEn ? 'Business Plan' : 'Kế hoạch kinh doanh', content: isEn ? 'Your complete business plan' : 'Kế hoạch kinh doanh hoàn chỉnh của bạn' },
      ],
    },
    default: {
      title: isEn ? goal || 'Custom AI Workflow' : goal || 'Workflow AI Tùy Chỉnh',
      description: isEn ? 'A personalized AI-powered workflow for your goal' : 'Workflow AI cá nhân hóa theo mục tiêu của bạn',
      category,
      level: 'beginner',
      blocks: [
        { type: 'instruction', label: isEn ? 'Getting Started' : 'Bắt đầu', content: isEn ? 'Follow these steps to achieve your goal' : 'Làm theo các bước để đạt mục tiêu' },
        { type: 'input', label: isEn ? 'Your Input' : 'Thông tin của bạn', content: isEn ? 'Provide the necessary information' : 'Cung cấp thông tin cần thiết' },
        { type: 'aiPrompt', label: isEn ? 'AI Processing' : 'AI Xử Lý', content: isEn ? 'AI analyzes and generates personalized output' : 'AI phân tích và tạo kết quả cá nhân hóa' },
        { type: 'output', label: isEn ? 'Your Result' : 'Kết quả', content: isEn ? 'Here is your personalized output' : 'Đây là kết quả cá nhân hóa của bạn' },
      ],
    },
  };
  
  return templates[category] || templates.default;
};

interface Props {
  onClose: () => void;
}

const AIWorkflowSuggest = ({ onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isEn = i18n.language === 'en';
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCat, setSelectedCat] = useState('');
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggested, setSuggested] = useState<SuggestedWorkflow | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStep(3);
    const result = await generateWorkflow(selectedCat, goal, isEn);
    setSuggested(result);
    setIsGenerating(false);
  };

  const handleOpenInBuilder = () => {
    if (suggested) {
      sessionStorage.setItem('workflowz-ai-suggested', JSON.stringify(suggested));
      navigate('/studio');
      onClose();
    }
  };

  const handleSave = () => {
    if (suggested) {
      const saved = JSON.parse(localStorage.getItem('workflowz-my-workflows') || '[]');
      saved.push({ ...suggested, id: Date.now().toString(), createdAt: new Date().toISOString() });
      localStorage.setItem('workflowz-my-workflows', JSON.stringify(saved));
      onClose();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="glass-card w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles size={20} className="text-primary" /> {t('aiSuggest.title')}
            </h2>
            <p className="text-xs text-[#e9eff5] mt-0.5">{t('aiSuggest.subtitle')}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={18} className="text-[#cedde9]" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex px-5 pt-4 gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${step >= s ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{t('aiSuggest.step1Title')}</h3>
                <p className="text-sm text-[#e9eff5] mb-4">{t('aiSuggest.step1Subtitle')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map(({ id, icon: Icon, color }) => (
                    <motion.button key={id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedCat(id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        selectedCat === id ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-[#e9eff5] hover:border-primary/50'
                      }`}>
                      <Icon size={20} style={{ color: selectedCat === id ? color : undefined }} />
                      {t(`marketplace.categories.${id}`)}
                    </motion.button>
                  ))}
                </div>
                
                {/* Quick examples */}
                <div className="mt-4">
                  <p className="text-xs text-[#e9eff5] mb-2">{t('aiSuggest.examples.title')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {EXAMPLE_IDEAS.slice(0, 4).map((idea) => (
                      <button key={idea.en} onClick={() => { setGoal(isEn ? idea.en : idea.vi); setSelectedCat('writing'); }}
                        className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-[#e9eff5] hover:bg-primary/10 hover:text-primary transition-all">
                        {isEn ? idea.en : idea.vi}
                      </button>
                    ))}
                  </div>
                </div>
                
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(2)} disabled={!selectedCat}
                  className="btn-primary w-full mt-4 disabled:opacity-40">
                  {isEn ? 'Continue' : 'Tiếp tục'} <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{t('aiSuggest.step2Title')}</h3>
                <textarea
                  className="input-field w-full min-h-[100px] resize-none mb-3"
                  placeholder={t('aiSuggest.step2Placeholder')}
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(1)} className="btn-secondary px-4">
                    <ArrowRight size={18} className="rotate-180" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      navigate('/marketplace?category=coding');
                      onClose();
                    }}
                    className="btn-primary flex-1">
                    <Sparkles size={18} /> {isEn ? 'Find Workflow' : 'Tìm Workflow'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">{t('aiSuggest.step3Title')}</h3>
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Loader2 size={32} className="text-primary" />
                    </motion.div>
                    <p className="text-sm text-[#cedde9]">{t('aiSuggest.generating')}</p>
                  </div>
                ) : suggested && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="glass-card bg-primary/5 border border-primary/20 p-4 mb-4 rounded-xl">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">{suggested.title}</h4>
                      <p className="text-sm text-[#cedde9] mb-3">{suggested.description}</p>
                      <div className="space-y-1.5">
                        {suggested.blocks.map((b, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                            <span className="text-gray-600 dark:text-[#e9eff5]">{b.label}</span>
                            <span className="ml-auto opacity-50 text-[10px]">[{b.type}]</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                        onClick={handleSave} className="btn-secondary flex-1 gap-1.5 text-sm">
                        <Save size={16} /> {t('aiSuggest.saveToLibrary')}
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                        onClick={handleOpenInBuilder} className="btn-primary flex-1 gap-1.5 text-sm">
                        <ExternalLink size={16} /> {t('aiSuggest.openInBuilder')}
                      </motion.button>
                    </div>
                    <button onClick={() => { setStep(1); setSuggested(null); setGoal(''); }}
                      className="w-full mt-4 text-xs text-center text-[#e9eff5] hover:text-primary transition-colors">
                      {t('aiSuggest.tryAnother')}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIWorkflowSuggest;
