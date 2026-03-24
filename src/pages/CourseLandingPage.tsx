import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Star, Clock, Users, TrendingUp,
  Play, Lock, Tag, CheckCircle, Zap,
  BookOpen, ChevronRight, ShoppingCart,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import WorkflowCard from '../components/WorkflowCard';
import { ALL_WORKFLOWS } from '../data/workflowData';
import { useCart } from '../context/CartContext';

// Block type icons & labels
const BLOCK_ICON: Record<string, string> = {
  instruction: '📖',
  input:       '✏️',
  aiPrompt:    '🤖',
  decision:    '🔀',
  output:      '🎯',
};

const BLOCK_XP: Record<string, number> = {
  instruction: 10,
  input:       25,
  aiPrompt:    30,
  decision:    20,
  output:      40,
};

const CATEGORY_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  writing:  { bg: 'rgba(59,130,246,0.15)',  text: '#60a5fa', border: 'rgba(59,130,246,0.3)'  },
  coding:   { bg: 'rgba(34,197,94,0.15)',   text: '#4ade80', border: 'rgba(34,197,94,0.3)'   },
  business: { bg: 'rgba(249,115,22,0.15)',  text: '#fb923c', border: 'rgba(249,115,22,0.3)'  },
  design:   { bg: 'rgba(236,72,153,0.15)',  text: '#f472b6', border: 'rgba(236,72,153,0.3)'  },
  data:     { bg: 'rgba(168,85,247,0.15)',  text: '#c084fc', border: 'rgba(168,85,247,0.3)'  },
  personal: { bg: 'rgba(234,179,8,0.15)',   text: '#facc15', border: 'rgba(234,179,8,0.3)'   },
  ai:       { bg: 'rgba(146,230,0,0.15)',   text: '#b3f244', border: 'rgba(146,230,0,0.3)'   },
  digital:  { bg: 'rgba(20,184,166,0.15)',  text: '#5eead4', border: 'rgba(20,184,166,0.3)'  },
};

const LEVEL_LABEL = (isEn: boolean) => ['beginner', 'intermediate', 'advanced'].map((l, i) => ({
  key: l,
  label: isEn
    ? ['Beginner', 'Intermediate', 'Advanced'][i]
    : ['Cơ bản', 'Trung cấp', 'Nâng cao'][i],
}));

function getLevelFromCategory(category: string): string {
  if (['business', 'data'].includes(category)) return 'intermediate';
  if (['coding'].includes(category)) return 'beginner';
  return 'beginner';
}

export default function CourseLandingPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const navigate = useNavigate();

  const [purchased, setPurchased] = useState(false);
  const { addToCart, isInCart } = useCart();

  const workflow = ALL_WORKFLOWS.find(w => w.id === id);
  const inCart = isInCart(workflow?.id || '');

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20 gap-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-xl font-bold text-white">
          {isEn ? 'Workflow not found' : 'Workflow không tồn tại'}
        </h1>
        <Link to="/marketplace" className="px-4 py-2 rounded-lg font-semibold text-sm"
          style={{ background: '#92e600', color: '#0b0f0c' }}>
          ← {isEn ? 'Marketplace' : 'Marketplace'}
        </Link>
      </div>
    );
  }

  const title     = isEn && workflow.titleEn ? workflow.titleEn : workflow.title;
  const desc      = isEn && workflow.descriptionEn ? workflow.descriptionEn : workflow.description;
  const catStyle  = CATEGORY_STYLE[workflow.category] || CATEGORY_STYLE.personal;
  const isFree    = workflow.price === 0;
  const level     = getLevelFromCategory(workflow.category);
  const levelObj  = LEVEL_LABEL(isEn).find(l => l.key === level);
  const totalXP   = workflow.blocks.reduce((sum, b) => sum + (BLOCK_XP[b.type] ?? 10), 0);

  const related = ALL_WORKFLOWS
    .filter(w => w.id !== workflow.id && w.category === workflow.category)
    .slice(0, 4);

  const handleJoin = () => navigate(`/workflow/${workflow.id}`);
  const handleBuy  = () => {
    // Simulate purchase flow
    setPurchased(true);
    setTimeout(() => navigate(`/workflow/${workflow.id}`), 800);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0b0f0c]" style={{ paddingTop: '4rem' }}>

        {/* ── HERO ── */}
        <div className="relative overflow-hidden">
          {/* Background blur from thumbnail */}
          <div
            className="absolute inset-0 opacity-20 blur-3xl scale-110"
            style={{ backgroundImage: `url(${workflow.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f0c]/60 via-[#0b0f0c]/80 to-[#0b0f0c]" />

          <div className="relative container-max px-4 sm:px-6 pt-6 sm:pt-8 pb-0">
            {/* Breadcrumb */}
            <Link to="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs text-[#cedde9] hover:text-white mb-6 transition-colors group">
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              {isEn ? 'Back to Marketplace' : 'Quay lại Marketplace'}
            </Link>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

              {/* Left: info */}
              <div className="flex-1 min-w-0">
                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className="pill text-[11px] font-semibold"
                    style={{ background: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.border}` }}>
                    {isEn ? workflow.category.charAt(0).toUpperCase() + workflow.category.slice(1) : workflow.category}
                  </span>
                  {levelObj && (
                    <span className="pill text-[11px] font-semibold bg-white/5 border border-white/10 text-white/80">
                      {levelObj.label}
                    </span>
                  )}
                  <span className="flex items-center gap-1 pill text-[11px] bg-white/5 border border-white/10 text-white/70">
                    <Clock size={10} />
                    {workflow.estimatedMinutes}{isEn ? ' min' : ' phút'}
                  </span>
                </div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                  {title}
                </motion.h1>

                {/* Creator row */}
                <div className="flex items-center gap-3 mb-4">
                  {workflow.creatorAvatar ? (
                    <img src={workflow.creatorAvatar} alt={workflow.creatorName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#92e600]/30" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'rgba(146,230,0,0.15)', color: '#92e600' }}>
                      {workflow.creatorName[0]}
                    </div>
                  )}
                  <span className="text-sm text-[#cedde9]">
                    {isEn ? 'by' : 'bởi'} <span className="text-white font-semibold">{workflow.creatorName}</span>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#3a4a42]" />
                  <span className="flex items-center gap-1 text-sm text-yellow-400 font-semibold">
                    <Star size={13} fill="currentColor" />
                    {workflow.rating}
                    <span className="text-[#64748b] font-normal">({workflow.ratingCount.toLocaleString()})</span>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#3a4a42]" />
                  <span className="flex items-center gap-1 text-sm text-[#cedde9]">
                    <Users size={12} />
                    {workflow.runCount.toLocaleString()} {isEn ? 'enrolled' : 'đã tham gia'}
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#8a9a92]">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-[#92e600]" />
                    {workflow.completionRate}% {isEn ? 'completion rate' : 'tỷ lệ hoàn thành'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap size={14} className="text-yellow-400" />
                    +{totalXP} XP {isEn ? 'total' : 'tổng'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-blue-400" />
                    {workflow.blocks.length} {isEn ? 'steps' : 'bước'}
                  </span>
                </div>
              </div>

              {/* Right: CTA card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full lg:w-96 flex-shrink-0 rounded-2xl border overflow-hidden"
                style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.15)' }}>

                {/* Thumbnail */}
                <div className="relative w-full aspect-video overflow-hidden">
                  <img src={workflow.thumbnail} alt={title}
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(146,230,0,0.9)', boxShadow: '0 0 30px rgba(146,230,0,0.4)' }}>
                      <Play size={22} className="ml-1" style={{ color: '#0b0f0c' }} />
                    </div>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="p-6">
                  {/* Price display */}
                  <div className="flex items-baseline gap-3 mb-5">
                    {isFree ? (
                      <span className="text-3xl font-black" style={{ color: '#92e600' }}>
                        {isEn ? 'Free' : 'Miễn phí'}
                      </span>
                    ) : (
                      <>
                        <span className="text-3xl font-black text-white">
                          {(workflow.price / 1000).toFixed(0)}K <span className="text-base font-semibold text-[#8a9a92]">VNĐ</span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Main CTA button */}
                  {isFree ? (
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(146,230,0,0.4)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleJoin}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base mb-3 transition-all"
                      style={{ background: '#92e600', color: '#0b0f0c' }}>
                      <Play size={18} className="ml-0.5" />
                      {isEn ? 'Start Workflow' : 'Bắt đầu Workflow'}
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(146,230,0,0.3)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleBuy}
                      disabled={purchased}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base mb-3 transition-all disabled:opacity-70"
                      style={{ background: '#92e600', color: '#0b0f0c' }}>
                      {purchased ? (
                        <><CheckCircle size={18} /> {isEn ? 'Purchased! Starting...' : 'Đã mua! Đang mở...'}</>
                      ) : (
                        <><ShoppingCart size={18} /> {isEn ? `Buy – ${(workflow.price / 1000).toFixed(0)}K VNĐ` : `Mua – ${(workflow.price / 1000).toFixed(0)}K VNĐ`}</>
                      )}
                    </motion.button>
                  )}

                  {/* Secondary: preview for paid */}
                  {!isFree && (
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { if (workflow) addToCart(workflow); }}
                        disabled={inCart}
                        className="w-full py-3 rounded-xl border font-semibold text-sm transition-all hover:bg-white/5 flex items-center justify-center gap-2"
                        style={{ borderColor: 'rgba(146,230,0,0.35)', color: inCart ? '#4b7a00' : '#92e600' }}>
                        <ShoppingCart size={14} />
                        {inCart
                          ? (isEn ? '✓ In Cart' : '✓ Đã vào giỏ')
                          : (isEn ? 'Add to Cart' : 'Thêm vào giỏ')}
                      </motion.button>
                      <button
                        onClick={handleJoin}
                        className="w-full py-2.5 rounded-xl text-sm transition-all hover:text-white"
                        style={{ color: '#8a9a92' }}>
                        {isEn ? 'Preview for free →' : 'Xem thử miễn phí →'}
                      </button>
                    </div>
                  )}


                  {/* Guarantees */}
                  <div className="mt-5 space-y-2">
                    {[
                      isEn ? '✓ Full lifetime access' : '✓ Truy cập trọn đời',
                      isEn ? `✓ ${workflow.blocks.length} interactive steps` : `✓ ${workflow.blocks.length} bước tương tác`,
                      isEn ? `✓ Earn +${totalXP} XP` : `✓ Nhận +${totalXP} XP`,
                      isEn ? '✓ AI Mentor included' : '✓ Kèm AI Mentor',
                    ].map(item => (
                      <p key={item} className="text-xs text-[#8a9a92]">{item}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="container-max px-4 sm:px-6 pb-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Left column: description + steps */}
            <div className="flex-1 min-w-0 space-y-8">

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border p-6"
                style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>
                <h2 className="text-base font-bold text-white mb-3">
                  {isEn ? 'About this Workflow' : 'Về Workflow này'}
                </h2>
                <p className="text-sm leading-relaxed text-[#cedde9]">{desc}</p>
                {workflow.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {workflow.tags.map(tag => (
                      <span key={tag}
                        className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full border font-medium"
                        style={{ borderColor: 'rgba(146,230,0,0.2)', color: '#92e600', background: 'rgba(146,230,0,0.05)' }}>
                        <Tag size={9} />#{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Workflow Steps */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}>
                <h2 className="text-lg font-bold text-white mb-4">
                  {isEn ? `Workflow Steps (${workflow.blocks.length})` : `Các bước Workflow (${workflow.blocks.length})`}
                </h2>
                <div className="space-y-2">
                  {workflow.blocks.map((block, idx) => (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.22 + idx * 0.05 }}
                      className="flex items-center gap-4 rounded-xl border p-4 group transition-colors hover:border-[#92e600]/20"
                      style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.08)' }}>
                      {/* Step number */}
                      <div className="w-8 h-8 rounded-full border-2 border-[#1a2119] flex items-center justify-center flex-shrink-0 text-sm font-black text-[#92e600] group-hover:border-[#92e600]/40 transition-colors">
                        {idx + 1}
                      </div>
                      {/* Icon */}
                      <span className="text-lg flex-shrink-0">{BLOCK_ICON[block.type] ?? '📌'}</span>
                      {/* Title & type */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{block.title}</p>
                        <p className="text-[11px] text-[#8a9a92] capitalize mt-0.5">
                          {block.type === 'aiPrompt' ? (isEn ? 'AI Generate' : 'AI tạo nội dung')
                            : block.type === 'instruction' ? (isEn ? 'Instruction' : 'Hướng dẫn')
                            : block.type === 'input' ? (isEn ? 'Your Input' : 'Nhập liệu')
                            : block.type === 'decision' ? (isEn ? 'Decision' : 'Lựa chọn')
                            : (isEn ? 'Output' : 'Kết quả')}
                        </p>
                      </div>
                      {/* XP badge */}
                      <span className="flex-shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(146,230,0,0.1)', color: '#92e600' }}>
                        +{BLOCK_XP[block.type] ?? 10} XP
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Total XP footer */}
                <div className="mt-3 flex items-center justify-end gap-2 text-sm text-[#8a9a92]">
                  <Zap size={13} className="text-yellow-400" />
                  {isEn ? `Total: +${totalXP} XP for completing this workflow` : `Tổng: +${totalXP} XP khi hoàn thành`}
                </div>
              </motion.div>

              {/* Related Workflows */}
              {related.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">
                      {isEn ? 'Related Workflows' : 'Workflow liên quan'}
                    </h2>
                    <Link to="/marketplace"
                      className="flex items-center gap-1 text-xs font-semibold transition-colors hover:text-white"
                      style={{ color: '#92e600' }}>
                      {isEn ? 'See all' : 'Xem tất cả'} <ChevronRight size={13} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map((wf, i) => (
                      <WorkflowCard key={wf.id} workflow={wf} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right column spacer (the CTA card is in the hero on desktop, invisible here) */}
            <div className="hidden lg:block lg:w-96 flex-shrink-0" />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
