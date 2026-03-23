import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LearningPath } from '../types';
import { ChevronRight, Star } from 'lucide-react';
import { getLevelLabel } from '../utils/helpers';

interface PathCardProps {
  path: LearningPath;
  index?: number;
  compact?: boolean;
}

const PathCard = ({ path, index = 0, compact = false }: PathCardProps) => {
  const navigate = useNavigate();
  const total = path.totalModules ?? path.modules.length;
  const completed = path.completedModules ?? 0;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const weeks = path.estimatedWeeks ?? path.totalWeeks ?? 0;
  const accent = path.color ?? '#00A651';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -3 }}
      onClick={() => navigate('/lo-trinh')}
      className="glass-card p-5 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.bgColor} flex items-center justify-center text-2xl flex-shrink-0`}>
          {path.icon}
        </div>
        <div className="flex items-center gap-1">
          <span
            className="badge text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: accent + '20', color: accent }}
          >
            {getLevelLabel(path.level)}
          </span>
        </div>
      </div>

      {/* Title & description */}
      <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm sm:text-base group-hover:text-primary transition-colors">
        {path.title}
      </h3>
      {!compact && (
        <p className="text-xs text-[#cedde9] dark:text-[#e9eff5] mb-4 line-clamp-2">
          {path.description}
        </p>
      )}

      {/* Progress */}
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-[#cedde9] dark:text-[#e9eff5]">
            {completed}/{total} bài
          </span>
          <span className="text-xs font-semibold" style={{ color: accent }}>
            {progressPct}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, delay: index * 0.08 + 0.3, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-[#e9eff5] dark:text-[#cedde9] flex items-center gap-1">
          <Star size={11} fill="currentColor" className="text-yellow-400" />
          {weeks} tuần
        </span>
        <ChevronRight size={16} className="text-[#e9eff5] dark:text-gray-600 group-hover:text-primary transition-colors" />
      </div>
    </motion.div>
  );
};

export default PathCard;
