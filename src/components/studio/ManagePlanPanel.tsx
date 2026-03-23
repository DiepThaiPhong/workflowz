import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CreditCard, Zap, Check, Clock, Sparkles } from 'lucide-react';
import useLocalStorage from '../../hooks/useLocalStorage';
import PaymentModal from '../PaymentModal';

interface Purchase {
  id: string;
  pkg: string;
  credits: number;
  price: number;
  date: string;
}

const GREEN = '#92e600';
const PANEL = '#0e150d';
const BORDER = 'rgba(146,230,0,0.15)';

const PACKAGES = [
  { id: 'starter', credits: 100, price: 99000, priceUSD: 4, labelKey: 'managePlan.pkg1Name', descKey: 'managePlan.pkg1Desc', popular: false, features: ['100 AI generations', 'Basic templates', 'Export PDF'] },
  { id: 'pro', credits: 500, price: 399000, priceUSD: 16, labelKey: 'managePlan.pkg2Name', descKey: 'managePlan.pkg2Desc', popular: true, features: ['500 AI generations', 'All templates', 'Priority support', 'Team sharing'] },
  { id: 'studio', credits: 1000, price: 699000, priceUSD: 28, labelKey: 'managePlan.pkg3Name', descKey: 'managePlan.pkg3Desc', popular: false, features: ['1000 AI generations', 'Custom branding', 'Analytics dashboard', 'API access'] },
];

// Simple confetti burst
const Confetti = ({ onDone }: { onDone: () => void }) => {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: i % 2 === 0 ? GREEN : '#ffffff',
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
  const [selectedPackage, setSelectedPackage] = useState<typeof PACKAGES[0] | null>(null);

  const handlePaymentSuccess = () => {
    if (!selectedPackage) return;
    
    setCredits(c => c + selectedPackage.credits);
    setHistory(h => [...h, {
      id: Date.now().toString(),
      pkg: t(selectedPackage.labelKey),
      credits: selectedPackage.credits,
      price: selectedPackage.price,
      date: new Date().toLocaleDateString(isEn ? 'en-US' : 'vi-VN'),
    }]);
    setShowConfetti(true);
    setSuccessMsg(t('managePlan.success'));
    setTimeout(() => setSuccessMsg(''), 3000);
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-full p-6" style={{ background: '#0b0f0c' }}>
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      {/* Payment Modal */}
      {selectedPackage && (
        <PaymentModal
          isOpen={!!selectedPackage}
          onClose={() => setSelectedPackage(null)}
          package_={selectedPackage}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Success message */}
      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2"
            style={{ background: GREEN, color: '#0b0f0c' }}>
            <Sparkles size={16} /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        {/* Header + Balance */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-1">{t('managePlan.title')}</h2>
          <p className="text-[#e9eff5] text-sm">{t('managePlan.subtitle')}</p>
        </div>

        {/* Current credits card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-8 flex items-center justify-between"
          style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
          <div>
            <p className="text-sm text-[#e9eff5] mb-1">{t('managePlan.currentCredits')}</p>
            <p className="text-5xl font-black" style={{ color: GREEN }}>{credits.toLocaleString()}</p>
            <p className="text-sm text-[#cedde9] mt-1">{t('managePlan.creditsUnit')}</p>
          </div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(146,230,0,0.15)' }}>
            <Zap size={28} style={{ color: GREEN }} fill={GREEN} />
          </div>
        </motion.div>

        {/* Pricing packages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {PACKAGES.map((pkg, i) => (
            <motion.div key={pkg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl p-5 flex flex-col transition-all"
              style={{
                background: pkg.popular ? 'rgba(146,230,0,0.08)' : PANEL,
                border: pkg.popular ? '1.5px solid rgba(146,230,0,0.5)' : `1px solid ${BORDER}`,
              }}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[11px] font-black rounded-full"
                  style={{ background: GREEN, color: '#0b0f0c' }}>
                  {t('managePlan.popular')} ⭐
                </div>
              )}

              <div className="mb-3">
                <span className="text-sm font-black text-white">{t(pkg.labelKey)}</span>
                <p className="text-[11px] text-[#cedde9] mt-0.5">{t(pkg.descKey)}</p>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-black text-white">
                  {pkg.credits.toLocaleString()}
                </span>
                <span className="text-sm text-[#cedde9] ml-1">{t('managePlan.creditsUnit')}</span>
                <p className="text-lg font-bold text-white mt-1">
                  {isEn ? `$${pkg.priceUSD}` : `${(pkg.price / 1000).toFixed(0)}k đ`}
                  <span className="text-xs text-[#cedde9] font-normal ml-1">{t('managePlan.perMonth')}</span>
                </p>
              </div>

              <ul className="space-y-1.5 mb-5 flex-1">
                {pkg.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[12px] text-[#e9eff5]">
                    <Check size={12} style={{ color: GREEN }} className="flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedPackage(pkg)}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                style={{
                  background: pkg.popular ? GREEN : 'transparent',
                  color: pkg.popular ? '#0b0f0c' : GREEN,
                  border: pkg.popular ? 'none' : `1.5px solid ${GREEN}`
                }}
              >
                <CreditCard size={14} /> {t('managePlan.buyCredits')}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Purchase history */}
        <div>
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Clock size={16} className="text-[#cedde9]" /> {t('managePlan.historyTitle')}
          </h3>
          {history.length === 0 ? (
            <p className="text-sm text-[#cedde9]">{t('managePlan.noHistory')}</p>
          ) : (
            <div className="space-y-2">
              {[...history].reverse().map((h, i) => (
                <motion.div key={h.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl"
                  style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(146,230,0,0.1)' }}>
                    <Zap size={14} style={{ color: GREEN }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{h.pkg}</p>
                    <p className="text-[11px] text-[#cedde9]">{h.date}</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: GREEN }}>+{h.credits.toLocaleString()} ⚡</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
