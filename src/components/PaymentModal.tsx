import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, CreditCard, Lock, Check, Shield } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  package_: {
    id: string;
    credits: number;
    price: number;
    priceUSD: number;
    labelKey: string;
  };
  onSuccess: () => void;
}

const ACCENT = '#92e600';

export default function PaymentModal({ isOpen, onClose, package_, onSuccess }: PaymentModalProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Stripe API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsSuccess(true);

    setTimeout(() => {
      onSuccess();
      onClose();
      // Reset state
      setCardNumber('');
      setExpiry('');
      setCvc('');
      setName('');
      setIsSuccess(false);
    }, 1500);
  };

  const isValid = cardNumber.replace(/\s/g, '').length >= 16 &&
    expiry.length === 5 &&
    cvc.length >= 3 &&
    name.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(11,15,12,0.85)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#161d19] rounded-2xl shadow-2xl overflow-hidden border border-[rgba(146,230,0,0.12)]"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-[rgba(146,230,0,0.12)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ACCENT }}>
                  <CreditCard size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{t('payment.title')}</h2>
                  <p className="text-sm text-[#a3c0d6]">{t('payment.secureCheckout')}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[rgba(146,230,0,0.1)] transition-colors"
              >
                <X size={20} className="text-[#a3c0d6]" />
              </button>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: ACCENT }}
                >
                  <Check size={40} className="text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {t('payment.success')}
                </h3>
                <p className="text-[#a3c0d6]">
                  {t('payment.creditsAdded')}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                {/* Order Summary */}
                <div className="mb-6 p-4 rounded-xl bg-[#101612] border border-[rgba(146,230,0,0.12)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#a3c0d6]">{t('payment.package')}</p>
                      <p className="font-bold text-white">{t(package_.labelKey)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black" style={{ color: ACCENT }}>
                        {package_.credits.toLocaleString()}
                      </p>
                      <p className="text-sm text-[#a3c0d6]">{t('managePlan.creditsUnit')}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[rgba(146,230,0,0.12)] flex justify-between items-center">
                    <span className="text-[#a3c0d6]">{t('payment.total')}</span>
                    <span className="text-xl font-bold text-white">
                      {isEn ? `$${package_.priceUSD.toFixed(2)}` : `${package_.price.toLocaleString('vi-VN')}đ`}
                    </span>
                  </div>
                </div>

                {/* Card Form */}
                <div className="space-y-4">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-[#e9eff5] mb-1.5">
                      {t('payment.cardNumber')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-3 rounded-xl border border-[rgba(146,230,0,0.12)] bg-[#101612] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#92e600] focus:border-transparent transition-all"
                      />
                      <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#e9eff5] mb-1.5">
                      {t('payment.cardName')}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('payment.cardNamePlaceholder')}
                      className="w-full px-4 py-3 rounded-xl border border-[rgba(146,230,0,0.12)] bg-[#101612] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#92e600] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Expiry & CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#e9eff5] mb-1.5">
                        {t('payment.expiry')}
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 rounded-xl border border-[rgba(146,230,0,0.12)] bg-[#101612] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#92e600] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#e9eff5] mb-1.5">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-4 py-3 rounded-xl border border-[rgba(146,230,0,0.12)] bg-[#101612] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#92e600] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-4 flex items-center gap-2 text-sm text-[#a3c0d6]">
                  <Lock size={14} />
                  <span>{t('payment.secureNote')}</span>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!isValid || isProcessing}
                  whileHover={{ scale: isValid && !isProcessing ? 1.02 : 1 }}
                  whileTap={{ scale: isValid && !isProcessing ? 0.98 : 1 }}
                  className="w-full mt-6 py-4 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: isValid && !isProcessing ? ACCENT : '#9ca3af' }}
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        <CreditCard size={20} />
                      </motion.div>
                      {t('payment.processing')}
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      {t('payment.pay')} {isEn ? `$${package_.priceUSD.toFixed(2)}` : `${package_.price.toLocaleString('vi-VN')}đ`}
                    </>
                  )}
                </motion.button>

                {/* Stripe Notice */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#a3c0d6]">
                  <Shield size={14} />
                  <span>{t('payment.poweredBy')}</span>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
