import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, Save, Play, ArrowLeft, Wand2, LayoutTemplate } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import WorkflowCanvas from '../components/workflow/WorkflowCanvas';
import { ALL_WORKFLOWS } from '../data/workflowData';
import useLocalStorage from '../hooks/useLocalStorage';

const BuilderPage = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAIGen, setShowAIGen] = useState(false);
  const [savedCount, setSavedCount] = useLocalStorage('wfz-saved-count', 0);

  const templateWorkflow = selectedTemplate
    ? ALL_WORKFLOWS.find((w) => w.id === selectedTemplate)
    : undefined;

  const handleSave = () => {
    setSavedCount((c) => c + 1);
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-screen pt-16 bg-gray-50 dark:bg-gray-950">
        {/* Studio header */}
        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <Link to="/creator" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <ArrowLeft size={16} />
            {isEn ? 'Creator Studio' : 'Creator Studio'}
          </Link>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-500" />
            <h1 className="text-sm font-bold text-gray-900 dark:text-white">
              {isEn ? 'Workflow Builder' : 'Trình Tạo Workflow'}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowAIGen(!showAIGen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-semibold hover:bg-purple-200 transition-all"
            >
              <Wand2 size={13} />
              {isEn ? 'AI Generate' : 'AI Tạo workflow'}
            </button>
          </div>
        </div>

        {/* AI Generate panel */}
        {showAIGen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-purple-50 dark:bg-purple-950/30 border-b border-purple-200 dark:border-purple-800 px-4 py-3"
          >
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">
              {isEn ? '✨ Describe your workflow and AI will generate the blocks:' : '✨ Mô tả workflow của bạn, AI sẽ tự tạo các khối:'}
            </p>
            <div className="flex gap-2">
              <input
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={isEn ? 'e.g. A workflow to write a product review...' : 'VD: Quy trình viết đánh giá sản phẩm...'}
                className="flex-1 input-field text-xs"
              />
              <button className="btn-primary text-xs !px-4">
                <Wand2 size={13} className="inline mr-1" />
                {isEn ? 'Generate' : 'Tạo ngay'}
              </button>
            </div>
            <p className="text-[10px] text-purple-500 mt-1.5">✦ {isEn ? 'AI generation is mocked in v1 – full feature in v2' : 'Tính năng AI tạo workflow sẽ ra mắt đầy đủ ở v2'}</p>
          </motion.div>
        )}

        {/* Template picker banner (only when no template selected) */}
        {!selectedTemplate && (
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
              <LayoutTemplate size={13} />
              {isEn ? 'Start from template:' : 'Bắt đầu từ mẫu:'}
            </div>
            {ALL_WORKFLOWS.map((wf) => (
              <button
                key={wf.id}
                onClick={() => setSelectedTemplate(wf.id)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/30"
              >
                {isEn && wf.titleEn ? wf.titleEn : wf.title}
              </button>
            ))}
            <button className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium">
              {isEn ? '+ Blank' : '+ Trống'}
            </button>
          </div>
        )}

        {/* Main canvas */}
        <div className="flex-1 overflow-hidden">
          <WorkflowCanvas
            initialWorkflow={templateWorkflow}
            readOnly={false}
            onSave={handleSave}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default BuilderPage;
