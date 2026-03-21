import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  darkMode: boolean;
  toggle: () => void;
}

const DarkModeToggle = ({ darkMode, toggle }: DarkModeToggleProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      aria-label={darkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      className="relative w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 0 : 180, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {darkMode ? <Moon size={18} /> : <Sun size={18} />}
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;
