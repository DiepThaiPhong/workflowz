import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Plus, TrendingUp, Users, DollarSign, Star, BookOpen, Edit2, Trash2, Eye, BarChart3 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import WorkflowCard from '../components/WorkflowCard';
import { PLATFORM_METRICS, ALL_WORKFLOWS } from '../data/workflowData';
import { formatNumber } from '../utils/helpers';
import useLocalStorage from '../hooks/useLocalStorage';
import { Workflow } from '../types';

const REVENUE_MOCK = 1_250_000; // VNĐ

const CreatorDashboardPage = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const navigate = useNavigate();

  // Creator's own workflows (localStorage-created ones simulated)
  const [creatorWorkflows] = useLocalStorage<Workflow[]>('skillbridge-teacher-courses', []);
  // For demo, show built-in workflows as "published"
  const pubWorkflows = ALL_WORKFLOWS.slice(0, 3);
  const draftWorkflows = ALL_WORKFLOWS.slice(3);

  const [activeTab, setActiveTab] = useState<'published' | 'drafts' | 'analytics'>('published');

  const stats = [
    {
      icon: BookOpen,
      value: pubWorkflows.length + creatorWorkflows.length,
      label: isEn ? 'Published Workflows' : 'Workflow đã xuất bản',
      color: 'text-primary',
    },
    {
      icon: Users,
      value: pubWorkflows.reduce((s, w) => s + w.runCount, 0),
      label: isEn ? 'Total Runs' : 'Tổng lượt chạy',
      color: 'text-gblue',
    },
    {
      icon: TrendingUp,
      value: `${Math.round(pubWorkflows.reduce((s, w) => s + w.completionRate, 0) / pubWorkflows.length)}%`,
      label: isEn ? 'Avg Completion' : 'Hoàn thành TB',
      color: 'text-yellow-500',
    },
    {
      icon: DollarSign,
      value: `${formatNumber(REVENUE_MOCK)}đ`,
      label: isEn ? 'Est. Revenue' : 'Doanh thu ước tính',
      color: 'text-accent',
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-surface-dark">
        <div className="container-max px-4 sm:px-6">
          {/* Header */}
          <div className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={20} className="text-purple-500" />
                <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Creator Studio</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {isEn ? 'My Creator Dashboard' : 'Bảng điều khiển Creator'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {isEn ? 'Build, publish, and monetize your workflows.' : 'Xây dựng, xuất bản, và kiếm tiền từ workflow.'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/studio')}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              {isEn ? 'Create New Workflow' : 'Tạo Workflow Mới'}
            </motion.button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {stats.map(({ icon: Icon, value, label, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-4 flex flex-col items-center text-center"
              >
                <Icon size={20} className={`${color} mb-1.5`} />
                <p className={`font-bold text-xl ${color}`}>{typeof value === 'number' ? formatNumber(value) : value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* North Star metric callout */}
          <div className="glass-card p-4 mb-6 flex items-center gap-4 bg-gradient-to-r from-primary-50 dark:from-primary-950/30 to-white dark:to-surface-dark">
            <BarChart3 size={32} className="text-primary flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider">{isEn ? 'North Star Metric' : 'Chỉ số North Star'}</p>
              <p className="font-bold text-gray-900 dark:text-white text-lg">
                {PLATFORM_METRICS.northStarPercent}%
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  {isEn ? 'of completed workflows generated an output artifact' : 'workflow hoàn thành tạo được kết quả đầu ra'}
                </span>
              </p>
              <p className="text-xs text-gray-400">{isEn ? 'Target: ≥60% executable steps · ≥40% completion rate' : 'Mục tiêu: ≥60% bước thực thi · ≥40% tỉ lệ hoàn thành'}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 w-fit">
            {([
              { id: 'published', labelVi: 'Đã xuất bản', labelEn: 'Published' },
              { id: 'drafts', labelVi: 'Bản nháp', labelEn: 'Drafts' },
              { id: 'analytics', labelVi: 'Analytics', labelEn: 'Analytics' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {isEn ? tab.labelEn : tab.labelVi}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === 'published' && (
              <motion.div
                key="published"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pubWorkflows.map((wf, i) => (
                    <div key={wf.id} className="relative group">
                      <WorkflowCard workflow={wf} index={i} />
                      {/* Creator action overlay */}
                      <div className="absolute top-3 left-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigate('/studio')} className="flex items-center gap-1 text-[11px] bg-white/90 px-2 py-1 rounded-lg shadow font-medium text-gray-700 hover:text-primary transition-colors">
                          <Edit2 size={11} />Edit
                        </button>
                        <button className="flex items-center gap-1 text-[11px] bg-white/90 px-2 py-1 rounded-lg shadow font-medium text-gray-700 hover:text-gblue transition-colors">
                          <Eye size={11} />Preview
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* Add new card */}
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/studio')}
                    className="glass-card border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-2 min-h-[280px] hover:border-primary transition-all"
                  >
                    <Plus size={24} className="text-gray-400" />
                    <p className="text-sm font-medium text-gray-400">{isEn ? 'Create New Workflow' : 'Tạo Workflow Mới'}</p>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {activeTab === 'drafts' && (
              <motion.div key="drafts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {draftWorkflows.map((wf, i) => (
                    <div key={wf.id} className="relative opacity-75 hover:opacity-100 transition-opacity">
                      <WorkflowCard workflow={wf} index={i} />
                      <div className="absolute top-2 left-2">
                        <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {isEn ? 'DRAFT' : 'NHÁP'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Completion rate */}
                  <div className="glass-card p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                      {isEn ? 'Completion Rate' : 'Tỷ lệ hoàn thành'}
                    </h3>
                    <div className="space-y-3">
                      {pubWorkflows.map((wf) => (
                        <div key={wf.id}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-300 truncate max-w-[60%]">
                              {isEn && wf.titleEn ? wf.titleEn : wf.title}
                            </span>
                            <span className="font-bold text-primary">{wf.completionRate}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${wf.completionRate}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-400">{isEn ? 'PRD Target: ≥40%' : 'Mục tiêu PRD: ≥40%'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '40%' }} />
                        </div>
                        <span className="text-[11px] font-bold text-yellow-500">Target 40%</span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="glass-card p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <DollarSign size={16} className="text-accent" />
                      {isEn ? 'Revenue Overview' : 'Doanh thu'}
                    </h3>
                    <div className="space-y-3">
                      {pubWorkflows.filter((w) => w.price > 0).map((wf) => (
                        <div key={wf.id} className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-[60%]">
                            {isEn && wf.titleEn ? wf.titleEn : wf.title}
                          </span>
                          <span className="text-xs font-bold text-accent">
                            {formatNumber(wf.price * Math.floor(wf.runCount * 0.3))}đ
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{isEn ? 'Total' : 'Tổng cộng'}</span>
                        <span className="font-black text-lg text-accent">{formatNumber(REVENUE_MOCK)}đ</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {isEn ? 'Payment via MoMo / Bank Transfer (coming soon)' : 'Thanh toán qua MoMo / Chuyển khoản (sắp ra mắt)'}
                      </p>
                    </div>
                  </div>

                  {/* Creator conversion */}
                  <div className="glass-card p-5 sm:col-span-2">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                      {isEn ? 'Learner → Creator Conversion' : 'Tỷ lệ chuyển đổi Học viên → Creator'}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-black text-gblue">{PLATFORM_METRICS.creatorConversionRate}%</div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${PLATFORM_METRICS.creatorConversionRate}%` }}
                            transition={{ duration: 1.5 }}
                            className="h-full bg-gblue rounded-full"
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {isEn ? 'PRD target: ≥15% · Current: 11% → growing!' : 'Mục tiêu PRD: ≥15% · Hiện tại: 11% → đang tăng!'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default CreatorDashboardPage;
