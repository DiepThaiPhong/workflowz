import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Heart, Zap } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0b0f0c] text-white pt-14 pb-8 border-t border-[#92e600]/10">
      <div className="container-max px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Brand with logo2 */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img
                src="/logo2.svg"
                alt="WorkFlowz"
                className="h-9 w-auto"
                onError={(e) => {
                  // Fallback to text logo if SVG not found
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-9 h-9 rounded-xl flex items-center justify-center';
                  fallback.style.background = '#92e600';
                  el.parentNode?.insertBefore(fallback, el);
                }}
              />
              <span className="font-black text-lg tracking-tight">
                <span className="text-white">Work</span>
                <span style={{ color: '#92e600' }}>Flowz</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{t('footer.tagline')}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Lock size={11} style={{ color: '#92e600' }} />
              {t('footer.dataNote')}
            </div>
          </div>

          {/* Learning links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">{t('footer.studySection')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { to: '/marketplace', label: t('nav.discover') },
                { to: '/dashboard', label: t('nav.myLearning') },
                { to: '/creator-studio', label: t('nav.creatorStudio') },
                { to: '/certificate', label: t('nav.certificate') },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors"
                    style={{ ['--tw-text-opacity' as any]: 1 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#92e600')}
                    onMouseLeave={e => (e.currentTarget.style.color = '')}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ethics */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">{t('footer.ethicsTitle')}</h3>
            <div className="space-y-2">
              {[
                { icon: Lock,   label: t('footer.privacy') },
                { icon: Shield, label: t('footer.safety') },
                { icon: Heart,  label: t('footer.wcag') },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-gray-400">
                  <Icon size={12} style={{ color: '#92e600' }} className="flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#92e600]/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>{t('footer.copyright')}</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={11} style={{ color: '#92e600' }} className="mx-0.5" fill="#92e600" /> for Vietnam 🇻🇳
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
