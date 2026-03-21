import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface RoleSwitcherProps {
  compact?: boolean;
}

const RoleSwitcher = ({ compact = false }: RoleSwitcherProps) => {
  const { t } = useTranslation();
  const { isCreatorMode, toggleCreatorMode } = useAppContext();

  if (compact) {
    return (
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={toggleCreatorMode}
        aria-label={isCreatorMode ? 'Switch to learner' : 'Switch to creator'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
          isCreatorMode
            ? 'bg-purple-500/10 text-purple-500 border-purple-400/30 hover:bg-purple-500/20'
            : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={String(isCreatorMode)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1"
          >
            {isCreatorMode
              ? <><Sparkles size={13} /><span className="hidden sm:inline">{t('mode.creator')}</span></>
              : <><BookOpen size={13} /><span className="hidden sm:inline">{t('mode.learner')}</span></>
            }
          </motion.span>
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <div className="glass-card p-1 flex gap-1">
      {(['learner', 'creator'] as const).map((r) => {
        const active = isCreatorMode ? r === 'creator' : r === 'learner';
        const Icon = r === 'learner' ? BookOpen : Sparkles;
        return (
          <motion.button
            key={r}
            whileHover={!active ? { scale: 1.02 } : {}}
            whileTap={{ scale: 0.97 }}
            onClick={toggleCreatorMode}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
              active
                ? r === 'learner'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-purple-600 text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Icon size={16} />
            {r === 'learner' ? t('mode.learner') : t('mode.creator')}
          </motion.button>
        );
      })}
    </div>
  );
};

export default RoleSwitcher;
