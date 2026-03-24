import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Star, Clock, Users, TrendingUp,
  Play, Tag, CheckCircle, Zap,
  BookOpen, ChevronRight, ShoppingCart,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import WorkflowCard from '../components/WorkflowCard';
import { ALL_WORKFLOWS } from '../data/workflowData';
import { useCart } from '../context/CartContext';

const BLOCK_ICON: Record<string, string> = {
  instruction: '📖',
  input:       '✏️',
  aiPrompt:    '🤖',
  decision:    '🔀',
  output:      '🎯',
};
const BLOCK_XP: Record<string, number> = {
  instruction: 10, input: 25, aiPrompt: 30, decision: 20, output: 40,
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
const LEVEL_MAP: Record<string, { en: string; vi: string }> = {
  beginner:     { en: 'Beginner',     vi: 'Cơ bản'    },
  intermediate: { en: 'Intermediate', vi: 'Trung cấp' },
  advanced:     { en: 'Advanced',     vi: 'Nâng cao'  },
};
function getLevel(category: string) {
  if (['business', 'data'].includes(category)) return 'intermediate';
  return 'beginner';
}

export default function CourseLandingPage() {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  const [purchased, setPurchased] = useState(false);

  const workflow = ALL_WORKFLOWS.find(w => w.id === id);
  const inCart = isInCart(workflow?.id ?? '');

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20 gap-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-xl font-bold text-white">
          {isEn ? 'Workflow not found' : 'Workflow không tồn tại'}
        </h1>
        <Link to="/marketplace" className="px-4 py-2 rounded-lg font-semibold text-sm"
          style={{ background: '#92e600', color: '#0b0f0c' }}>
          ← Marketplace
        </Link>
      </div>
    );
  }

  const title     = isEn && workflow.titleEn ? workflow.titleEn : workflow.title;
  const desc      = isEn && workflow.descriptionEn ? workflow.descriptionEn : workflow.description;
  const catStyle  = CATEGORY_STYLE[workflow.category] || CATEGORY_STYLE.personal;
  const isFree    = workflow.price === 0;
  const level     = getLevel(workflow.category);
  const levelLabel = LEVEL_MAP[level]?.[isEn ? 'en' : 'vi'] ?? '';
  const totalXP   = workflow.blocks.reduce((s, b) => s + (BLOCK_XP[b.type] ?? 10), 0);
  const related   = ALL_WORKFLOWS.filter(w => w.id !== workflow.id && w.category === workflow.category).slice(0, 4);

  const handleJoin = () => navigate(`/workflow/${workflow.id}`);
  const handleBuy  = () => {
    setPurchased(true);
    setTimeout(() => navigate(`/workflow/${workflow.id}`), 800);
  };

  return (
    <PageTransition>
      {/* Thin decorative gradient backdrop */}
      <div className="min-h-screen bg-[#0b0f0c]" style={{ paddingTop: '4rem' }}>

        {/* Subtle top glow */}
        <div className="pointer-events-none absolute top-16 inset-x-0 h-72 opacity-25"
          style={{ backgroundImage: `url(${workflow.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(60px)' }} />
        <div className="pointer-events-none absolute top-16 inset-x-0 h-72"
          style={{ background: 'linear-gradient(to bottom, rgba(11,15,12,0.5) 0%, #0b0f0c 100%)' }} />

        {/* Main container */}
        <div className="relative container-max px-4 sm:px-6 py-6 pb-14">

          {/* Breadcrumb */}
          <Link to="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs text-[#cedde9] hover:text-white mb-5 transition-colors group">
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            {isEn ? 'Back to Marketplace' : 'Quay lại Marketplace'}
          </Link>

          {/* 2-Column layout — this is the entire page */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

            {/* ── LEFT COLUMN: everything ── */}
            <div className="flex-1 min-w-0">

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="pill text-[11px] font-semibold"
                  style={{ background: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.border}` }}>
                  {isEn ? workflow.category.charAt(0).toUpperCase() + workflow.category.slice(1) : workflow.category}
                </span>
                <span className="pill text-[11px] font-semibold bg-white/5 border border-white/10 text-white/80">
                  {levelLabel}
                </span>
                <span className="flex items-center gap-1 pill text-[11px] bg-white/5 border border-white/10 text-white/70">
                  <Clock size={10} />
                  {workflow.estimatedMinutes}{isEn ? ' min' : ' phút'}
                </span>
              </div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 leading-tight">
                {title}
              </motion.h1>

              {/* Creator row */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {workflow.creatorAvatar ? (
                  <img src={workflow.creatorAvatar} alt={workflow.creatorName}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-[#92e600]/30" />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(146,230,0,0.15)', color: '#92e600' }}>
                    {workflow.creatorName[0]}
                  </div>
                )}
                <span className="text-sm text-[#cedde9]">
                  {isEn ? 'by' : 'bởi'} <span className="text-white font-semibold">{workflow.creatorName}</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-[#3a4a42]" />
                <span className="flex items-center gap-1 text-sm text-yellow-400 font-semibold">
                  <Star size={12} fill="currentColor" />
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
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#8a9a92] mb-5 pb-5 border-b"
                style={{ borderColor: 'rgba(146,230,0,0.08)' }}>
                <span className="flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-[#92e600]" />
                  {workflow.completionRate}% {isEn ? 'completion' : 'hoàn thành'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap size={13} className="text-yellow-400" />
                  +{totalXP} XP {isEn ? 'total' : 'tổng'}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={13} className="text-blue-400" />
                  {workflow.blocks.length} {isEn ? 'steps' : 'bước'}
                </span>
              </div>

              {/* ── CTA card shown ONLY on mobile (< lg) ── */}
              <div className="lg:hidden mb-6">
                <CtaCard
                  workflow={workflow} isFree={isFree} isEn={isEn} totalXP={totalXP}
                  purchased={purchased} inCart={inCart}
                  onJoin={handleJoin} onBuy={handleBuy} onAddCart={() => addToCart(workflow)} />
              </div>

              {/* About */}
              <div className="rounded-2xl border p-4 mb-4"
                style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>
                <h2 className="text-sm font-bold text-white mb-2">
                  {isEn ? 'About this Workflow' : 'Về Workflow này'}
                </h2>
                <p className="text-sm leading-relaxed text-[#cedde9] mb-3">{desc}</p>
                {workflow.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {workflow.tags.map(tag => (
                      <span key={tag}
                        className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium"
                        style={{ borderColor: 'rgba(146,230,0,0.2)', color: '#92e600', background: 'rgba(146,230,0,0.05)' }}>
                        <Tag size={8} />#{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Workflow Steps */}
              <div className="mb-4">
                <h2 className="text-base font-bold text-white mb-3">
                  {isEn ? `Workflow Steps (${workflow.blocks.length})` : `Các bước Workflow (${workflow.blocks.length})`}
                </h2>
                <div className="space-y-1.5">
                  {workflow.blocks.map((block, idx) => (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + idx * 0.04 }}
                      className="flex items-center gap-3 rounded-xl border px-4 py-3 group transition-colors hover:border-[#92e600]/20"
                      style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.07)' }}>
                      <div className="w-7 h-7 rounded-full border-2 border-[#1a2119] flex items-center justify-center flex-shrink-0 text-xs font-black text-[#92e600] group-hover:border-[#92e600]/40 transition-colors">
                        {idx + 1}
                      </div>
                      <span className="text-base flex-shrink-0">{BLOCK_ICON[block.type] ?? '📌'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{isEn && block.titleEn ? block.titleEn : block.title}</p>
                        <p className="text-[11px] text-[#8a9a92] capitalize mt-0.5">
                          {block.type === 'aiPrompt' ? (isEn ? 'AI Generate' : 'AI tạo nội dung')
                            : block.type === 'instruction' ? (isEn ? 'Instruction' : 'Hướng dẫn')
                            : block.type === 'input' ? (isEn ? 'Your Input' : 'Nhập liệu')
                            : block.type === 'decision' ? (isEn ? 'Decision' : 'Lựa chọn')
                            : (isEn ? 'Output' : 'Kết quả')}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(146,230,0,0.1)', color: '#92e600' }}>
                        +{BLOCK_XP[block.type] ?? 10} XP
                      </span>
                    </motion.div>
                  ))}
                </div>
                {/* XP footer */}
                <div className="mt-2 flex items-center justify-end gap-1.5 text-xs text-[#8a9a92]">
                  <Zap size={11} className="text-yellow-400" />
                  {isEn ? `Total: +${totalXP} XP` : `Tổng: +${totalXP} XP`}
                </div>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-white">
                      {isEn ? 'Related Workflows' : 'Workflow liên quan'}
                    </h2>
                    <Link to="/marketplace"
                      className="flex items-center gap-0.5 text-xs font-semibold transition-colors hover:text-white"
                      style={{ color: '#92e600' }}>
                      {isEn ? 'See all' : 'Xem tất cả'} <ChevronRight size={12} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map((wf, i) => (
                      <WorkflowCard key={wf.id} workflow={wf} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN: sticky CTA card (desktop only) ── */}
            <div className="hidden lg:block lg:w-96 flex-shrink-0">
              <div className="sticky top-20">
                <CtaCard
                  workflow={workflow} isFree={isFree} isEn={isEn} totalXP={totalXP}
                  purchased={purchased} inCart={inCart}
                  onJoin={handleJoin} onBuy={handleBuy} onAddCart={() => addToCart(workflow)} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// ── Shared CTA Card ──────────────────────────────────────────────────────────
interface CtaProps {
  workflow: ReturnType<typeof ALL_WORKFLOWS[0]['blocks'] extends infer _ ? () => (typeof ALL_WORKFLOWS)[0] : never>;
  isFree: boolean; isEn: boolean; totalXP: number;
  purchased: boolean; inCart: boolean;
  onJoin: () => void; onBuy: () => void; onAddCart: () => void;
}
function CtaCard({ workflow, isFree, isEn, totalXP, purchased, inCart, onJoin, onBuy, onAddCart }: {
  workflow: (typeof ALL_WORKFLOWS)[0];
  isFree: boolean; isEn: boolean; totalXP: number;
  purchased: boolean; inCart: boolean;
  onJoin: () => void; onBuy: () => void; onAddCart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-2xl border overflow-hidden"
      style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.15)' }}>

      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img src={workflow.thumbnail} alt="preview"
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(146,230,0,0.9)', boxShadow: '0 0 24px rgba(146,230,0,0.4)' }}>
            <Play size={18} className="ml-0.5" style={{ color: '#0b0f0c' }} />
          </div>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="p-5">
        {/* Price */}
        <div className="mb-4">
          {isFree ? (
            <span className="text-2xl font-black" style={{ color: '#92e600' }}>
              {isEn ? 'Free' : 'Miễn phí'}
            </span>
          ) : (
            <span className="text-2xl font-black text-white">
              {(workflow.price / 1000).toFixed(0)}K&nbsp;
              <span className="text-sm font-semibold text-[#8a9a92]">VNĐ</span>
            </span>
          )}
        </div>

        {/* Primary button */}
        {isFree ? (
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(146,230,0,0.35)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onJoin}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm mb-2 transition-all"
            style={{ background: '#92e600', color: '#0b0f0c' }}>
            <Play size={15} className="ml-0.5" />
            {isEn ? 'Start Workflow' : 'Bắt đầu Workflow'}
          </motion.button>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(146,230,0,0.25)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onBuy}
              disabled={purchased}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm mb-2 transition-all disabled:opacity-70"
              style={{ background: '#92e600', color: '#0b0f0c' }}>
              {purchased
                ? <><CheckCircle size={15} /> {isEn ? 'Purchased! Opening...' : 'Đã mua! Đang mở...'}</>
                : <><ShoppingCart size={15} /> {isEn ? `Buy – ${(workflow.price/1000).toFixed(0)}K VNĐ` : `Mua – ${(workflow.price/1000).toFixed(0)}K VNĐ`}</>}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={onAddCart}
              disabled={inCart}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border font-semibold text-sm mb-1 transition-all"
              style={{ borderColor: 'rgba(146,230,0,0.35)', color: inCart ? '#4b7a00' : '#92e600' }}>
              <ShoppingCart size={13} />
              {inCart
                ? (isEn ? '✓ Added to Cart' : '✓ Đã thêm vào giỏ')
                : (isEn ? 'Add to Cart' : 'Thêm vào giỏ')}
            </motion.button>
            <button onClick={onJoin}
              className="w-full py-2 text-xs text-center transition-colors hover:text-white"
              style={{ color: '#8a9a92' }}>
              {isEn ? 'Preview for free →' : 'Xem thử miễn phí →'}
            </button>
          </>
        )}

        {/* Guarantees */}
        <div className="mt-4 space-y-1.5 pt-4 border-t" style={{ borderColor: 'rgba(146,230,0,0.08)' }}>
          {[
            isEn ? '✓ Full lifetime access' : '✓ Truy cập trọn đời',
            isEn ? `✓ ${workflow.blocks.length} interactive steps` : `✓ ${workflow.blocks.length} bước tương tác`,
            isEn ? `✓ Earn +${totalXP} XP` : `✓ Nhận +${totalXP} XP`,
            isEn ? '✓ AI Mentor included' : '✓ Kèm AI Mentor',
          ].map(t => <p key={t} className="text-xs text-[#8a9a92]">{t}</p>)}
        </div>
      </div>
    </motion.div>
  );
}
