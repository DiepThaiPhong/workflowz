import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart, Users, Zap, Target, Lightbulb, Globe } from 'lucide-react';
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
    titleEn: 'Our Mission',
    titleVi: 'Sứ mệnh',
    textEn: 'Empower every learner in Vietnam to master real-world workflows with AI — so that skills become output, not just knowledge.',
    textVi: 'Trao quyền cho mọi người học ở Việt Nam thành thạo các workflow thực tế với AI — để kỹ năng trở thành sản phẩm, không chỉ là kiến thức.',
  },
  {
    icon: Lightbulb,
    titleEn: 'Our Vision',
    titleVi: 'Tầm nhìn',
    textEn: 'A Vietnam where every person, regardless of background, can create, share and monetize valuable AI workflows.',
    textVi: 'Một Việt Nam nơi mọi người, bất kể xuất phát điểm, đều có thể tạo, chia sẻ và kiếm tiền từ các workflow AI có giá trị.',
  },
  {
    icon: Globe,
    titleEn: 'Our Impact',
    titleVi: 'Tác động',
    textEn: 'We measure success not in page views, but in real outputs — emails written, CVs created, businesses planned.',
    textVi: 'Chúng tôi đo thành công không bằng lượt xem, mà bằng sản phẩm thực — email được viết, CV được tạo, kế hoạch kinh doanh được lập.',
  },
];

export default function AboutPage() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0b0f0c]" style={{ paddingTop: '4rem' }}>

        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #92e600 0%, transparent 60%), radial-gradient(circle at 70% 50%, #60a5fa 0%, transparent 60%)' }} />
          <div className="relative container-max px-4 sm:px-6 py-16 sm:py-20 text-center">
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
                className="rounded-2xl border p-6"
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
