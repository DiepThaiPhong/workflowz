import { motion } from 'framer-motion';
import { CheckCircle, Clock, Zap, Lock } from 'lucide-react';
import { DailyMission } from '../types';

interface MissionCardProps {
  mission: DailyMission;
  onComplete: (id: string) => void;
  index?: number;
}

const typeIcon: Record<string, string> = {
  video: '🎬',
  quiz: '🧠',
  reading: '📖',
  practice: '✏️',
};

const MissionCard = ({ mission, onComplete, index = 0 }: MissionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className={`glass-card p-4 sm:p-5 transition-all duration-200 ${
        mission.completed ? 'mission-complete opacity-80' : 'hover:shadow-glass'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Type icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
          mission.completed
            ? 'bg-primary-100 dark:bg-primary-900/30'
            : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          {typeIcon[mission.type] || '📚'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm sm:text-base leading-tight mb-1 ${
            mission.completed ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-white'
          }`}>
            {mission.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{mission.description}</p>

          {/* Meta */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Clock size={12} />
              {mission.duration}
            </span>
            <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 font-medium">
              <Zap size={12} />
              +{mission.xp} XP
            </span>
          </div>
        </div>

        {/* Complete button */}
        <div className="flex-shrink-0">
          {mission.completed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-primary"
            >
              <CheckCircle size={26} fill="currentColor" className="text-primary" />
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComplete(mission.id)}
              className="btn-primary !px-3 !py-2 !text-xs"
            >
              Bắt đầu
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MissionCard;
