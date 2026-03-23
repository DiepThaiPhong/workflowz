import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Play, Plus, Zap, BookOpen, TrendingUp, Award, Sparkles, User
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ModeToggle from '../components/ModeToggle';
import WorkflowCard from '../components/WorkflowCard';
import AIWorkflowSuggest from '../components/AIWorkflowSuggest';
import { ALL_WORKFLOWS, PLATFORM_METRICS } from '../data/workflowData';
import { useAppContext } from '../context/AppContext';
import useLocalStorage from '../hooks/useLocalStorage';

const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const { isCreatorMode } = useAppContext();
  const navigate = useNavigate();
  const [showAISuggest, setShowAISuggest] = useState(false);

  const [userXP] = useLocalStorage<number>('skillbridge-xp', 1240);
  const [streak] = useLocalStorage<number>('skillbridge-streak', 7);
  const [completedWorkflows] = useLocalStorage<number>('skillbridge-completed', 12);

  const GREEN = '#92e600';

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16 bg-[#0b0f0c]">
        <div className="container-max px-4 sm:px-6">

          {/* Mode toggle hero */}
          <div className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {isCreatorMode ? t('dashboard.creatorTitle') : t('dashboard.learnerTitle')}
              </h1>
              <p className="text-[#e9eff5] mt-1">
                {isCreatorMode ? t('dashboard.creatorSubtitle') : t('dashboard.learnerSubtitle')}
              </p>
            </div>
          </div>

          {/* AI Suggest button */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowAISuggest(true)}
            className="w-full mb-5 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border-2 border-dashed font-semibold text-sm transition-all"
            style={{ borderColor: 'rgba(146,230,0,0.35)', color: GREEN }}
          >
            <Sparkles size={17} />
            {t('dashboard.aiSuggestBtn')}
          </motion.button>

          {/* Animated role transition */}
          <AnimatePresence mode="wait">
            {!isCreatorMode ? (
              /* ── LEARNER MODE ── */
              <motion.div
                key="learner"
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Award, val: userXP, label: t('dashboard.xpLabel'), color: 'text-yellow-400' },
                    { icon: Zap, val: `${streak} 🔥`, label: t('dashboard.streakLabel'), color: 'text-orange-400' },
                    { icon: Play, val: completedWorkflows, label: isEn ? 'Completed' : 'Hoàn thành', color: 'text-[#92e600]' },
                  ].map(({ icon: Icon, val, label, color }) => (
                    <div key={label} className="rounded-2xl p-4 flex flex-col items-center text-center border"
                      style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>
                      <Icon size={20} className={`${color} mb-1.5`} />
                      <p className={`font-black text-2xl ${color}`}>{val}</p>
                      <p className="text-xs text-[#cedde9]">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Quick links */}
                <div className="flex gap-3">
                  <Link to="/profile"
                    className="flex-1 rounded-xl p-3 flex items-center gap-2 text-sm font-medium text-gray-300 transition-all border"
                    style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#92e600')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(146,230,0,0.1)')}>
                    <User size={15} style={{ color: GREEN }} /> {t('dashboard.profileLink')}
                  </Link>
                  <Link to="/certificate"
                    className="flex-1 rounded-xl p-3 flex items-center gap-2 text-sm font-medium text-gray-300 transition-all border"
                    style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#92e600')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(146,230,0,0.1)')}>
                    <Award size={15} className="text-yellow-400" /> {t('dashboard.certificateLink')}
                  </Link>
                </div>

                {/* Recommended workflows */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-white flex items-center gap-2">
                      <Play size={18} style={{ color: GREEN }} />
                      {t('dashboard.recommendedTitle')}
                    </h2>
                    <Link to="/marketplace" className="text-xs hover:underline" style={{ color: GREEN }}>
                      {t('dashboard.viewAllWorkflows')} →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ALL_WORKFLOWS.slice(0, 4).map((wf, i) => (
                      <WorkflowCard key={wf.id} workflow={wf} index={i} compact />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ── CREATOR MODE ── */
              <motion.div
                key="creator"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Creator quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: BookOpen, val: 5, label: t('creator.publishedWorkflows'), color: GREEN },
                    { icon: TrendingUp, val: `${PLATFORM_METRICS.northStarPercent}%`, label: t('creator.avgCompletion'), color: '#60a5fa' },
                    { icon: Zap, val: PLATFORM_METRICS.totalRuns.toLocaleString(), label: t('creator.totalRuns'), color: '#facc15' },
                    { icon: Award, val: '1.25M', label: t('creator.estRevenue'), color: GREEN },
                  ].map(({ icon: Icon, val, label, color }) => (
                    <div key={label} className="rounded-2xl p-4 flex flex-col items-center text-center border"
                      style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>
                      <Icon size={20} style={{ color }} className="mb-1.5" />
                      <p className="font-black text-xl" style={{ color }}>{val}</p>
                      <p className="text-xs text-[#cedde9]">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/creator-studio')}
                    className="rounded-2xl p-6 flex items-center gap-4 transition-all text-left border"
                    style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.15)' }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(146,230,0,0.1)' }}>
                      <Plus size={22} style={{ color: GREEN }} />
                    </div>
                    <div>
                      <p className="font-bold text-white">{t('dashboard.createNewWorkflow')}</p>
                      <p className="text-xs text-[#e9eff5] mt-0.5">{t('dashboard.createNewSubtitle')}</p>
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/creator')}
                    className="rounded-2xl p-6 flex items-center gap-4 transition-all text-left border"
                    style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.15)' }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(146,230,0,0.1)' }}>
                      <TrendingUp size={22} style={{ color: GREEN }} />
                    </div>
                    <div>
                      <p className="font-bold text-white">{t('dashboard.viewAnalytics')}</p>
                      <p className="text-xs text-[#e9eff5] mt-0.5">{t('dashboard.viewAnalyticsSubtitle')}</p>
                    </div>
                  </motion.button>
                </div>

                {/* Published workflows */}
                <div>
                  <h2 className="font-bold text-white mb-4">{t('dashboard.publishedTitle')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ALL_WORKFLOWS.slice(0, 2).map((wf, i) => (
                      <WorkflowCard key={wf.id} workflow={wf} index={i} compact />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AI Suggest Modal */}
      <AnimatePresence>
        {showAISuggest && <AIWorkflowSuggest onClose={() => setShowAISuggest(false)} />}
      </AnimatePresence>
    </PageTransition>
  );
};

export default DashboardPage;
