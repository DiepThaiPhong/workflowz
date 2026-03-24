import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Zap, LayoutTemplate, CreditCard, ChevronLeft, ChevronRight,
  BarChart3, Play, CheckCircle, TrendingUp, Star, Clock, Sparkles, FolderOpen,
  Edit, Copy, LayoutGrid,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { TEMPLATE_WORKFLOWS } from '../data/workflowData';
import useLocalStorage from '../hooks/useLocalStorage';
import ManagePlanPanel from '../components/studio/ManagePlanPanel';
import WorkflowEditorPanel from '../components/studio/WorkflowEditorPanel';
import { useNavigate } from 'react-router-dom';

type SidebarTab = 'dashboard' | 'editor' | 'workflows' | 'templates' | 'plan';

const GREEN = '#92e600';
const DARK = '#0b0f0c';
const PANEL_BG = '#0e150d';

const CreatorStudioPage = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [activeTab, setActiveTab] = useState<SidebarTab>('editor');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [savedWorkflows, setSavedWorkflows] = useLocalStorage<{ id: string; name: string; published?: boolean }[]>('wfz-studio-workflows', []);

  const tabs: { id: SidebarTab; icon: typeof LayoutTemplate; label: string; labelVi: string }[] = [
    { id: 'dashboard',  icon: BarChart3,     label: 'Dashboard',      labelVi: 'Tổng quan' },
    { id: 'editor',     icon: LayoutTemplate, label: 'Workflow Editor', labelVi: 'Trình soạn thảo' },
    { id: 'workflows',  icon: FolderOpen,    label: 'My Workflows',    labelVi: 'Workflow của tôi' },
    { id: 'templates',  icon: LayoutGrid,    label: 'Templates',       labelVi: 'Mẫu có sẵn' },
    { id: 'plan',       icon: CreditCard,    label: 'Manage Plan',     labelVi: 'Quản lý gói' },
  ];

  const handlePublishTemplate = (wf: { id: string; name: string }) => {
    setSavedWorkflows(prev => {
      if (prev.some(w => w.id === wf.id)) return prev.map(w => w.id === wf.id ? { ...w, published: true } : w);
      return [...prev, { ...wf, published: true }];
    });
    setActiveTab('workflows');
  };

  return (
    <PageTransition>
      <div className="flex h-screen pt-16 overflow-hidden" style={{ background: DARK }}>

        {/* Left Sidebar */}
        <motion.aside
          animate={{ width: sidebarCollapsed ? 56 : 220 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex-shrink-0 flex flex-col z-10 relative border-r"
          style={{ background: PANEL_BG, borderColor: 'rgba(146,230,0,0.1)' }}
        >
          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center z-20 transition-colors"
            style={{ background: '#1a2119', border: '1px solid rgba(146,230,0,0.2)', color: '#cedde9' }}
          >
            {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>

          {/* Logo area */}
          <div className={`flex items-center gap-2.5 px-4 py-4 border-b ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
            style={{ borderColor: 'rgba(146,230,0,0.1)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: GREEN }}>
              <Zap size={16} color={DARK} fill={DARK} />
            </div>
            {!sidebarCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-black text-sm text-white tracking-tight">
                Creator Studio
              </motion.span>
            )}
          </div>

          {/* Nav tabs */}
          <nav className="flex-1 py-3 space-y-1 px-2">
            {tabs.map(({ id, icon: Icon, label, labelVi }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={activeTab === id
                  ? { background: 'rgba(146,230,0,0.12)', color: GREEN, border: '1px solid rgba(146,230,0,0.25)' }
                  : { color: '#cedde9', border: '1px solid transparent' }}
              >
                <Icon size={17} className="flex-shrink-0" />
                {!sidebarCollapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                    {isEn ? label : labelVi}
                  </motion.span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom credits badge */}
          {!sidebarCollapsed && (
            <div className="px-3 pb-3">
              <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(146,230,0,0.08)', border: '1px solid rgba(146,230,0,0.15)' }}>
                <p className="font-black text-lg" style={{ color: GREEN }}>∞</p>
                <p className="text-xs text-[#e9eff5]">credits</p>
              </div>
            </div>
          )}
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} className="h-full overflow-y-auto p-6">
                <CreatorDashboardContent savedWorkflows={savedWorkflows} isEn={isEn} />
              </motion.div>
            )}
            {activeTab === 'editor' && (
              <motion.div key="editor" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} className="h-full">
                <WorkflowEditorPanel />
              </motion.div>
            )}
            {activeTab === 'plan' && (
              <motion.div key="plan" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} className="h-full overflow-y-auto">
                <ManagePlanPanel />
              </motion.div>
            )}
            {activeTab === 'workflows' && (
              <motion.div key="workflows" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} className="h-full overflow-y-auto p-6">
                <MyWorkflowsContent savedWorkflows={savedWorkflows} isEn={isEn} onEdit={() => setActiveTab('editor')} />
              </motion.div>
            )}
            {activeTab === 'templates' && (
              <motion.div key="templates" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} className="h-full overflow-y-auto p-6">
                <TemplatesContent isEn={isEn} savedWorkflows={savedWorkflows} onPublish={handlePublishTemplate} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageTransition>
  );
};

// ── Templates Tab Content ────────────────────────────────────────────────────
function TemplatesContent({
  isEn,
  savedWorkflows,
  onPublish,
}: {
  isEn: boolean;
  savedWorkflows: { id: string; name: string; published?: boolean }[];
  onPublish: (wf: { id: string; name: string }) => void;
}) {
  const PANEL = '#0e150d';
  const BORDER = 'rgba(146,230,0,0.1)';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{isEn ? 'Templates' : 'Mẫu có sẵn'}</h1>
        <p className="text-[#e9eff5] text-sm mt-1">
          {isEn ? 'Start from a professionally designed template.' : 'Bắt đầu từ mẫu được thiết kế chuyên nghiệp.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATE_WORKFLOWS.map((wf, i) => {
          const title = isEn && wf.titleEn ? wf.titleEn : wf.title;
          const desc  = isEn && wf.descriptionEn ? wf.descriptionEn : wf.description;
          const alreadyPublished = savedWorkflows.some(s => s.id === wf.id && s.published);

          return (
            <motion.div
              key={wf.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border overflow-hidden flex flex-col"
              style={{ background: PANEL, borderColor: BORDER }}>
              {/* Thumbnail */}
              <div className="h-32 overflow-hidden relative flex-shrink-0">
                <img src={wf.thumbnail} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e150d]/80 to-transparent" />
                <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: wf.id === 'wf-chatbot' ? 'rgba(146,230,0,0.9)' : 'rgba(255,255,255,0.9)',
                           color: '#0b0f0c' }}>
                  {wf.id === 'wf-chatbot' ? '⭐ Featured' : wf.price === 0 ? 'Free' : `${(wf.price/1000).toFixed(0)}K`}
                </span>
              </div>
              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-sm font-bold text-white mb-1">{title}</p>
                <p className="text-[11px] text-[#8a9a92] leading-relaxed flex-1 mb-3">{desc}</p>
                <div className="flex items-center gap-2 text-[11px] text-[#8a9a92] mb-3">
                  <span>{wf.blocks.length} {isEn ? 'steps' : 'bước'}</span>
                  <span>·</span>
                  <span>{wf.estimatedMinutes} {isEn ? 'min' : 'phút'}</span>
                </div>
                {/* Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={!alreadyPublished ? { scale: 1.03 } : {}}
                    whileTap={!alreadyPublished ? { scale: 0.97 } : {}}
                    onClick={() => !alreadyPublished && onPublish({ id: wf.id, name: title })}
                    disabled={alreadyPublished}
                    className="flex-1 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    style={{ background: alreadyPublished ? '#1a2119' : GREEN, color: alreadyPublished ? '#92e600' : '#0b0f0c' }}>
                    {alreadyPublished
                      ? <><CheckCircle size={12}/> {isEn ? 'Published' : 'Đã xuất bản'}</>
                      : <><Zap size={12}/> {isEn ? 'Publish' : 'Xuất bản'}</>
                    }
                  </motion.button>
                  <button className="px-3 py-2 rounded-lg border text-[11px] font-semibold transition-all hover:bg-[rgba(146,230,0,0.06)]"
                    style={{ borderColor: BORDER, color: '#cedde9' }}>
                    <Copy size={12}/>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── My Workflows Tab Content ────────────────────────────────────────────────
function MyWorkflowsContent({
  savedWorkflows,
  isEn,
  onEdit,
}: { savedWorkflows: { id: string; name: string; published?: boolean }[]; isEn: boolean; onEdit: () => void }) {
  const GREEN = '#92e600';
  const PANEL = '#0e150d';
  const BORDER = 'rgba(146,230,0,0.1)';
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{isEn ? 'My Workflows' : 'Workflow của tôi'}</h1>
        <p className="text-[#e9eff5] text-sm mt-1">{isEn ? 'Manage and organize your created workflows.' : 'Quản lý và sắp xếp các workflow đã tạo.'}</p>
      </div>

      <div className="rounded-2xl border p-5" style={{ background: PANEL, borderColor: BORDER }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white flex items-center gap-2">
            <FolderOpen size={16} style={{ color: GREEN }} />
            {isEn ? 'All Workflows' : 'Tất cả Workflow'}
          </h2>
          <span className="text-xs text-[#cedde9]">{savedWorkflows.length} {isEn ? 'total' : 'tổng'}</span>
        </div>
        {savedWorkflows.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles size={40} className="mx-auto mb-3 text-[#cedde9]" />
            <p className="text-[#cedde9] text-sm mb-4">{isEn ? 'No workflows yet.' : 'Chưa có workflow nào.'}</p>
            <p className="text-[#cedde9] text-xs">{isEn ? 'Go to Templates to get started!' : 'Vào Mẫu có sẵn để bắt đầu!'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedWorkflows.map((wf) => (
              <motion.div key={wf.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                className="rounded-xl border p-4 transition-all"
                style={{ background: 'rgba(146,230,0,0.03)', borderColor: 'rgba(146,230,0,0.1)' }}>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(146,230,0,0.1)' }}>
                      <Zap size={14} style={{ color: GREEN }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#e9eff5]">{wf.name}</p>
                      <p className="text-[10px] text-[#8a9a92]">{isEn ? 'WorkFlowz Team' : 'WorkFlowz Team'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: wf.published ? 'rgba(146,230,0,0.15)' : 'rgba(255,165,0,0.15)',
                             color: wf.published ? GREEN : '#fb923c' }}>
                    {wf.published ? (isEn ? '✓ Published' : '✓ Đã xuất bản') : 'Draft'}
                  </span>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                  {[
                    { val: wf.published ? '0' : '—', label: isEn ? 'Runs' : 'Lượt chạy', color: '#60a5fa' },
                    { val: wf.published ? '0%' : '—', label: isEn ? 'Completion' : 'Hoàn thành', color: GREEN },
                    { val: wf.published ? '—' : '—', label: isEn ? 'Rating' : 'Đánh giá', color: '#facc15' },
                  ].map(({ val, label, color }) => (
                    <div key={label} className="rounded-lg py-2 px-1"
                      style={{ background: '#0b0f0c', border: '1px solid rgba(146,230,0,0.06)' }}>
                      <p className="text-sm font-black" style={{ color }}>{val}</p>
                      <p className="text-[10px] text-[#8a9a92] mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                {/* Action buttons */}
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/workflow/${wf.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold text-xs transition-all"
                    style={{ background: GREEN, color: '#0b0f0c' }}>
                    <Play size={11}/> {isEn ? 'Run' : 'Chạy'}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={onEdit}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold text-xs transition-all border"
                    style={{ borderColor: 'rgba(146,230,0,0.3)', color: GREEN }}>
                    <Edit size={11}/> {isEn ? 'Edit' : 'Chỉnh sửa'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Creator Dashboard Tab Content ─────────────────────────────────────────────
function CreatorDashboardContent({
  savedWorkflows,
  isEn,
}: { savedWorkflows: { id: string; name: string }[]; isEn: boolean }) {
  const GREEN = '#92e600';
  const PANEL = '#0e150d';
  const BORDER = 'rgba(146,230,0,0.1)';

  const stats = [
    { icon: TrendingUp,  val: '87%',                 label: isEn ? 'Avg Completion'  : 'Hoàn thành TB',   color: '#60a5fa' },
    { icon: Star,        val: '4.8',                 label: isEn ? 'Avg Rating'      : 'Đánh giá TB',     color: '#facc15' },
    { icon: CheckCircle, val: '∞',                   label: isEn ? 'Credits Left'    : 'Credits còn',     color: GREEN },
  ];

  const recentActivity = [
    { icon: '✅', text: isEn ? 'Published "Build Your First AI Chatbot"' : 'Xuất bản "Xây dựng AI Chatbot đầu tiên"', time: '2h ago' },
    { icon: '✏️', text: isEn ? 'Edited "Email Automation Workflow"' : 'Sửa "Tự động hoá email"', time: '5h ago' },
    { icon: '🚀', text: isEn ? 'Workflow ran 34 times today' : 'Workflow chạy 34 lần hôm nay', time: '6h ago' },
    { icon: '⭐', text: isEn ? 'New 5-star review received' : 'Nhận đánh giá 5 sao mới', time: 'Yesterday' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{isEn ? 'Creator Dashboard' : 'Tổng quan Creator'}</h1>
        <p className="text-[#e9eff5] text-sm mt-1">{isEn ? 'Overview of your workflows, activity, and earnings.' : 'Tổng quan workflow, hoạt động và thu nhập của bạn.'}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, val, label, color }) => (
          <motion.div key={label} whileHover={{ y: -2 }}
            className="rounded-2xl p-4 flex flex-col items-center text-center border"
            style={{ background: PANEL, borderColor: BORDER }}>
            <Icon size={20} style={{ color }} className="mb-2" />
            <p className="font-black text-2xl" style={{ color }}>{val}</p>
            <p className="text-xs text-[#cedde9] mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border p-5" style={{ background: PANEL, borderColor: BORDER }}>
        <h2 className="font-bold text-white flex items-center gap-2 mb-4">
          <Clock size={16} style={{ color: GREEN }} />
          {isEn ? 'Recent Activity' : 'Hoạt động gần đây'}
        </h2>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3">
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span className="flex-1 text-sm text-[#e9eff5]">{item.text}</span>
              <span className="text-xs text-[#cedde9] flex-shrink-0">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreatorStudioPage;
