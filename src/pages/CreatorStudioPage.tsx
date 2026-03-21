import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Zap, LayoutTemplate, CreditCard, ChevronLeft, ChevronRight,
  BarChart3, Play, CheckCircle, TrendingUp, Star, Clock, Sparkles,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { ALL_WORKFLOWS } from '../data/workflowData';
import useLocalStorage from '../hooks/useLocalStorage';
import ManagePlanPanel from '../components/studio/ManagePlanPanel';
import WorkflowEditorPanel from '../components/studio/WorkflowEditorPanel';

type SidebarTab = 'dashboard' | 'editor' | 'plan';

const GREEN = '#92e600';
const DARK = '#0b0f0c';
const PANEL_BG = '#0e150d';

const CreatorStudioPage = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [activeTab, setActiveTab] = useState<SidebarTab>('editor');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [savedWorkflows] = useLocalStorage<{ id: string; name: string }[]>('wfz-studio-workflows', []);

  const tabs: { id: SidebarTab; icon: typeof LayoutTemplate; label: string; labelVi: string }[] = [
    { id: 'dashboard', icon: BarChart3,    label: 'Dashboard',      labelVi: 'Tổng quan' },
    { id: 'editor',    icon: LayoutTemplate, label: 'Workflow Editor', labelVi: 'Trình soạn thảo' },
    { id: 'plan',      icon: CreditCard,   label: 'Manage Plan',    labelVi: 'Quản lý gói' },
  ];

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
            style={{ background: '#1a2119', border: '1px solid rgba(146,230,0,0.2)', color: '#6b7280' }}
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
                  : { color: '#6b7280', border: '1px solid transparent' }}
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
                <p className="text-xs text-gray-400">credits</p>
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
          </AnimatePresence>
        </main>
      </div>
    </PageTransition>
  );
};

// ── Creator Dashboard Tab Content ────────────────────────────────────────────
function CreatorDashboardContent({
  savedWorkflows,
  isEn,
}: { savedWorkflows: { id: string; name: string }[]; isEn: boolean }) {
  const GREEN = '#92e600';
  const PANEL = '#0e150d';
  const BORDER = 'rgba(146,230,0,0.1)';

  const stats = [
    { icon: Play,        val: savedWorkflows.length, label: isEn ? 'My Workflows'    : 'Workflow của tôi', color: GREEN },
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{isEn ? 'Creator Dashboard' : 'Tổng quan Creator'}</h1>
        <p className="text-gray-400 text-sm mt-1">{isEn ? 'Overview of your workflows, activity, and earnings.' : 'Tổng quan workflow, hoạt động và thu nhập của bạn.'}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, val, label, color }) => (
          <motion.div key={label} whileHover={{ y: -2 }}
            className="rounded-2xl p-4 flex flex-col items-center text-center border"
            style={{ background: PANEL, borderColor: BORDER }}>
            <Icon size={20} style={{ color }} className="mb-2" />
            <p className="font-black text-2xl" style={{ color }}>{val}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* My Workflows */}
      <div className="rounded-2xl border p-5" style={{ background: PANEL, borderColor: BORDER }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Play size={16} style={{ color: GREEN }} />
            {isEn ? 'My Workflows' : 'Workflow của tôi'}
          </h2>
          <span className="text-xs text-gray-500">{savedWorkflows.length} {isEn ? 'total' : 'tổng'}</span>
        </div>
        {savedWorkflows.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles size={32} className="mx-auto mb-2 text-gray-700" />
            <p className="text-gray-500 text-sm">{isEn ? 'No workflows yet. Go to Workflow Editor to create one!' : 'Chưa có workflow. Vào Trình soạn thảo để tạo!'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {savedWorkflows.map((wf) => (
              <div key={wf.id} className="flex items-center justify-between px-3 py-2 rounded-xl"
                style={{ background: 'rgba(146,230,0,0.04)', border: '1px solid rgba(146,230,0,0.08)' }}>
                <span className="text-sm text-gray-200 font-medium">{wf.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(146,230,0,0.1)', color: GREEN }}>Draft</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
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
              <span className="flex-1 text-sm text-gray-300">{item.text}</span>
              <span className="text-xs text-gray-600 flex-shrink-0">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreatorStudioPage;
