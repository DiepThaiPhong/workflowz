import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Edit3, Save, X, Award, Zap, Flame, CheckCircle, BarChart2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import ProgressRing from '../components/ProgressRing';
import useLocalStorage from '../hooks/useLocalStorage';

interface ProfileData {
  name: string;
  bio: string;
  avatarColor: string;
}

const AVATAR_COLORS = [
  '#00A651', '#00D4FF', '#7B61FF', '#FF6B35', '#DA291C', '#F59E0B', '#EC4899', '#06B6D4',
];

const getRank = (xp: number, t: (key: string) => string) => {
  if (xp >= 2000) return { label: t('profile.rankMaster'), color: '#FFD700', emoji: '👑' };
  if (xp >= 1000) return { label: t('profile.rankAdvanced'), color: '#7B61FF', emoji: '🔥' };
  if (xp >= 400) return { label: t('profile.rankIntermediate'), color: '#00D4FF', emoji: '⚡' };
  return { label: t('profile.rankBeginner'), color: '#00A651', emoji: '🌱' };
};

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useLocalStorage<ProfileData>('workflowz-profile', {
    name: 'WorkFlowz Learner',
    bio: '',
    avatarColor: '#00A651',
  });
  const [draft, setDraft] = useState<ProfileData>(profile);
  const [totalXP] = useLocalStorage('skillbridge-xp', 240);
  const [streak] = useLocalStorage('skillbridge-streak', 3);
  const [completedWorkflows] = useLocalStorage<{ id: string; title: string; completedAt: string; xpEarned: number }[]>(
    'workflowz-completed',
    [
      { id: '1', title: 'Write a Professional Email', completedAt: new Date().toISOString(), xpEarned: 120 },
      { id: '2', title: 'Build a Job-Ready Resume', completedAt: new Date().toISOString(), xpEarned: 150 },
    ]
  );

  const rank = getRank(totalXP, t);
  const xpToNext = totalXP < 400 ? 400 : totalXP < 1000 ? 1000 : totalXP < 2000 ? 2000 : 9999;
  const xpPct = Math.min(100, Math.round((totalXP / xpToNext) * 100));

  const saveProfile = () => {
    setProfile(draft);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const skillAreas = [
    { label: 'Digital Literacy', pct: 72, color: '#00A651' },
    { label: 'AI Skills', pct: 58, color: '#00D4FF' },
    { label: 'Coding', pct: 35, color: '#7B61FF' },
    { label: 'Job Skills', pct: 80, color: '#FF6B35' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-surface-dark">
        <div className="container-max px-4 sm:px-6 max-w-4xl">

          {/* Profile Hero Card */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 sm:p-8 mb-6 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
              style={{ background: profile.avatarColor, filter: 'blur(60px)' }} />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <motion.div whileHover={{ scale: 1.05 }} className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${profile.avatarColor}, ${profile.avatarColor}88)` }}>
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold text-white shadow"
                  style={{ background: rank.color }}>
                  {rank.emoji} {rank.label}
                </div>
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <input
                        className="input-field mb-2 font-bold text-lg"
                        value={draft.name}
                        onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
                        placeholder={t('profile.namePlaceholder')}
                      />
                      <textarea
                        className="input-field text-sm resize-none mb-2"
                        rows={2}
                        value={draft.bio}
                        onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))}
                        placeholder={t('profile.bioPlaceholder')}
                      />
                      <div className="mb-2">
                        <p className="text-xs text-[#cedde9] dark:text-[#e9eff5] mb-2">{t('profile.avatarColor')}</p>
                        <div className="flex gap-2 flex-wrap">
                          {AVATAR_COLORS.map(c => (
                            <button key={c} onClick={() => setDraft(p => ({ ...p, avatarColor: c }))}
                              className={`w-7 h-7 rounded-full border-2 transition-all ${draft.avatarColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                              style={{ background: c }} />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button whileTap={{ scale: 0.95 }} onClick={saveProfile}
                          className="btn-primary text-sm flex items-center gap-1"><Save size={14} />{t('profile.saveProfile')}</motion.button>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={cancelEdit}
                          className="btn-secondary text-sm flex items-center gap-1"><X size={14} />{t('profile.cancelEdit')}</motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{profile.name}</h1>
                      <p className="text-[#cedde9] dark:text-[#e9eff5] text-sm mb-3">
                        {profile.bio || t('profile.bioPlaceholder')}
                      </p>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => { setDraft(profile); setIsEditing(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all">
                        <Edit3 size={13} /> {t('profile.editProfile')}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* XP stat */}
            {[
              { icon: Zap, value: totalXP, label: t('profile.totalXP'), color: 'text-primary', bg: 'bg-primary/10' },
              { icon: Flame, value: streak, label: t('profile.streak'), color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
              { icon: CheckCircle, value: completedWorkflows.length, label: t('profile.completedWorkflows'), color: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10' },
            ].map(({ icon: Icon, value, label, color, bg }) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-[#cedde9] dark:text-[#e9eff5]">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* XP Progress to next rank */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart2 size={16} className="text-primary" /> {t('profile.rank')}: {rank.emoji} {rank.label}
              </h3>
              <span className="text-sm text-[#cedde9]">{totalXP} / {xpToNext} XP</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${rank.color}, ${rank.color}88)` }} />
            </div>
            <p className="text-xs text-[#e9eff5] mt-1">{xpToNext - totalXP} XP to next rank</p>
          </motion.div>

          {/* Skill Progress rings */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-card p-6 mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <BarChart2 size={16} className="text-primary" /> {t('profile.progressSection')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {skillAreas.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2">
                  <ProgressRing percentage={s.pct} size={80} strokeWidth={8} color={s.color}
                    label={`${s.pct}%`} animate />
                  <p className="text-xs text-center text-[#cedde9] dark:text-[#e9eff5]">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certificate Section */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
                  <Award size={20} className="text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{t('profile.certificateSection')}</h3>
                  <p className="text-xs text-[#cedde9]">{completedWorkflows.length} workflows completed</p>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/certificate')}
                className="btn-primary text-sm">{t('profile.viewCertificate')}</motion.button>
            </div>
          </motion.div>

          {/* Recent Workflows */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="glass-card p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-primary" /> {t('profile.recentWorkflows')}
            </h3>
            {completedWorkflows.length === 0 ? (
              <p className="text-[#e9eff5] text-sm">{t('profile.noWorkflows')}</p>
            ) : (
              <div className="space-y-2">
                {completedWorkflows.map((w, i) => (
                  <motion.div key={w.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <CheckCircle size={16} className="text-primary flex-shrink-0" />
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{w.title}</span>
                    <span className="text-xs text-primary font-bold">+{w.xpEarned} XP</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
