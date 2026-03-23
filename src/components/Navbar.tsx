import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Menu, X, User, Compass, BookOpen, ChevronDown } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DISCOVER_CATEGORIES = [
  { label: 'Email & Communication', labelVi: 'Email & Giao tiếp',    category: 'writing',  emoji: '✉️' },
  { label: 'AI Productivity',       labelVi: 'Năng suất AI',          category: 'ai',       emoji: '🤖' },
  { label: 'Resume & Job Skills',   labelVi: 'CV & Kỹ năng nghề',    category: 'business', emoji: '💼' },
  { label: 'Digital Literacy',      labelVi: 'Kỹ năng số',           category: 'digital',  emoji: '💻' },
  { label: 'Coding Basics',         labelVi: 'Lập trình cơ bản',     category: 'coding',   emoji: '⌨️' },
  { label: 'All Workflows',         labelVi: 'Tất cả Workflow',       category: '',         emoji: '⚡' },
];

const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDiscoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCategory = (category: string) => {
    setDiscoverOpen(false);
    setMobileOpen(false);
    navigate(category ? `/marketplace?category=${category}` : '/marketplace');
  };

  return (
    <header className="navbar">
      <div className="container-max px-4 sm:px-6">
        <div className="flex items-center gap-4" style={{ height: 'var(--nav-h)' }}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <img
              src="/Logo2.svg"
              alt="WorkFlowz"
              className="h-8 w-auto"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
          </Link>

          {/* Main nav – desktop */}
          <nav className="hidden md:flex items-center gap-1 flex-1 ml-4" ref={dropdownRef}>

            {/* Discover with dropdown */}
            <div className="relative"
              onMouseEnter={() => setDiscoverOpen(true)}
              onMouseLeave={() => setDiscoverOpen(false)}
            >
              <button
                onClick={() => setDiscoverOpen(!discoverOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  discoverOpen || location.pathname === '/' || location.pathname === '/marketplace'
                    ? 'text-primary'
                    : 'text-[#e9eff5] hover:text-primary'
                }`}
              >
                <Compass size={15} />
                {t('nav.discover')}
                <ChevronDown size={13} className={`transition-transform duration-200 ${discoverOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {discoverOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 mt-2 w-64 rounded-2xl overflow-hidden"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-hover)',
                      boxShadow: 'var(--shadow-lg)',
                    }}
                  >
                    <div className="p-2">
                      {DISCOVER_CATEGORIES.map((cat) => (
                        <button
                          key={cat.category + cat.label}
                          onClick={() => handleCategory(cat.category)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left group"
                          style={{ color: '#e9eff5' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(146, 230, 0, 0.08)';
                            e.currentTarget.style.color = '#92e600';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '';
                            e.currentTarget.style.color = '#e9eff5';
                          }}
                        >
                          <span className="text-base">{cat.emoji}</span>
                          <span>{isEn ? cat.label : cat.labelVi}</span>
                          {cat.category === '' && (
                            <span className="ml-auto text-[10px] font-bold text-primary border border-[var(--border-hover)] rounded-full px-1.5 py-0.5">ALL</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* My Learning */}
            <Link to="/dashboard"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive('/dashboard')
                  ? 'text-primary'
                  : 'text-[#e9eff5] hover:text-primary'
              }`}>
              <BookOpen size={15} />
              {t('nav.myLearning')}
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Creator Studio CTA */}
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/creator-studio')}
              className="btn btn-primary hidden sm:flex items-center gap-2 text-sm"
            >
              <Zap size={14} fill="currentColor" />
              {t('nav.creatorStudio')}
            </motion.button>

            <LanguageSwitcher />

            {/* Profile */}
            <Link to="/profile"
              className="flex w-8 h-8 rounded-full items-center justify-center border border-[var(--border-hover)] text-primary hover:bg-primary/10 transition-all duration-200">
              <User size={16} />
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-[#e9eff5] hover:text-primary hover:bg-white/5 transition-colors">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-b"
            style={{ 
              background: 'var(--bg-primary)', 
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="px-4 pb-4 pt-2">
              <div className="px-2 pt-1 pb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{t('nav.discover')}</p>
                {DISCOVER_CATEGORIES.map(cat => (
                  <button key={cat.label} onClick={() => handleCategory(cat.category)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 text-left"
                    style={{ color: '#e9eff5' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(146, 230, 0, 0.08)';
                      e.currentTarget.style.color = '#92e600';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '';
                      e.currentTarget.style.color = '#e9eff5';
                    }}
                  >
                    <span>{cat.emoji}</span>
                    {isEn ? cat.label : cat.labelVi}
                  </button>
                ))}
              </div>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
                style={{ color: '#e9eff5' }}
              >
                <BookOpen size={16} /> {t('nav.myLearning')}
              </Link>
              <button onClick={() => { navigate('/creator-studio'); setMobileOpen(false); }}
                className="btn btn-primary flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold mt-1 w-full justify-center">
                <Zap size={16} fill="currentColor" /> {t('nav.creatorStudio')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
