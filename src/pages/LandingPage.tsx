import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Play, TrendingUp, Users, Shield, Zap, ChevronRight, CheckCircle, BookOpen } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { ALL_WORKFLOWS, PLATFORM_METRICS } from '../data/workflowData';
import WorkflowCard from '../components/WorkflowCard';
import FloatingAIChat from '../components/FloatingAIChat';

const STATS = [
  { value: `${PLATFORM_METRICS.totalUsers}+`,                           label_vi: 'Người dùng',   label_en: 'Users' },
  { value: `${PLATFORM_METRICS.totalRuns.toLocaleString('vi-VN')}+`,    label_vi: 'Lượt chạy',   label_en: 'Workflow runs' },
  { value: `${PLATFORM_METRICS.completionRate}%`,                        label_vi: 'Hoàn thành',  label_en: 'Completion rate' },
  { value: `${PLATFORM_METRICS.northStarPercent}%`,                      label_vi: 'Có kết quả', label_en: 'Output artifacts' },
];

const FEATURES_VI = [
  { icon: '🔀', title: 'Drag & Drop Builder', desc: 'Xây workflow bằng cách kéo-thả các khối AI, Input, Output. Không cần code.' },
  { icon: '🤖', title: 'AI Tutor RAG',        desc: 'AI Mentor hiểu từng bước trong workflow của bạn và hỗ trợ chính xác.' },
  { icon: '🎯', title: '3 Chế Độ Học',       desc: 'Step-by-step, Q&A, hoặc Scratch – chọn cách học phù hợp với bạn.' },
  { icon: '📊', title: 'Kết Quả Thực Tế',   desc: 'Workflow tạo ra artifact thực tế: email, CV, kế hoạch, code – không chỉ là lý thuyết.' },
  { icon: '💰', title: 'Kiếm Tiền',           desc: 'Creator xuất bản workflow lên Marketplace và nhận doanh thu từ người học.' },
  { icon: '🔒', title: 'Quyền Riêng Tư',    desc: 'Dữ liệu chỉ lưu trên thiết bị của bạn. Không thu thập thông tin cá nhân.' },
];
const FEATURES_EN = [
  { icon: '🔀', title: 'Drag & Drop Builder',   desc: 'Build workflows by dragging AI, Input, and Output blocks. No coding required.' },
  { icon: '🤖', title: 'AI Tutor RAG',           desc: 'AI Mentor understands each workflow step and provides precise guidance.' },
  { icon: '🎯', title: '3 Learning Modes',       desc: 'Step-by-step, Q&A, or Scratch – choose the way that fits your style.' },
  { icon: '📊', title: 'Real Output Artifacts', desc: 'Workflows produce real outputs: emails, CVs, plans, code – not just theory.' },
  { icon: '💰', title: 'Monetize',               desc: 'Creators publish workflows to the Marketplace and earn revenue from learners.' },
  { icon: '🔒', title: 'Privacy First',          desc: 'Data stays on your device. Zero personal data collection.' },
];

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const navigate = useNavigate();
  const features = isEn ? FEATURES_EN : FEATURES_VI;

  return (
    <PageTransition>
      {/* ── HERO ── */}
      <section className="hero min-h-screen flex items-center relative pt-16" style={{ overflow: 'hidden' }}>
        {/* Abstract tech background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f0c] via-[#0d1210] to-[#0a0f0c]" style={{ overflow: 'hidden' }}>
          {/* Animated gradient orbs - positioned to extend beyond viewport */}
          <div 
            className="absolute rounded-full"
            style={{ 
              top: '10%',
              left: '-20%',
              width: '60vw',
              height: '60vw',
              maxWidth: '800px',
              maxHeight: '800px',
              background: 'radial-gradient(circle, rgba(146,230,0,0.25) 0%, rgba(146,230,0,0.08) 40%, transparent 70%)',
              animation: 'glowPulse 8s ease-in-out infinite',
              pointerEvents: 'none'
            }} 
          />
          <div 
            className="absolute rounded-full"
            style={{ 
              bottom: '-15%',
              right: '-10%',
              width: '50vw',
              height: '50vw',
              maxWidth: '600px',
              maxHeight: '600px',
              background: 'radial-gradient(circle, rgba(146,230,0,0.2) 0%, rgba(146,230,0,0.05) 45%, transparent 75%)',
              animation: 'glowPulse 10s ease-in-out infinite',
              pointerEvents: 'none'
            }} 
          />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
               style={{ backgroundImage: 'linear-gradient(rgba(146,230,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(146,230,0,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
               style={{ backgroundImage: 'radial-gradient(circle, rgba(146,230,0,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          {/* Floating geometric lines */}
          <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgba(146,230,0,0.6)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <line x1="0" y1="30%" x2="100%" y2="20%" stroke="url(#lineGrad)" strokeWidth="1.5" />
            <line x1="0" y1="70%" x2="100%" y2="80%" stroke="url(#lineGrad)" strokeWidth="1.5" />
            <line x1="20%" y1="0" x2="80%" y2="100%" stroke="url(#lineGrad)" strokeWidth="1" />
          </svg>
          
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0f0c_70%)]" />
        </div>

        <div className="relative z-10 container-max px-4 sm:px-6 pt-20 pb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pill pill-purple mb-6"
            >
              <Zap size={14} />
              {isEn ? 'AI-Powered Workflow Platform · v1.0' : 'Nền tảng Workflow AI · v1.0'}
            </motion.div>

            {/* Name + Tagline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-tight mb-4"
            >
              <span className="hero-title">WorkFlowz</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-base leading-relaxed mb-8 max-w-xl"
              style={{ color: '#e9eff5' }}
            >
              {isEn
                ? 'A dual-mode AI platform where learners execute real workflows and creators build, publish, and monetize them. Powered by Gemini.'
                : 'Nền tảng AI hai chế độ: học viên chạy workflow thực tế, creator xây dựng và kiếm tiền từ chúng. Được hỗ trợ bởi Gemini.'}
            </motion.p>

            {/* Dual CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              <Link to="/marketplace" className="btn btn-primary text-base">
                <Play size={18} />
                {isEn ? 'Start Learning' : 'Bắt đầu học'}
              </Link>
              <Link to="/creator-studio" className="btn btn-secondary text-base">
                <Zap size={18} />
                {isEn ? 'Activate Creator Studio' : 'Kích hoạt Creator Studio'}
              </Link>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-xs flex items-center gap-1.5"
              style={{ color: 'var(--text-muted)' }}
            >
              <Shield size={12} className="text-primary" />
              {isEn ? 'Learn by doing · Create real workflows · No setup' : 'Học qua thực hành · Tạo workflow thực tế · Không cần cài đặt'}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section 
        className="border-y py-10"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="container-max px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(({ value, label_vi, label_en }, i) => (
              <motion.div 
                key={label_vi} 
                initial={{ opacity: 0, y: 12 }} 
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <p className="text-3xl font-display font-black text-primary">{value}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{isEn ? label_en : label_vi}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEARNER OR CREATOR? ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
        {/* Ambient glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(146,230,0,0.08) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 container-max px-4 sm:px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Icon */}
            <div 
              className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'rgba(146,230,0,0.12)', border: '1px solid var(--border-hover)' }}
            >
              <Zap size={28} className="text-primary" fill="currentColor" />
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl font-display font-black mb-4">
              {isEn ? (
                <><span className="text-primary">Learner</span> or <span className="text-primary">Creator</span>?</>
              ) : (
                <><span className="text-primary">Học viên</span> hay <span className="text-primary">Creator</span>?</>
              )}
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: '#e9eff5' }}>
              {isEn
                ? 'Switch seamlessly between learning AI workflows and building your own. One platform, two powerful modes – your journey, your rules.'
                : 'Chuyển đổi liền mạch giữa học workflow AI và tự tạo. Một nền tảng, hai chế độ mạnh mẽ – hành trình của bạn, luật của bạn.'}
            </p>

            {/* Two big cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-10">
              {/* Learner card */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="card cursor-pointer text-left"
                onClick={() => navigate('/marketplace')}
              >
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-display font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                  {isEn ? 'Explore as Learner' : 'Khám phá với tư cách Học viên'}
                </h3>
                <p className="text-sm mb-5" style={{ color: '#e9eff5' }}>
                  {isEn
                    ? 'Browse & run AI-powered workflows. Get real output artifacts step by step.'
                    : 'Duyệt & chạy workflow AI. Nhận kết quả thực tế từng bước.'}
                </p>
                <button className="btn btn-primary w-full text-sm">
                  <Play size={16} />
                  {isEn ? 'Explore as Learner' : 'Khám phá Workflow'}
                </button>
              </motion.div>

              {/* Creator card */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="card cursor-pointer text-left glow-border"
                style={{ borderColor: 'var(--border-hover)' }}
                onClick={() => navigate('/creator-studio')}
              >
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-display font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                  {isEn ? 'Activate Creator Studio' : 'Kích hoạt Creator Studio'}
                </h3>
                <p className="text-sm mb-5" style={{ color: '#e9eff5' }}>
                  {isEn
                    ? 'Build, publish, and monetize your own AI workflows. Earn from the community.'
                    : 'Xây dựng, xuất bản và kiếm tiền từ workflow AI của riêng bạn. Kiếm thu nhập từ cộng đồng.'}
                </p>
                <button className="btn btn-secondary w-full text-sm">
                  <Zap size={16} />
                  {isEn ? 'Activate Creator Studio' : 'Kích hoạt Studio'}
                </button>
              </motion.div>
            </div>

            {/* One-click note */}
            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <CheckCircle size={15} className="text-primary" />
              {isEn
                ? 'One-click mode switch · No data loss · < 1s transition'
                : 'Chuyển chế độ 1 click · Không mất dữ liệu · < 1 giây'}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 sm:py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container-max px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
              {isEn ? 'Why ' : 'Tại sao '}<span className="text-primary">WorkFlowz?</span>
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: '#e9eff5' }}>
              {isEn
                ? 'Beyond traditional EdTech – operationalize knowledge into executable, AI-powered workflows.'
                : 'Vượt xa EdTech truyền thống – biến kiến thức thành quy trình có thể thực thi với AI.'}
            </p>
          </div>
          <div className="features-grid">
            {features.map(({ icon, title, desc }, i) => (
              <motion.div 
                key={title} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} 
                transition={{ delay: i * 0.07, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="card"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#e9eff5' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW PREVIEW ── */}
      <section className="py-16" style={{ background: 'var(--bg-primary)' }}>
        <div className="container-max px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                {isEn ? 'Featured Workflows' : 'Workflow Nổi Bật'}
              </h2>
              <p className="mt-1" style={{ color: '#e9eff5' }}>
                {isEn ? 'Ready-to-run, AI-powered workflows for real results.' : 'Sẵn sàng chạy – workflow AI cho kết quả thực tế.'}
              </p>
            </div>
            <Link 
              to="/marketplace" 
              className="text-sm font-medium hover:underline flex items-center gap-1 whitespace-nowrap text-primary"
            >
              {isEn ? 'All Workflows' : 'Tất cả'} <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ALL_WORKFLOWS.slice(0, 3).map((wf, i) => (
              <WorkflowCard key={wf.id} workflow={wf} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Floating AI Chat – only on Home */}
      <FloatingAIChat />
    </PageTransition>
  );
};

export default LandingPage;
