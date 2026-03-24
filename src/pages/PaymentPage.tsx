import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CreditCard, Lock, CheckCircle, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PageTransition from '../components/PageTransition';

// Simple confetti particle
function ConfettiParticle({ x, color, delay }: { x: number; color: string; delay: number }) {
  return (
    <motion.div
      className="fixed top-0 w-2 h-2 rounded-sm z-50 pointer-events-none"
      style={{ left: `${x}%`, background: color }}
      initial={{ y: -10, opacity: 1, rotate: 0, scale: 1 }}
      animate={{ y: '110vh', opacity: 0, rotate: 720, scale: 0.5 }}
      transition={{ duration: 2.5 + Math.random(), delay, ease: 'easeIn' }}
    />
  );
}

const CONFETTI_COLORS = ['#92e600', '#60a5fa', '#a78bfa', '#fb923c', '#f472b6', '#facc15'];

export default function PaymentPage() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', card: '', expiry: '', cvv: '' });
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confetti, setConfetti] = useState<{ x: number; color: string; delay: number }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = isEn ? 'Required' : 'Bắt buộc';
    if (form.card.replace(/\s/g, '').length < 16) e.card = isEn ? 'Invalid card' : 'Thẻ không hợp lệ';
    if (form.expiry.length < 5) e.expiry = isEn ? 'Invalid date' : 'Ngày không hợp lệ';
    if (form.cvv.length < 3) e.cvv = isEn ? 'Invalid CVV' : 'CVV không hợp lệ';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setPaying(true);
    await new Promise(r => setTimeout(r, 1800));
    // Generate confetti
    setConfetti(
      Array.from({ length: 60 }, (_, i) => ({
        x: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.5,
      }))
    );
    setPaying(false);
    setSuccess(true);
    clearCart();
  };

  if (success) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#0b0f0c] flex items-center justify-center" style={{ paddingTop: '4rem' }}>
          {/* Confetti */}
          <AnimatePresence>
            {confetti.map((p, i) => <ConfettiParticle key={i} {...p} />)}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-center px-8 max-w-md">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: '#92e600', boxShadow: '0 0 40px rgba(146,230,0,0.4)' }}>
              <CheckCircle size={40} color="#0b0f0c" />
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-2">
              {isEn ? '🎉 Payment Successful!' : '🎉 Thanh toán thành công!'}
            </h1>
            <p className="text-[#cedde9] mb-8">
              {isEn ? 'Your workflows are now unlocked. Happy learning!' : 'Workflow đã được mở khóa. Chúc bạn học vui!'}
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-xl font-bold text-sm transition-all"
                style={{ background: '#92e600', color: '#0b0f0c' }}>
                {isEn ? 'Go to My Learning' : 'Vào Học của tôi'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/marketplace')}
                className="px-6 py-3 rounded-xl font-bold text-sm border transition-all"
                style={{ borderColor: 'rgba(146,230,0,0.3)', color: '#92e600' }}>
                {isEn ? 'Browse More' : 'Khám phá thêm'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0b0f0c]" style={{ paddingTop: '4rem' }}>
        <div className="container-max px-4 sm:px-6 py-10 max-w-xl mx-auto">

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(146,230,0,0.1)' }}>
              <CreditCard size={20} style={{ color: '#92e600' }} />
            </div>
            <h1 className="text-2xl font-black text-white">
              {isEn ? 'Checkout' : 'Thanh toán'}
            </h1>
          </div>

          {/* Order summary */}
          <div className="rounded-2xl border p-4 mb-6"
            style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>
            {items.map(({ workflow }) => (
              <div key={workflow.id} className="flex justify-between text-sm text-[#cedde9] py-1">
                <span className="truncate mr-4">{workflow.titleEn || workflow.title}</span>
                <span className="font-semibold flex-shrink-0">
                  {workflow.price === 0 ? 'Free' : `${(workflow.price / 1000).toFixed(0)}K VNĐ`}
                </span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 flex justify-between" style={{ borderColor: 'rgba(146,230,0,0.1)' }}>
              <span className="font-bold text-white text-sm">{isEn ? 'Total' : 'Tổng'}</span>
              <span className="font-black text-sm" style={{ color: '#92e600' }}>
                {total === 0 ? 'Free' : `${(total / 1000).toFixed(0)}K VNĐ`}
              </span>
            </div>
          </div>

          {/* Payment form */}
          <div className="rounded-2xl border p-6 space-y-4"
            style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Lock size={13} style={{ color: '#92e600' }} />
              <span className="text-xs text-[#8a9a92]">
                {isEn ? 'Mock payment — no real charge' : 'Thanh toán giả lập — không trừ tiền thật'}
              </span>
            </div>

            {([
              { key: 'name', label: isEn ? 'Cardholder Name' : 'Tên chủ thẻ', placeholder: 'Nguyen Van A', type: 'text', format: (v: string) => v },
              { key: 'card', label: isEn ? 'Card Number' : 'Số thẻ', placeholder: '1234 5678 9012 3456', type: 'text', format: formatCard },
              { key: 'expiry', label: isEn ? 'Expiry' : 'Ngày hết hạn', placeholder: 'MM/YY', type: 'text', format: formatExpiry },
              { key: 'cvv', label: 'CVV', placeholder: '123', type: 'password', format: (v: string) => v.replace(/\D/g, '').slice(0, 3) },
            ] as const).map(({ key, label, placeholder, type, format }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-[#8a9a92] mb-1.5 uppercase tracking-wider">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => { setForm(p => ({ ...p, [key]: format(e.target.value) })); setErrors(p => ({ ...p, [key]: '' })); }}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border text-sm text-white placeholder-[#3a4a42] outline-none transition-colors"
                  style={{
                    background: '#0b0f0c',
                    borderColor: errors[key] ? '#ef4444' : form[key] ? 'rgba(146,230,0,0.4)' : 'rgba(146,230,0,0.15)',
                  }}
                />
                {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
              </div>
            ))}

            <motion.button
              whileHover={!paying ? { scale: 1.02, boxShadow: '0 0 24px rgba(146,230,0,0.35)' } : {}}
              whileTap={!paying ? { scale: 0.97 } : {}}
              onClick={handlePay}
              disabled={paying}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all disabled:opacity-70"
              style={{ background: '#92e600', color: '#0b0f0c' }}>
              {paying ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9 }}
                    className="w-4 h-4 border-2 border-[#0b0f0c]/30 border-t-[#0b0f0c] rounded-full" />
                  {isEn ? 'Processing...' : 'Đang xử lý...'}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  {isEn
                    ? `Pay ${total === 0 ? '(Free)' : `${(total / 1000).toFixed(0)}K VNĐ`}`
                    : `Thanh toán ${total === 0 ? '(Miễn phí)' : `${(total / 1000).toFixed(0)}K VNĐ`}`}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
