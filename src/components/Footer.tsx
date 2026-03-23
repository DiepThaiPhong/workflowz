import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Heart, Zap } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative overflow-hidden" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container-max px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img
                src="/logo2.svg"
                alt="WorkFlowz"
                className="h-9 w-auto"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                }}
              />
              <span className="font-display font-black text-lg tracking-tight">
                <span className="text-white">Work</span>
                <span className="text-primary">Flowz</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#e9eff5' }}>{t('footer.tagline')}</p>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Lock size={11} className="text-primary flex-shrink-0" />
              {t('footer.dataNote')}
            </div>
          </div>

          {/* Learning links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>{t('footer.studySection')}</h3>
            <ul className="space-y-3">
              {[
                { to: '/marketplace', label: t('nav.discover') },
                { to: '/dashboard', label: t('nav.myLearning') },
                { to: '/creator-studio', label: t('nav.creatorStudio') },
                { to: '/certificate', label: t('nav.certificate') },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link 
                    to={to} 
                    className="text-sm transition-all duration-200 hover:pl-1"
                    style={{ color: '#e9eff5' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--accent-purple)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#e9eff5';
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ethics */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>{t('footer.ethicsTitle')}</h3>
            <div className="space-y-3">
              {[
                { icon: Lock,   label: t('footer.privacy') },
                { icon: Shield, label: t('footer.safety') },
                { icon: Heart,  label: t('footer.wcag') },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs" style={{ color: '#e9eff5' }}>
                  <Icon size={14} className="text-primary flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
          <p>{t('footer.copyright')}</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-primary mx-0.5" fill="var(--accent-purple)" /> for Vietnam 🇻🇳
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
