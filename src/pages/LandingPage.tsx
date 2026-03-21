import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Play, TrendingUp, Users, Shield, Zap, ChevronRight, CheckCircle, BookOpen } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { ALL_WORKFLOWS, PLATFORM_METRICS } from '../data/workflowData';
import WorkflowCard from '../components/WorkflowCard';
import FloatingAIChat from '../components/FloatingAIChat';

const HERO_IMG = 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&q=80';
const HERO_FALLBACK = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80';
const GREEN = '#92e600';
const DARK = '#0b0f0c';

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
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="WorkFlowz – workflow canvas" className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = HERO_FALLBACK; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/96 via-gray-950/80 to-gray-950/30" />
        </div>

        <div className="relative z-10 container-max px-4 sm:px-6 pt-24 pb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(146,230,0,0.12)', border: '1px solid rgba(146,230,0,0.25)', color: GREEN }}>
              <Sparkles size={14} />
              {isEn ? 'AI-Powered Workflow Platform · v1.0' : 'Nền tảng Workflow AI · v1.0'}
            </motion.div>

            {/* Name + Tagline */}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white leading-tight mb-3">
              Work<span style={{ color: GREEN }}>Flowz</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-lg font-medium italic mb-5" style={{ color: 'rgba(146,230,0,0.7)' }}>
              "{isEn ? 'Master workflows that make your work flow.' : 'Master workflows – làm chủ quy trình công việc hiệu quả.'}"
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-base text-gray-300 leading-relaxed mb-8 max-w-xl">
              {isEn
                ? 'A dual-mode AI platform where learners execute real workflows and creators build, publish, and monetize them. Powered by Gemini.'
                : 'Nền tảng AI hai chế độ: học viên chạy workflow thực tế, creator xây dựng và kiếm tiền từ chúng. Được hỗ trợ bởi Gemini.'}
            </motion.p>

            {/* Dual CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link to="/marketplace"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-base transition-all"
                style={{ background: GREEN, color: DARK, boxShadow: '0 0 20px rgba(146,230,0,0.35)' }}>
                <Play size={18} />
                {isEn ? 'Start Learning' : 'Bắt đầu học'}
              </Link>
              <Link to="/creator-studio"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-base border-2 transition-all hover:bg-[#92e600]/10"
                style={{ borderColor: GREEN, color: GREEN }}>
                <Zap size={18} />
                {isEn ? 'Activate Creator Studio' : 'Kích hoạt Creator Studio'}
              </Link>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-xs text-gray-500 flex items-center gap-1.5">
              <Shield size={12} style={{ color: GREEN }} />
              {isEn ? 'Free forever · No sign-up · Data stays on your device' : 'Miễn phí mãi mãi · Không cần đăng ký · Dữ liệu lưu cục bộ'}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y py-10" style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>
        <div className="container-max px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(({ value, label_vi, label_en }, i) => (
              <motion.div key={label_vi} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="text-3xl font-black" style={{ color: GREEN }}>{value}</p>
                <p className="text-sm text-gray-500 mt-1">{isEn ? label_en : label_vi}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEARNER OR CREATOR? ── big section */}
      <section className="py-20 relative overflow-hidden" style={{ background: DARK }}>
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(146,230,0,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 container-max px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'rgba(146,230,0,0.12)', border: '1px solid rgba(146,230,0,0.25)' }}>
              <Zap size={28} style={{ color: GREEN }} fill={GREEN} />
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              {isEn ? (
                <><span style={{ color: GREEN }}>Learner</span> or <span style={{ color: GREEN }}>Creator</span>?</>
              ) : (
                <><span style={{ color: GREEN }}>Học viên</span> hay <span style={{ color: GREEN }}>Creator</span>?</>
              )}
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              {isEn
                ? 'Switch seamlessly between learning AI workflows and building your own. One platform, two powerful modes – your journey, your rules.'
                : 'Chuyển đổi liền mạch giữa học workflow AI và tự tạo. Một nền tảng, hai chế độ mạnh mẽ – hành trình của bạn, luật của bạn.'}
            </p>

            {/* Two big cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-10">
              {/* Learner card */}
              <motion.div whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(146,230,0,0.2)' }}
                className="rounded-2xl p-6 text-left cursor-pointer border transition-all"
                style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.15)' }}
                onClick={() => navigate('/marketplace')}>
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-black text-white mb-2">{isEn ? 'Explore as Learner' : 'Khám phá với tư cách Học viên'}</h3>
                <p className="text-sm text-gray-400 mb-5">
                  {isEn
                    ? 'Browse & run AI-powered workflows. Get real output artifacts step by step.'
                    : 'Duyệt & chạy workflow AI. Nhận kết quả thực tế từng bước.'}
                </p>
                <button className="w-full py-3 rounded-xl font-bold text-sm transition-all"
                  style={{ background: GREEN, color: DARK }}>
                  <Play size={16} className="inline mr-2" />
                  {isEn ? 'Explore as Learner' : 'Khám phá Workflow'}
                </button>
              </motion.div>

              {/* Creator card */}
              <motion.div whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(146,230,0,0.15)' }}
                className="rounded-2xl p-6 text-left cursor-pointer border-2 transition-all"
                style={{ background: '#0e150d', borderColor: GREEN }}
                onClick={() => navigate('/creator-studio')}>
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-black text-white mb-2">{isEn ? 'Activate Creator Studio' : 'Kích hoạt Creator Studio'}</h3>
                <p className="text-sm text-gray-400 mb-5">
                  {isEn
                    ? 'Build, publish, and monetize your own AI workflows. Earn from the community.'
                    : 'Xây dựng, xuất bản và kiếm tiền từ workflow AI của riêng bạn. Kiếm thu nhập từ cộng đồng.'}
                </p>
                <button className="w-full py-3 rounded-xl font-bold text-sm border-2 transition-all"
                  style={{ borderColor: GREEN, color: GREEN }}>
                  <Zap size={16} className="inline mr-2" />
                  {isEn ? 'Activate Creator Studio' : 'Kích hoạt Studio'}
                </button>
              </motion.div>
            </div>

            {/* One-click note */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <CheckCircle size={15} style={{ color: GREEN }} />
              {isEn
                ? 'One-click mode switch · No data loss · < 1s transition'
                : 'Chuyển chế độ 1 click · Không mất dữ liệu · < 1 giây'}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 sm:py-20" style={{ background: '#0e150d' }}>
        <div className="container-max px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {isEn ? 'Why ' : 'Tại sao '}<span style={{ color: GREEN }}>WorkFlowz?</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              {isEn
                ? 'Beyond traditional EdTech – operationalize knowledge into executable, AI-powered workflows.'
                : 'Vượt xa EdTech truyền thống – biến kiến thức thành quy trình có thể thực thi với AI.'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4 }}
                className="rounded-2xl p-6 border"
                style={{ background: DARK, borderColor: 'rgba(146,230,0,0.1)' }}>
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW PREVIEW ── */}
      <section className="py-16" style={{ background: DARK }}>
        <div className="container-max px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {isEn ? 'Featured Workflows' : 'Workflow Nổi Bật'}
              </h2>
              <p className="text-gray-400 mt-1">
                {isEn ? 'Ready-to-run, AI-powered workflows for real results.' : 'Sẵn sàng chạy – workflow AI cho kết quả thực tế.'}
              </p>
            </div>
            <Link to="/marketplace" className="text-sm font-medium hover:underline flex items-center gap-1 whitespace-nowrap"
              style={{ color: GREEN }}>
              {isEn ? 'All Workflows' : 'Tất cả'} <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
