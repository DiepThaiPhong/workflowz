import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, Scale, AlertTriangle, RefreshCw, Ban, Shield } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const TermsPage = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const sections = [
    {
      icon: FileText,
      titleEn: '1. Acceptance of Terms',
      titleVi: '1. Chấp nhận Điều khoản',
      contentEn: 'By accessing and using WorkFlowz, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.',
      contentVi: 'Bằng cách truy cập và sử dụng WorkFlowz, bạn đồng ý bị ràng buộc bởi các Điều khoản Dịch vụ này và tất cả các luật và quy định hiện hành. Nếu bạn không đồng ý với bất kỳ điều khoản nào, bạn bị cấm sử dụng hoặc truy cập nền tảng này.',
    },
    {
      icon: Scale,
      titleEn: '2. Intellectual Property',
      titleVi: '2. Sở hữu Trí tuệ',
      contentEn: 'All content, workflows, and materials on WorkFlowz are protected by copyright and intellectual property laws. Unauthorized copying, reproduction, or distribution of any content is strictly prohibited. Violators will be subject to legal action.',
      contentVi: 'Tất cả nội dung, workflow và tài liệu trên WorkFlowz được bảo vệ bởi bản quyền và luật sở hữu trí tuệ. Nghiêm cấm sao chép, tái sản xuất hoặc phân phối bất kỳ nội dung nào mà không được ủy quyền. Người vi phạm sẽ bị xử lý theo pháp luật.',
    },
    {
      icon: AlertTriangle,
      titleEn: '3. User Responsibilities',
      titleVi: '3. Trách nhiệm Người dùng',
      contentEn: 'Users are responsible for maintaining the confidentiality of their accounts and for all activities under their accounts. You agree to use the platform only for lawful purposes and in accordance with these Terms.',
      contentVi: 'Người dùng có trách nhiệm bảo mật tài khoản và chịu trách nhiệm cho tất cả hoạt động dưới tài khoản của mình. Bạn đồng ý sử dụng nền tảng chỉ cho mục đích hợp pháp và tuân theo các Điều khoản này.',
    },
    {
      icon: RefreshCw,
      titleEn: '4. Service Modifications',
      titleVi: '4. Thay đổi Dịch vụ',
      contentEn: 'WorkFlowz reserves the right to modify, suspend, or discontinue any part of the service at any time without prior notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.',
      contentVi: 'WorkFlowz có quyền sửa đổi, tạm ngừng hoặc ngừng bất kỳ phần nào của dịch vụ bất cứ lúc nào mà không cần thông báo trước. Chúng tôi không chịu trách nhiệm với bạn hoặc bất kỳ bên thứ ba nào về việc sửa đổi, tạm ngừng hoặc ngừng dịch vụ.',
    },
    {
      icon: Ban,
      titleEn: '5. Prohibited Activities',
      titleVi: '5. Hoạt động Bị cấm',
      contentEn: 'Users may not: copy or duplicate workflows for redistribution; reverse engineer any part of the platform; use automated systems to access the platform; engage in any activity that disrupts the service or violates others\' rights.',
      contentVi: 'Người dùng không được: sao chép hoặc nhân đôi workflow để phân phối lại; dịch ngược bất kỳ phần nào của nền tảng; sử dụng hệ thống tự động để truy cập nền tảng; tham gia vào bất kỳ hoạt động nào gây gián đoạn dịch vụ hoặc vi phạm quyền của người khác.',
    },
    {
      icon: Shield,
      titleEn: '6. Limitation of Liability',
      titleVi: '6. Giới hạn Trách nhiệm',
      contentEn: 'WorkFlowz and team BAP shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.',
      contentVi: 'WorkFlowz và team BAP không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hệ quả hoặc trừng phạt nào phát sinh từ việc bạn sử dụng hoặc không thể sử dụng dịch vụ.',
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
                <FileText size={18} className="text-primary" />
                <span className="text-sm font-medium text-primary">{isEn ? 'Legal' : 'Pháp lý'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
                {isEn ? 'Terms of Service' : 'Điều khoản Sử dụng'}
              </h1>
              <p className="text-[#8a9a92] max-w-2xl mx-auto">
                {isEn
                  ? 'Please read these terms carefully before using WorkFlowz.'
                  : 'Vui lòng đọc kỹ các điều khoản này trước khi sử dụng WorkFlowz.'}
              </p>
              <p className="text-xs text-[#6a7a72] mt-2">
                {isEn ? 'Last updated: March 2026' : 'Cập nhật lần cuối: Tháng 3/2026'}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {sections.map(({ icon: Icon, titleEn, titleVi, contentEn, contentVi }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
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
              transition={{ delay: 0.6 }}
              className="mt-12 text-center"
            >
              <p className="text-sm text-[#8a9a92]">
                {isEn ? 'Questions? Contact us at ' : 'Có câu hỏi? Liên hệ tại '}
                <a href="mailto:contact@workflowz.vn" className="text-primary hover:underline">
                  contact@workflowz.vn
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default TermsPage;
