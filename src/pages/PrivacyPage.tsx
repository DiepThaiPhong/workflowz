import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Database, Eye, Globe, UserCheck, Bell, FileText } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const PrivacyPage = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const sections = [
    {
      icon: Database,
      titleEn: '1. Data We Collect',
      titleVi: '1. Dữ liệu Chúng tôi Thu thập',
      contentEn: 'We collect information you provide directly (name, email, learning progress) and automatically collected data (usage patterns, device information). All data is stored locally on your device whenever possible.',
      contentVi: 'Chúng tôi thu thập thông tin bạn cung cấp trực tiếp (tên, email, tiến độ học tập) và dữ liệu được thu thập tự động (mẫu sử dụng, thông tin thiết bị). Tất cả dữ liệu được lưu cục bộ trên thiết bị của bạn bất cứ khi nào có thể.',
    },
    {
      icon: Eye,
      titleEn: '2. How We Use Your Data',
      titleVi: '2. Cách Chúng tôi Sử dụng Dữ liệu',
      contentEn: 'Your data is used to: provide and improve our services; personalize your learning experience; communicate with you about updates; ensure platform security and prevent fraud.',
      contentVi: 'Dữ liệu của bạn được sử dụng để: cung cấp và cải thiện dịch vụ; cá nhân hóa trải nghiệm học tập; thông báo về các cập nhật; đảm bảo bảo mật nền tảng và ngăn chặn gian lận.',
    },
    {
      icon: Lock,
      titleEn: '3. Data Security & GDPR Compliance',
      titleVi: '3. Bảo mật Dữ liệu & Tuân thủ GDPR',
      contentEn: 'We implement industry-standard security measures to protect your data. In compliance with GDPR, you have the right to: access your data; rectify inaccurate data; erase your data; data portability; withdraw consent at any time.',
      contentVi: 'Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn ngành để bảo vệ dữ liệu của bạn. Tuân thủ GDPR, bạn có quyền: truy cập dữ liệu; sửa dữ liệu không chính xác; xóa dữ liệu; di chuyển dữ liệu; rút lại đồng ý bất cứ lúc nào.',
    },
    {
      icon: Globe,
      titleEn: '4. Data Sharing & Third Parties',
      titleVi: '4. Chia sẻ Dữ liệu & Bên thứ ba',
      contentEn: 'We do not sell your personal data. We may share data with: service providers who assist our operations; legal authorities when required by law; business partners with your consent.',
      contentVi: 'Chúng tôi không bán dữ liệu cá nhân của bạn. Chúng tôi có thể chia sẻ dữ liệu với: nhà cung cấp dịch vụ hỗ trợ hoạt động; cơ quan pháp luật khi được yêu cầu; đối tác kinh doanh với sự đồng ý của bạn.',
    },
    {
      icon: UserCheck,
      titleEn: '5. Your Rights (Vietnam & EU)',
      titleVi: '5. Quyền của Bạn (Việt Nam & EU)',
      contentEn: 'Under GDPR and Vietnam\'s Personal Data Protection Decree (13/2023/ND-CP), you have rights over your personal data. Contact us to exercise these rights or file a complaint.',
      contentVi: 'Theo GDPR và Nghị định Bảo vệ Dữ liệu Cá nhân của Việt Nam (13/2023/ND-CP), bạn có quyền đối với dữ liệu cá nhân. Liên hệ với chúng tôi để thực hiện các quyền này hoặc khiếu nại.',
    },
    {
      icon: Bell,
      titleEn: '6. Cookies & Tracking',
      titleVi: '6. Cookie & Theo dõi',
      contentEn: 'We use essential cookies for platform functionality. Analytics cookies help us understand usage patterns. You can manage cookie preferences through your browser settings.',
      contentVi: 'Chúng tôi sử dụng cookie thiết yếu cho chức năng nền tảng. Cookie phân tích giúp chúng tôi hiểu các mẫu sử dụng. Bạn có thể quản lý tùy chọn cookie thông qua cài đặt trình duyệt.',
    },
    {
      icon: FileText,
      titleEn: '7. Updates to This Policy',
      titleVi: '7. Cập nhật Chính sách',
      contentEn: 'We may update this policy periodically. Significant changes will be notified via email or in-app notification. Continued use of WorkFlowz constitutes acceptance of updated terms.',
      contentVi: 'Chúng tôi có thể cập nhật chính sách này định kỳ. Các thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trong ứng dụng. Việc tiếp tục sử dụng WorkFlowz đồng nghĩa với việc chấp nhận các điều khoản cập nhật.',
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0b0f0c]">
        <div className="container-max px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(146,230,0,0.1)', border: '1px solid rgba(146,230,0,0.2)' }}>
                <Shield size={18} className="text-primary" />
                <span className="text-sm font-medium text-primary">{isEn ? 'Privacy' : 'Bảo mật'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
                {isEn ? 'Privacy Policy' : 'Chính sách Bảo mật'}
              </h1>
              <p className="text-[#8a9a92] max-w-2xl mx-auto">
                {isEn
                  ? 'Your privacy matters. Learn how we collect, use, and protect your personal data in compliance with GDPR and Vietnam\'s data protection regulations.'
                  : 'Quyền riêng tư của bạn quan trọng. Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn tuân thủ GDPR và quy định bảo vệ dữ liệu của Việt Nam.'}
              </p>
              <p className="text-xs text-[#6a7a72] mt-2">
                {isEn ? 'Last updated: March 2026' : 'Cập nhật lần cuối: Tháng 3/2026'}
              </p>
            </div>

            {/* GDPR Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border p-4 mb-8 flex items-center gap-4"
              style={{ background: 'linear-gradient(135deg, rgba(146,230,0,0.1), rgba(96,165,250,0.1))', borderColor: 'rgba(146,230,0,0.2)' }}
            >
              <div className="p-3 rounded-xl" style={{ background: 'rgba(146,230,0,0.15)' }}>
                <Shield size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white">
                  {isEn ? 'GDPR & Vietnam PDP Compliant' : 'Tuân thủ GDPR & PDP Việt Nam'}
                </h3>
                <p className="text-sm text-[#8a9a92]">
                  {isEn
                    ? 'We comply with EU General Data Protection Regulation and Vietnam\'s Personal Data Protection Decree.'
                    : 'Chúng tôi tuân thủ Quy định Bảo vệ Dữ liệu Chung của EU và Nghị định Bảo vệ Dữ liệu Cá nhân của Việt Nam.'}
                </p>
              </div>
            </motion.div>

            {/* Sections */}
            <div className="space-y-6">
              {sections.map(({ icon: Icon, titleEn, titleVi, contentEn, contentVi }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  className="rounded-2xl border p-6"
                  style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.12)' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(146,230,0,0.1)' }}>
                      <Icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white mb-2">
                        {isEn ? titleEn : titleVi}
                      </h2>
                      <p className="text-sm leading-relaxed text-[#a9b9b2]">
                        {isEn ? contentEn : contentVi}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-12 text-center"
            >
              <p className="text-sm text-[#8a9a92]">
                {isEn ? 'Questions about your data? Contact our Data Protection Officer at ' : 'Có câu hỏi về dữ liệu của bạn? Liên hệ với Cán bộ Bảo vệ Dữ liệu tại '}
                <a href="mailto:privacy@workflowz.vn" className="text-primary hover:underline">
                  privacy@workflowz.vn
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PrivacyPage;
