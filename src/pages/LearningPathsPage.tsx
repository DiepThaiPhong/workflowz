import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, Lock, CheckCircle, Play } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { learningPaths } from '../data/learningPaths';
import { LearningPath, LearningModule } from '../types';
import { getLevelLabel } from '../utils/helpers';
import useLocalStorage from '../hooks/useLocalStorage';

const typeIcon: Record<string, string> = { video: '🎬', quiz: '🧠', reading: '📖', practice: '✏️' };

const PathDetailPanel = ({
  path,
  completedIds,
  onCompleteModule,
}: {
  path: LearningPath;
  completedIds: string[];
  onCompleteModule: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(true);
  const total = path.totalModules ?? path.modules.length;
  const completed = path.modules.filter((m) => completedIds.includes(m.id)).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div
      layout
      className="glass-card overflow-hidden"
    >
      {/* Card header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
      >
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.bgColor} flex items-center justify-center text-2xl flex-shrink-0`}
        >
          {path.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-gray-900 dark:text-white">{path.title}</h3>
            <span
              className="badge text-[11px] px-2 py-0.5 rounded-full"
              style={{ backgroundColor: path.color + '25', color: path.color }}
            >
              {getLevelLabel(path.level)}
            </span>
          </div>
          <p className="text-xs text-[#cedde9] dark:text-[#e9eff5] mb-2 line-clamp-1">{path.description}</p>
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: path.color, width: `${pct}%` }}
              layout
            />
          </div>
          <p className="text-[11px] text-[#e9eff5] dark:text-[#cedde9] mt-1">{completed}/{total} bài · {path.estimatedWeeks ?? path.totalWeeks ?? 0} tuần</p>
        </div>
        <div className="flex-shrink-0 text-[#e9eff5]">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Module list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="border-t border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800/50">
              {path.modules.map((mod, i) => {
                const isDone = completedIds.includes(mod.id);
                const isLocked = i > 0 && !completedIds.includes(path.modules[i - 1].id);
                return (
                  <div
                    key={mod.id}
                    className={`flex items-center gap-3 px-5 py-3 ${
                      isLocked ? 'opacity-50' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                    } transition-colors`}
                  >
                    <span className="text-lg w-8 text-center flex-shrink-0">{typeIcon[mod.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isDone ? 'line-through text-[#e9eff5]' : 'text-gray-800 dark:text-gray-200'}`}>
                        {mod.title}
                      </p>
                      <p className="text-xs text-[#e9eff5]">{mod.duration} · +{mod.xp} XP</p>
                    </div>
                    {isLocked ? (
                      <Lock size={15} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
                    ) : isDone ? (
                      <CheckCircle size={18} className="text-primary flex-shrink-0" fill="currentColor" />
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCompleteModule(mod.id)}
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
                        title="Bắt đầu bài học"
                      >
                        <Play size={13} fill="currentColor" />
                      </motion.button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LearningPathsPage = () => {
  const [completedModules, setCompletedModules] = useLocalStorage<string[]>(
    'skillbridge-completed-modules',
    []
  );

  const handleComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules((prev) => [...prev, moduleId]);
    }
  };

  const totalModules = learningPaths.reduce((s, p) => s + (p.totalModules ?? p.modules.length), 0);
  const completedCount = completedModules.length;
  const overallPct = Math.round((completedCount / totalModules) * 100);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-surface-dark">
        <div className="container-max px-4 sm:px-6">
          {/* Header */}
          <div className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen size={24} className="text-primary" />
                Lộ Trình Học
              </h1>
              <p className="text-[#cedde9] dark:text-[#e9eff5] mt-1">5 lộ trình kỹ năng số được AI cá nhân hóa</p>
            </div>
            {/* Overall progress */}
            <div className="glass-card px-5 py-3 flex items-center gap-3">
              <div>
                <p className="text-xs text-[#e9eff5] dark:text-[#cedde9]">Tổng tiến trình</p>
                <p className="font-bold text-gray-900 dark:text-white">{completedCount}/{totalModules} bài</p>
              </div>
              <div className="w-16 h-16">
                <svg viewBox="0 0 60 60" className="-rotate-90 w-full h-full">
                  <circle cx="30" cy="30" r="24" fill="none" stroke="#E5E7EB" strokeWidth="6" className="dark:stroke-gray-700" />
                  <motion.circle
                    cx="30" cy="30" r="24" fill="none"
                    stroke="#00A651" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 24}
                    initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - overallPct / 100) }}
                    transition={{ duration: 1.2 }}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Path cards */}
          <div className="space-y-4">
            {learningPaths.map((path, i) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <PathDetailPanel
                  path={path}
                  completedIds={completedModules}
                  onCompleteModule={handleComplete}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LearningPathsPage;
