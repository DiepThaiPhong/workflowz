import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, BookOpen, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface ModeToggleProps {
  variant?: 'navbar' | 'hero' | 'dashboard';
}

const ModeToggle = ({ variant = 'navbar' }: ModeToggleProps) => {
  const { t } = useTranslation();
  const { isCreatorMode, toggleCreatorMode } = useAppContext();
  const navigate = useNavigate();

  const handleToggle = () => {
    toggleCreatorMode();
    if (!isCreatorMode) {
      // Switching TO creator – go to creator dashboard
      navigate('/creator');
    }
  };

  // Navbar compact version
  if (variant === 'navbar') {
    return (
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={handleToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
          isCreatorMode
            ? 'bg-purple-500/20 text-purple-400 border-purple-500/40 hover:bg-purple-500/30'
            : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
        }`}
        aria-label={isCreatorMode ? t('mode.exitCreator') : t('mode.activateCreator')}
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
            {isCreatorMode ? (
              <><Sparkles size={12} /><span className="hidden sm:inline">{t('mode.creator')}</span></>
            ) : (
              <><BookOpen size={12} /><span className="hidden sm:inline">{t('mode.learner')}</span></>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    );
  }

  // Dashboard / Hero – big prominent pill
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-3"
    >
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleToggle}
        className={`relative flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg ${
          isCreatorMode
            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-purple-500/30'
            : 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-primary/30'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={String(isCreatorMode)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            {isCreatorMode ? (
              <>
                <Sparkles size={18} />
                {t('mode.inCreatorStudio')}
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-[10px] uppercase tracking-wider">LIVE</span>
              </>
            ) : (
              <>
                <Zap size={18} />
                {t('mode.activateCreatorBtn')}
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {isCreatorMode && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleCreatorMode}
          className="text-xs text-[#e9eff5] hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
        >
          <BookOpen size={11} />
          {t('mode.switchToLearner')}
        </motion.button>
      )}
    </motion.div>
  );
};

export default ModeToggle;
