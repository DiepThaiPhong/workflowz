import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingCart, Trash2, ArrowRight, Package,
  CreditCard, Lock, CheckCircle, Sparkles,
  Star, Play, ChevronRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ALL_WORKFLOWS } from '../data/workflowData';
import PageTransition from '../components/PageTransition';

/* ── Confetti ───────────────────────────────────────────────────────────── */
const CONFETTI_COLORS = ['#92e600', '#60a5fa', '#a78bfa', '#fb923c', '#f472b6', '#facc15'];
function ConfettiParticle({ x, color, delay }: { x: number; color: string; delay: number }) {
  return (
    <motion.div className="fixed top-0 w-2 h-2 rounded-sm z-[999] pointer-events-none"
      style={{ left: `${x}%`, background: color }}
      initial={{ y: -10, opacity: 1, rotate: 0 }}
      animate={{ y: '110vh', opacity: 0, rotate: 720 }}
      transition={{ duration: 2 + Math.random() * 1, delay, ease: 'easeIn' }} />
  );
}

/* ── Utils ──────────────────────────────────────────────────────────────── */
const formatCard   = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d; };
const GREEN  = '#92e600';
const PANEL  = '#0e150d';
const BORDER = 'rgba(146,230,0,0.12)';

/* ── Recommendation data ────────────────────────────────────────────────── */
const RECS = [
  {
    id: 'rec-chatbot',
    title: 'Build Your First AI Chatbot',
    titleVi: 'Xây dựng AI Chatbot đầu tiên',
    price: 0,
    rating: 4.9,
    ratingCount: 1240,
    category: 'AI',
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80',
  },
  {
    id: 'rec-datavis',
    title: 'Data Visualization with Python',
    titleVi: 'Trực quan hóa dữ liệu với Python',
    price: 39000,
    rating: 4.7,
    ratingCount: 867,
    category: 'Data',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
  },
  {
    id: 'rec-email',
    title: 'Professional Email Mastery',
    titleVi: 'Viết Email Chuyên Nghiệp',
    price: 0,
    rating: 4.8,
    ratingCount: 3210,
    category: 'Writing',
    thumbnail: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80',
  },
  {
    id: 'rec-bizplan',
    title: 'Business Plan Generator',
    titleVi: 'Tạo Kế Hoạch Kinh Doanh',
    price: 49000,
    rating: 4.6,
    ratingCount: 540,
    category: 'Business',
    thumbnail: 'https://images.unsplash.com/photo-1664575262619-b28fef7a40a4?w=400&q=80',
  },
  {
    id: 'rec-cv',
    title: 'CV Builder with AI',
    titleVi: 'Tạo CV bằng AI',
    price: 0,
    rating: 4.9,
    ratingCount: 2890,
    category: 'Career',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80',
  },
];

// Pick 4-5 from ALL_WORKFLOWS that the user doesn't already have in cart
function getRecommendations(cartIds: string[]) {
  const fromData = ALL_WORKFLOWS.filter(w => !cartIds.includes(w.id)).slice(0, 3);
  const extra = RECS.filter(r => !cartIds.includes(r.id)).slice(0, 5 - fromData.length);
  return { fromData, extra };
}

/* ════════════════════════════════════════════════
   CartPage
   ════════════════════════════════════════════════ */
export default function CartPage() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const { items, removeFromCart, total, clearCart, addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', card: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confetti, setConfetti] = useState<{ x: number; color: string; delay: number }[]>([]);

  const cartIds = items.map(i => i.workflow.id);
  const { fromData, extra } = getRecommendations(cartIds);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())                       e.name   = isEn ? 'Required'         : 'Bắt buộc';
    if (form.card.replace(/\s/g,'').length < 16) e.card   = isEn ? 'Invalid card'     : 'Số thẻ không hợp lệ';
    if (form.expiry.length < 5)                  e.expiry = isEn ? 'e.g. 12/28'       : 'VD: 12/28';
    if (form.cvv.length < 3)                     e.cvv    = isEn ? '3 digits required': 'Cần 3 chữ số';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (items.length === 0 || !validate()) return;
    setPaying(true);
    await new Promise(r => setTimeout(r, 1800));
    setConfetti(Array.from({ length: 70 }, (_, i) => ({
      x: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.4,
    })));
    clearCart();
    setPaying(false);
    setSuccess(true);
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#0b0f0c] flex items-center justify-center" style={{ paddingTop: '4rem' }}>
          <AnimatePresence>{confetti.map((p, i) => <ConfettiParticle key={i} {...p} />)}</AnimatePresence>
          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            className="text-center px-8 max-w-sm">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: GREEN, boxShadow: '0 0 40px rgba(146,230,0,0.5)' }}>
              <CheckCircle size={38} color="#0b0f0c" />
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-2">
              {isEn ? '🎉 Payment Successful!' : '🎉 Thanh toán thành công!'}
            </h1>
            <p className="text-[#cedde9] mb-8">
              {isEn ? 'Your workflows are unlocked. Enjoy!' : 'Workflow đã mở khóa. Học vui nhé!'}
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-xl font-bold text-sm"
                style={{ background: GREEN, color: '#0b0f0c' }}>
                {isEn ? 'My Learning' : 'Học của tôi'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/marketplace')}
                className="px-6 py-3 rounded-xl font-bold text-sm border"
                style={{ borderColor: 'rgba(146,230,0,0.3)', color: GREEN }}>
                {isEn ? 'Browse More' : 'Khám phá thêm'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  /* ── Main page ── */
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0b0f0c]" style={{ paddingTop: '4rem' }}>
        <div className="container-max px-4 sm:px-6 py-8">

          {/* Page title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(146,230,0,0.1)' }}>
              <ShoppingCart size={20} style={{ color: GREEN }} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                {isEn ? 'Cart & Checkout' : 'Giỏ hàng & Thanh toán'}
              </h1>
              <p className="text-sm text-[#8a9a92]">
                {items.length} {isEn ? 'item(s)' : 'sản phẩm'}
              </p>
            </div>
          </div>

          {/* ── Steam 2/3 + 1/3 layout ── */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* LEFT 2/3 — Cart items */}
            <div className="w-full lg:flex-[2] min-w-0">
              {items.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border p-16 text-center"
                  style={{ background: PANEL, borderColor: BORDER }}>
                  <Package size={48} className="mx-auto mb-4" style={{ color: '#3a4a42' }} />
                  <p className="text-lg font-bold text-white mb-1">
                    {isEn ? 'Your cart is empty' : 'Giỏ hàng trống'}
                  </p>
                  <p className="text-sm text-[#8a9a92] mb-6">
                    {isEn ? 'Add paid workflows from the marketplace.' : 'Thêm workflow từ Marketplace.'}
                  </p>
                  <Link to="/marketplace"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
                    style={{ background: GREEN, color: '#0b0f0c' }}>
                    {isEn ? 'Browse Marketplace' : 'Khám phá Marketplace'}
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ) : (
                <div className="rounded-2xl border overflow-hidden"
                  style={{ background: PANEL, borderColor: BORDER }}>
                  <div className="flex items-center px-5 py-3 border-b text-xs font-semibold uppercase tracking-wider text-[#8a9a92]"
                    style={{ borderColor: BORDER }}>
                    <span className="flex-1">{isEn ? 'Item' : 'Sản phẩm'}</span>
                    <span className="w-20 text-right">{isEn ? 'Price' : 'Giá'}</span>
                    <span className="w-10" />
                  </div>
                  <AnimatePresence>
                    {items.map(({ workflow }, idx) => (
                      <motion.div key={workflow.id} layout
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        transition={{ delay: idx * 0.04 }}
                        className="flex items-center gap-4 px-5 py-4 border-b last:border-0 hover:bg-white/[0.02] transition-colors"
                        style={{ borderColor: BORDER }}>
                        <img src={workflow.thumbnail} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0 ring-1 ring-white/10" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{workflow.titleEn || workflow.title}</p>
                          <p className="text-xs text-[#8a9a92] mt-0.5">{workflow.creatorName}</p>
                          <p className="text-[10px] text-[#8a9a92] mt-0.5 capitalize">{workflow.category}</p>
                        </div>
                        <div className="w-20 text-right flex-shrink-0">
                          {workflow.price === 0
                            ? <span className="text-sm font-black" style={{ color: GREEN }}>Free</span>
                            : <span className="text-sm font-black text-white">{(workflow.price/1000).toFixed(0)}K</span>}
                        </div>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(workflow.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#3a4a42] hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0">
                          <Trash2 size={14} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div className="px-5 py-3 text-xs text-[#8a9a92] border-t flex items-center gap-1.5"
                    style={{ borderColor: BORDER }}>
                    <Lock size={10} style={{ color: GREEN }} />
                    {isEn ? 'All purchases include lifetime access' : 'Tất cả giao dịch bao gồm truy cập trọn đời'}
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════
                  RECOMMENDATIONS FOR YOU — inside left 2/3 column
                  ══════════════════════════════════════════════════════ */}
              <motion.section
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-8">

                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-widest" style={{ color: GREEN }}>
                      {isEn ? 'Recommendations for You' : 'Gợi ý cho bạn'}
                    </h2>
                    <p className="text-xs text-[#8a9a92] mt-0.5">
                      {isEn ? 'Based on popular workflows' : 'Dựa trên workflow phổ biến'}
                    </p>
                  </div>
                  <Link to="/marketplace"
                    className="flex items-center gap-1 text-xs font-semibold transition-colors hover:text-white"
                    style={{ color: GREEN }}>
                    {isEn ? 'View all' : 'Xem tất cả'}
                    <ChevronRight size={12} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {fromData.map((wf, i) => {
                    const inCart = isInCart(wf.id);
                    return (
                      <motion.div key={wf.id}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.07 }}
                        className="rounded-2xl border overflow-hidden group cursor-pointer transition-all hover:border-[#92e600]/30 hover:-translate-y-1"
                        style={{ background: PANEL, borderColor: BORDER }}>
                        <Link to={`/course/${wf.id}`}>
                          <div className="relative aspect-video overflow-hidden">
                            <img src={wf.thumbnail} alt={wf.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            {wf.price === 0
                              ? <span className="absolute top-2 right-2 text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: GREEN, color: '#0b0f0c' }}>FREE</span>
                              : <span className="absolute top-2 right-2 text-[10px] font-black px-1.5 py-0.5 rounded bg-white/10 text-white backdrop-blur-sm">{(wf.price/1000).toFixed(0)}K</span>}
                          </div>
                        </Link>
                        <div className="p-3">
                          <p className="text-xs font-bold text-white leading-tight mb-1 line-clamp-2">
                            {isEn && wf.titleEn ? wf.titleEn : wf.title}
                          </p>
                          <div className="flex items-center gap-1 mb-2">
                            <Star size={9} fill="#facc15" className="text-yellow-400" />
                            <span className="text-[10px] font-semibold text-yellow-400">{wf.rating}</span>
                            <span className="text-[10px] text-[#8a9a92]">({wf.ratingCount.toLocaleString()})</span>
                          </div>
                          <button
                            onClick={() => { if(!inCart && wf.price > 0) addToCart(wf); }}
                            className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                            style={wf.price === 0
                              ? { background: 'rgba(146,230,0,0.1)', color: GREEN, border: `1px solid rgba(146,230,0,0.2)` }
                              : inCart
                                ? { background: 'rgba(146,230,0,0.08)', color: '#4b7a00', border: `1px solid rgba(146,230,0,0.1)` }
                                : { background: GREEN, color: '#0b0f0c' }}>
                            {wf.price === 0
                              ? <><Play size={9} /> {isEn ? 'Run Now' : 'Chạy ngay'}</>
                              : inCart
                                ? <>{isEn ? '✓ In Cart' : '✓ Đã thêm'}</>
                                : <><ShoppingCart size={9} /> {isEn ? 'Add to Cart' : 'Thêm vào giỏ'}</>}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                  {extra.map((rec, i) => (
                    <motion.div key={rec.id}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + (fromData.length + i) * 0.07 }}
                      className="rounded-2xl border overflow-hidden group cursor-pointer transition-all hover:border-[#92e600]/30 hover:-translate-y-1"
                      style={{ background: PANEL, borderColor: BORDER }}>
                      <Link to="/marketplace">
                        <div className="relative aspect-video overflow-hidden">
                          <img src={rec.thumbnail} alt={rec.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          {rec.price === 0
                            ? <span className="absolute top-2 right-2 text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: GREEN, color: '#0b0f0c' }}>FREE</span>
                            : <span className="absolute top-2 right-2 text-[10px] font-black px-1.5 py-0.5 rounded bg-white/10 text-white backdrop-blur-sm">{(rec.price/1000).toFixed(0)}K</span>}
                        </div>
                      </Link>
                      <div className="p-3">
                        <p className="text-xs font-bold text-white leading-tight mb-1 line-clamp-2">
                          {isEn ? rec.title : rec.titleVi}
                        </p>
                        <div className="flex items-center gap-1 mb-2">
                          <Star size={9} fill="#facc15" className="text-yellow-400" />
                          <span className="text-[10px] font-semibold text-yellow-400">{rec.rating}</span>
                          <span className="text-[10px] text-[#8a9a92]">({rec.ratingCount.toLocaleString()})</span>
                        </div>
                        <Link to="/marketplace"
                          className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                          style={rec.price === 0
                            ? { background: 'rgba(146,230,0,0.1)', color: GREEN, border: `1px solid rgba(146,230,0,0.2)` }
                            : { background: GREEN, color: '#0b0f0c' }}>
                          {rec.price === 0
                            ? <><Play size={9} /> {isEn ? 'Run Now' : 'Chạy ngay'}</>
                            : <><ShoppingCart size={9} /> {isEn ? 'Add to Cart' : 'Thêm vào giỏ'}</>}
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

            </div>

            {/* RIGHT 1/3 — Order summary + checkout (sticky) */}
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
              <div className="sticky top-[4.5rem] rounded-2xl border overflow-hidden"
                style={{ background: PANEL, borderColor: BORDER }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}>
                  <h2 className="font-bold text-white flex items-center gap-2">
                    <CreditCard size={15} style={{ color: GREEN }} />
                    {isEn ? 'Order Summary' : 'Tóm tắt đơn hàng'}
                  </h2>
                </div>
                <div className="px-5 py-4 space-y-4">
                  {items.length > 0 && (
                    <div className="space-y-2">
                      {items.map(({ workflow }) => (
                        <div key={workflow.id} className="flex justify-between text-xs">
                          <span className="truncate text-[#cedde9] mr-3">{workflow.titleEn || workflow.title}</span>
                          <span className="font-semibold text-white flex-shrink-0">
                            {workflow.price === 0 ? 'Free' : `${(workflow.price/1000).toFixed(0)}K`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-t border-b" style={{ borderColor: BORDER }}>
                    <span className="font-bold text-white text-sm">{isEn ? 'Total' : 'Tổng'}</span>
                    <span className="text-xl font-black" style={{ color: GREEN }}>
                      {total === 0 ? 'Free' : `${(total/1000).toFixed(0)}K VNĐ`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8a9a92]">
                    <Lock size={10} style={{ color: GREEN }} />
                    {isEn ? 'Mock checkout – no real charge' : 'Giả lập – không trừ tiền thật'}
                  </div>
                  <div className="space-y-2.5">
                    {([
                      { key: 'name',   label: isEn ? 'Cardholder Name' : 'Tên chủ thẻ', ph: 'Nguyen Van A',        type: 'text',     fmt: (v: string) => v },
                      { key: 'card',   label: isEn ? 'Card Number'     : 'Số thẻ',       ph: '1234 5678 9012 3456', type: 'text',     fmt: formatCard },
                      { key: 'expiry', label: isEn ? 'Expiry'          : 'Ngày hết hạn', ph: 'MM/YY',               type: 'text',     fmt: formatExpiry },
                      { key: 'cvv',    label: 'CVV',                                      ph: '123',                 type: 'password', fmt: (v: string) => v.replace(/\D/g,'').slice(0,3) },
                    ] as const).map(({ key, label, ph, type, fmt }) => (
                      <div key={key}>
                        <label className="block text-[10px] font-bold text-[#8a9a92] uppercase tracking-wider mb-1">{label}</label>
                        <input type={type} value={form[key]}
                          onChange={e => { setForm(p => ({ ...p, [key]: fmt(e.target.value) })); setErrors(p => ({ ...p, [key]: '' })); }}
                          placeholder={ph}
                          className="w-full px-3 py-2.5 rounded-xl border text-sm text-white placeholder-[#3a4a42] outline-none transition-colors"
                          style={{ background: '#0b0f0c', borderColor: errors[key] ? '#ef4444' : form[key] ? 'rgba(146,230,0,0.5)' : 'rgba(146,230,0,0.15)' }} />
                        {errors[key] && <p className="text-[10px] text-red-400 mt-0.5">{errors[key]}</p>}
                      </div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={!paying && items.length > 0 ? { scale: 1.02, boxShadow: '0 0 24px rgba(146,230,0,0.4)' } : {}}
                    whileTap={!paying && items.length > 0 ? { scale: 0.97 } : {}}
                    onClick={handlePay} disabled={paying || items.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                    style={{ background: GREEN, color: '#0b0f0c' }}>
                    {paying ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9 }}
                          className="w-4 h-4 border-2 border-[#0b0f0c]/30 border-t-[#0b0f0c] rounded-full" />
                        {isEn ? 'Processing...' : 'Đang xử lý...'}
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} />
                        {items.length === 0
                          ? (isEn ? 'Cart is empty' : 'Giỏ hàng trống')
                          : `${isEn ? 'Pay' : 'Thanh toán'} ${total === 0 ? '(Free)' : `${(total/1000).toFixed(0)}K VNĐ`}`}
                      </>
                    )}
                  </motion.button>
                  <Link to="/marketplace"
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors hover:text-white"
                    style={{ color: '#8a9a92' }}>
                    <ArrowRight size={11} />
                    {isEn ? 'Continue Shopping' : 'Tiếp tục mua sắm'}
                  </Link>
                </div>
              </div>
            </div>
          </div>



        </div>
      </div>
    </PageTransition>
  );
}
