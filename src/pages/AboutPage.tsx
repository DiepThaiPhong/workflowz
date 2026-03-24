import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart, Users, Zap, Target, Lightbulb, Globe, Bot, Search, Sparkles, Shield, Building2, Coins } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const TEAM = [
  {
    name: 'Do Quang Thai Binh',
    title: 'Co-Founder & AI Engineer',
    titleVi: 'Đồng sáng lập & Kỹ sư AI',
    bio: 'Passionate about making AI accessible to everyone. Leads the technical vision of WorkFlowz.',
    bioVi: 'Đam mê đưa AI đến với mọi người. Dẫn dắt tầm nhìn kỹ thuật của WorkFlowz.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    initials: 'TB',
    color: '#92e600',
  },
  {
    name: 'Do Quang Thai An',
    title: 'Co-Founder & Product Designer',
    titleVi: 'Đồng sáng lập & Nhà thiết kế sản phẩm',
    bio: 'Crafts seamless user experiences. Believes great design is invisible but impactful.',
    bioVi: 'Thiết kế trải nghiệm người dùng tối ưu. Tin rằng thiết kế tốt là vô hình nhưng có tác động mạnh.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    initials: 'TA',
    color: '#60a5fa',
  },
  {
    name: 'Diep Thai Phong',
    title: 'Co-Founder & Growth Lead',
    titleVi: 'Đồng sáng lập & Trưởng bộ phận Tăng trưởng',
    bio: 'Drives community growth and creator ecosystem. Connects WorkFlowz with learners across Vietnam.',
    bioVi: 'Phát triển cộng đồng và hệ sinh thái creator. Kết nối WorkFlowz với người học trên khắp Việt Nam.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
    initials: 'DP',
    color: '#a78bfa',
  },
];

const MISSION_POINTS = [
  {
    icon: Target,
    titleEn: 'Two-Sided Marketplace',
    titleVi: 'Marketplace hai chiều',
    textEn: 'Lecturers publish AI-powered workflows, and learners use them to create real outputs — cleaner datasets, automated tasks, and more.',
    textVi: 'Giảng viên xuất bản các workflow được hỗ trợ bởi AI, và người học sử dụng chúng để tạo kết quả thực — dữ liệu sạch hơn, tác vụ tự động hóa, và hơn nữa.',
  },
  {
    icon: Lightbulb,
    titleEn: 'Workflow-Based Learning',
    titleVi: 'Học theo Workflow',
    textEn: 'Each workflow combines short demo videos or notes with guided AI steps to produce real outputs — not just passive watching.',
    textVi: 'Mỗi workflow kết hợp video demo ngắn hoặc ghi chú với các bước AI hướng dẫn để tạo kết quả thực — không chỉ xem thụ động.',
  },
  {
    icon: Globe,
    titleEn: 'AI-Powered Tools',
    titleVi: 'Công cụ AI',
    textEn: 'Semantic search finds relevant courses beyond keywords. AI Tutor provides lesson-grounded answers and personalized support.',
    textVi: 'Tìm kiếm ngữ nghĩa tìm các khóa học liên quan ngoài từ khóa. AI Tutor cung cấp câu trả lời dựa trên bài học và hỗ trợ cá nhân hóa.',
  },
];

const PLATFORM_FEATURES = [
  {
    icon: Zap,
    titleEn: 'For Learners',
    titleVi: 'Cho Người học',
    items: [
      { en: 'Quick intake to generate personalized learning paths', vi: 'Nhập nhanh để tạo lộ trình học cá nhân hóa' },
      { en: 'AI Tutor retrieves from knowledge base to reduce hallucination', vi: 'AI Tutor truy xuất từ knowledge base để giảm ảo giác' },
      { en: 'Store output artifacts as proof of skills', vi: 'Lưu trữ sản phẩm đầu ra làm bằng chứng kỹ năng' },
    ],
  },
  {
    icon: Users,
    titleEn: 'For Creators',
    titleVi: 'Cho Creator',
    items: [
      { en: 'Creator studio: AI converts videos/docs into structured workflows', vi: 'Creator studio: AI chuyển đổi video/tài liệu thành workflow có cấu trúc' },
      { en: 'AI-assisted authoring with outlines, examples, and rubrics', vi: 'Tạo nội dung hỗ trợ AI với dàn ý, ví dụ và tiêu chí' },
      { en: 'Analytics dashboard tracks completion and ratings', vi: 'Dashboard analytics theo dõi tỷ lệ hoàn thành và đánh giá' },
    ],
  },
  {
    icon: Coins,
    titleEn: 'Revenue Share',
    titleVi: 'Chia sẻ Doanh thu',
    items: [
      { en: 'Creators earn 50% via platform discovery', vi: 'Creator nhận 50% qua discovery của nền tảng' },
      { en: 'Creators earn 90% through their own link', vi: 'Creator nhận 90% qua link riêng của họ' },
      { en: 'Referrers earn 5% when invited users purchase', vi: 'Người giới thiệu nhận 5% khi người được mời mua hàng' },
    ],
  },
];

const INFRASTRUCTURE = [
  { label: 'Azure Cloud', descEn: 'Backend services, data storage, event logging', descVi: 'Dịch vụ backend, lưu trữ dữ liệu, ghi log sự kiện' },
  { label: 'Z.AI GLM API', descEn: 'Real-time AI feedback and content moderation', descVi: 'Phản hồi AI thời gian thực và kiểm duyệt nội dung' },
  { label: 'VNPAY', descEn: 'Subscriptions, creator payouts via transfers & QR', descVi: 'Đăng ký, thanh toán cho creator qua chuyển khoản & QR' },
];

const PARTNERS = [
  { labelEn: 'Universities', labelVi: 'Đại học', descEn: 'Create microlearning content to complement teaching', descVi: 'Tạo nội dung microlearning bổ sung cho việc dạy học' },
  { labelEn: 'Employers', labelVi: 'Nhà tuyển dụng', descEn: 'Contribute role-based cases and track employee progress', descVi: 'Đóng góp case theo vai trò và theo dõi tiến độ nhân viên' },
  { labelEn: 'Independent Creators', labelVi: 'Creator độc lập', descEn: 'Contribute diverse, real-world workflows', descVi: 'Đóng góp các workflow thực tế đa dạng' },
];

export default function AboutPage() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0b0f0c]" style={{ paddingTop: '4rem' }}>

        {/* Hero */}
        <div className="container-max px-4 sm:px-6 py-16 sm:py-20 text-center relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 400px 200px at 50% 40%, #92e600 0%, transparent 70%)' }} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6"
              style={{ background: 'rgba(146,230,0,0.1)', border: '1px solid rgba(146,230,0,0.3)', color: '#92e600' }}>
              <Heart size={12} fill="currentColor" /> {isEn ? 'Made with ❤️ in Vietnam' : 'Làm bằng ❤️ tại Việt Nam'}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              {isEn ? 'About ' : 'Về '}<span style={{ color: '#92e600' }}>WorkFlowz</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-[#cedde9] max-w-2xl mx-auto leading-relaxed">
              {isEn
                ? 'We\'re building the platform where learning meets real output — powered by AI, built for Vietnam.'
                : 'Chúng tôi xây dựng nền tảng nơi việc học gặp kết quả thực sự — được hỗ trợ bởi AI, xây dựng cho Việt Nam.'}
            </motion.p>
        </div>

        {/* Mission */}
        <div className="container-max px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {MISSION_POINTS.map(({ icon: Icon, titleEn, titleVi, textEn, textVi }, i) => (
              <motion.div
                key={titleEn}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                whileHover={{ 
                  y: -4,
                  borderColor: 'rgba(146, 230, 0, 0.4)',
                  boxShadow: '0 4px 20px rgba(146, 230, 0, 0.15)'
                }}
                className="rounded-2xl border p-6 cursor-pointer transition-shadow"
                style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.12)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(146,230,0,0.1)' }}>
                  <Icon size={20} style={{ color: '#92e600' }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{isEn ? titleEn : titleVi}</h3>
                <p className="text-sm text-[#cedde9] leading-relaxed">{isEn ? textEn : textVi}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border p-6 mb-16 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
            style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.12)' }}>
            {[
              { val: '342+', label: isEn ? 'Learners' : 'Người học', icon: Users },
              { val: '48', label: isEn ? 'Workflows' : 'Workflow', icon: Zap },
              { val: '9,812', label: isEn ? 'Runs' : 'Lượt chạy', icon: Target },
              { val: '74%', label: isEn ? 'Output Rate' : 'Tạo kết quả', icon: Globe },
            ].map(({ val, label, icon: Icon }) => (
              <div key={label}>
                <Icon size={18} className="mx-auto mb-2" style={{ color: '#92e600' }} />
                <p className="text-2xl font-black text-white">{val}</p>
                <p className="text-xs text-[#8a9a92] mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>

          {/* Platform Features */}
          <div className="mb-16">
            <h2 className="text-2xl font-black text-white mb-2">
              {isEn ? 'Platform Features' : 'Tính năng Nền tảng'}
            </h2>
            <p className="text-[#8a9a92] text-sm mb-6">
              {isEn ? 'Tools and services for learners, creators, and partners.' : 'Công cụ và dịch vụ cho người học, creator và đối tác.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PLATFORM_FEATURES.map(({ icon: Icon, titleEn, titleVi, items }, i) => (
                <motion.div
                  key={titleEn}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  whileHover={{ 
                    y: -4,
                    borderColor: 'rgba(146, 230, 0, 0.4)',
                    boxShadow: '0 4px 20px rgba(146, 230, 0, 0.15)'
                  }}
                  className="rounded-2xl border p-5 cursor-pointer transition-shadow"
                  style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.12)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: 'rgba(146,230,0,0.1)' }}>
                    <Icon size={18} style={{ color: '#92e600' }} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-3">{isEn ? titleEn : titleVi}</h3>
                  <ul className="space-y-2">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#cedde9]">
                        <span className="text-[#92e600] mt-1">•</span>
                        {isEn ? item.en : item.vi}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Infrastructure */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border p-6 mb-16"
            style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.12)' }}>
            <h3 className="text-lg font-bold text-white mb-4">
              {isEn ? '🛠️ Infrastructure Partners' : '🛠️ Đối tác Hạ tầng'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {INFRASTRUCTURE.map(({ label, descEn, descVi }) => (
                <motion.div 
                  key={label} 
                  whileHover={{ 
                    y: -2, 
                    scale: 1.02,
                    borderColor: 'rgba(146, 230, 0, 0.4)',
                    boxShadow: '0 4px 20px rgba(146, 230, 0, 0.15)'
                  }} 
                  transition={{ duration: 0.2 }}
                  className="p-3 rounded-xl cursor-pointer border transition-shadow" 
                  style={{ background: 'rgba(146,230,0,0.05)', borderColor: 'rgba(146,230,0,0.1)' }}>
                  <p className="text-sm font-bold text-white mb-1">{label}</p>
                  <p className="text-xs text-[#8a9a92]">{isEn ? descEn : descVi}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Partners */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border p-6 mb-16"
            style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.12)' }}>
            <h3 className="text-lg font-bold text-white mb-4">
              {isEn ? '🤝 Ecosystem Partners' : '🤝 Đối tác Hệ sinh thái'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PARTNERS.map(({ labelEn, labelVi, descEn, descVi }) => (
                <motion.div 
                  key={labelEn} 
                  whileHover={{ 
                    y: -2, 
                    scale: 1.02,
                    borderColor: 'rgba(146, 230, 0, 0.4)',
                    boxShadow: '0 4px 20px rgba(146, 230, 0, 0.15)'
                  }} 
                  transition={{ duration: 0.2 }}
                  className="p-3 rounded-xl cursor-pointer border transition-shadow" 
                  style={{ background: 'rgba(146,230,0,0.05)', borderColor: 'rgba(146,230,0,0.1)' }}>
                  <p className="text-sm font-bold text-white mb-1">{isEn ? labelEn : labelVi}</p>
                  <p className="text-xs text-[#8a9a92]">{isEn ? descEn : descVi}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <div className="mb-4">
            <h2 className="text-2xl font-black text-white mb-2">
              {isEn ? 'Meet the Team' : 'Đội ngũ sáng lập'}
            </h2>
            <p className="text-[#8a9a92] text-sm">
              {isEn ? 'Three friends, one shared dream — making skills accessible.' : 'Ba người bạn, một giấc mơ chung — đưa kỹ năng đến mọi người.'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map(({ name, title, titleVi, bio, bioVi, avatar, initials, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border overflow-hidden"
                style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.12)' }}>
                {/* Avatar */}
                <div className="relative h-48 overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black"
                      style={{ background: `${color}15`, color }}>
                      {initials}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e150d] via-transparent to-transparent" />
                </div>
                {/* Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-0.5">{name}</h3>
                  <p className="text-xs font-semibold mb-3" style={{ color }}>{isEn ? title : titleVi}</p>
                  <p className="text-sm text-[#cedde9] leading-relaxed">{isEn ? bio : bioVi}</p>
                  {/* Color accent bar */}
                  <div className="mt-4 h-0.5 rounded-full w-12" style={{ background: color }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
