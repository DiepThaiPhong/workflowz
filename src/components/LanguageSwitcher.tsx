import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useAppContext();
  const isVi = language === 'vi';

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setLanguage(isVi ? 'en' : 'vi')}
      title={isVi ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
      aria-label={isVi ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm font-medium text-gray-700 dark:text-gray-300 select-none"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={language}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-1"
        >
          {isVi ? (
            <><span className="text-base leading-none">🇻🇳</span><span className="hidden sm:inline">VI</span></>
          ) : (
            <><span className="text-base leading-none">🇬🇧</span><span className="hidden sm:inline">EN</span></>
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

export default LanguageSwitcher;
