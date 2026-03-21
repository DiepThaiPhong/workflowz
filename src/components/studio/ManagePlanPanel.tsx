import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CreditCard, Zap, Check, Clock, Sparkles } from 'lucide-react';
import useLocalStorage from '../../hooks/useLocalStorage';

interface Purchase {
  id: string;
  pkg: string;
  credits: number;
  price: number;
  date: string;
}

const PACKAGES = [
  { id: 'starter', credits: 100, price: 99000, priceUSD: 4, labelKey: 'managePlan.pkg1Name', descKey: 'managePlan.pkg1Desc', popular: false, color: '#00A651', features: ['100 AI generations', 'Basic templates', 'Export PDF'] },
  { id: 'pro', credits: 500, price: 399000, priceUSD: 16, labelKey: 'managePlan.pkg2Name', descKey: 'managePlan.pkg2Desc', popular: true, color: '#00D4FF', features: ['500 AI generations', 'All templates', 'Priority support', 'Team sharing'] },
  { id: 'studio', credits: 1000, price: 699000, priceUSD: 28, labelKey: 'managePlan.pkg3Name', descKey: 'managePlan.pkg3Desc', popular: false, color: '#7B61FF', features: ['1000 AI generations', 'Custom branding', 'Analytics dashboard', 'API access'] },
];

// Simple confetti burst
const Confetti = ({ onDone }: { onDone: () => void }) => {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#00A651','#00D4FF','#7B61FF','#FFD700','#FF6B35'][i % 5],
    delay: Math.random() * 0.4,
    size: 6 + Math.random() * 8,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-[200]" onAnimationEnd={onDone}>
      {pieces.map(p => (
        <motion.div key={p.id}
          initial={{ opacity: 1, y: -20, x: `${p.x}vw`, rotate: 0 }}
          animate={{ opacity: 0, y: '105vh', rotate: 720 }}
          transition={{ duration: 2.5, delay: p.delay, ease: 'easeIn' }}
          className="absolute top-0 rounded-sm"
          style={{ width: p.size, height: p.size, background: p.color }} />
      ))}
    </div>
  );
};

export default function ManagePlanPanel() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [credits, setCredits] = useLocalStorage('wfz-credits', 0);
  const [history, setHistory] = useLocalStorage<Purchase[]>('wfz-purchase-history', []);
  const [showConfetti, setShowConfetti] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [buying, setBuying] = useState<string | null>(null);

  const handleBuy = async (pkg: typeof PACKAGES[0]) => {
    setBuying(pkg.id);
    await new Promise(r => setTimeout(r, 1200));
    setCredits(c => c + pkg.credits);
    setHistory(h => [...h, {
      id: Date.now().toString(),
      pkg: t(pkg.labelKey),
      credits: pkg.credits,
      price: pkg.price,
      date: new Date().toLocaleDateString(isEn ? 'en-US' : 'vi-VN'),
    }]);
    setBuying(null);
    setShowConfetti(true);
    setSuccessMsg(t('managePlan.success'));
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="min-h-full bg-gray-950 p-6">
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      {/* Success message */}
      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2">
            <Sparkles size={16} /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        {/* Header + Balance */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-1">{t('managePlan.title')}</h2>
          <p className="text-gray-400 text-sm">{t('managePlan.subtitle')}</p>
        </div>

        {/* Current credits card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/20 to-[#00D4FF]/10 border border-primary/30 rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{t('managePlan.currentCredits')}</p>
            <p className="text-5xl font-black text-primary">{credits.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{t('managePlan.creditsUnit')}</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Zap size={28} className="text-primary" fill="#00A651" />
          </div>
        </motion.div>

        {/* Pricing packages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {PACKAGES.map((pkg, i) => (
            <motion.div key={pkg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-5 flex flex-col transition-all ${
                pkg.popular
                  ? 'border-[#00D4FF]/50 bg-[#00D4FF]/5 shadow-lg shadow-[#00D4FF]/10'
                  : 'border-gray-800 bg-gray-900/60 hover:border-gray-700'
              }`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#00D4FF] text-gray-900 text-[11px] font-black rounded-full">
                  {t('managePlan.popular')} ⭐
                </div>
              )}

              <div className="mb-3">
                <span className="text-sm font-black text-white">{t(pkg.labelKey)}</span>
                <p className="text-[11px] text-gray-500 mt-0.5">{t(pkg.descKey)}</p>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-black" style={{ color: pkg.color }}>
                  {pkg.credits.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 ml-1">{t('managePlan.creditsUnit')}</span>
                <p className="text-lg font-bold text-white mt-1">
                  {isEn ? `$${pkg.priceUSD}` : `${(pkg.price / 1000).toFixed(0)}k đ`}
                  <span className="text-xs text-gray-500 font-normal ml-1">{t('managePlan.perMonth')}</span>
                </p>
              </div>

              <ul className="space-y-1.5 mb-5 flex-1">
                {pkg.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[12px] text-gray-400">
                    <Check size={12} style={{ color: pkg.color }} className="flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleBuy(pkg)}
                disabled={buying === pkg.id}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: pkg.popular ? pkg.color : undefined, color: pkg.popular ? '#0A0F1C' : pkg.color, border: pkg.popular ? 'none' : `1.5px solid ${pkg.color}` }}
              >
                {buying === pkg.id ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}><Zap size={14} /></motion.div> Processing...</>
                ) : (
                  <><CreditCard size={14} /> {t('managePlan.buyCredits')}</>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Purchase history */}
        <div>
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Clock size={16} className="text-gray-500" /> {t('managePlan.historyTitle')}
          </h3>
          {history.length === 0 ? (
            <p className="text-sm text-gray-600">{t('managePlan.noHistory')}</p>
          ) : (
            <div className="space-y-2">
              {[...history].reverse().map((h, i) => (
                <motion.div key={h.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-4 py-3 bg-gray-900/60 rounded-xl border border-gray-800">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{h.pkg}</p>
                    <p className="text-[11px] text-gray-500">{h.date}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">+{h.credits.toLocaleString()} ⚡</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
