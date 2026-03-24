import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Copy, CheckCircle, ExternalLink, FileText,
  Image, Mail, MessageSquare, BookOpen, X,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';

const REFERRAL_CODE = 'WFZ-DIEP2026';
const REFERRAL_LINK = 'https://workflowz.app/ref/WFZ-DIEP2026';

const MARKETING_RESOURCES = [
  {
    icon: Image,
    titleEn: 'Banner Templates',
    titleVi: 'Mẫu Banner',
    descEn: '4 ready-to-use banners in multiple sizes (1080×1080, 1200×628)',
    descVi: '4 banner sẵn dùng với nhiều kích thước (1080×1080, 1200×628)',
    color: '#60a5fa',
    img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&q=60',
  },
  {
    icon: MessageSquare,
    titleEn: 'Social Media Posts',
    titleVi: 'Bài viết Mạng xã hội',
    descEn: '10 captions for Facebook, TikTok and LinkedIn',
    descVi: '10 caption cho Facebook, TikTok và LinkedIn',
    color: '#a78bfa',
    img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&q=60',
  },
  {
    icon: Mail,
    titleEn: 'Email Templates',
    titleVi: 'Mẫu Email',
    descEn: '3 email templates for cold outreach and newsletters',
    descVi: '3 mẫu email cho cold outreach và newsletter',
    color: '#34d399',
    img: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=300&q=60',
  },
  {
    icon: BookOpen,
    titleEn: 'Presentation Deck',
    titleVi: 'Bộ Slide Thuyết trình',
    descEn: 'WorkFlowz overview slides — perfect for group introductions',
    descVi: 'Slide tổng quan WorkFlowz — hoàn hảo để giới thiệu nhóm',
    color: '#fb923c',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&q=60',
  },
];

const GUIDELINES = [
  'Bạn nhận hoa hồng 20% cho mỗi giao dịch thành công qua link của bạn.',
  'Hoa hồng được ghi nhận trong vòng 30 ngày kể từ lần click đầu tiên.',
  'Thanh toán hoa hồng được thực hiện vào ngày 1 và ngày 15 hàng tháng.',
  'Không sử dụng quảng cáo paid search với từ khoá branded của WorkFlowz.',
  'Không giả mạo danh tính nhân viên WorkFlowz khi tiếp thị.',
  'Mọi vi phạm sẽ dẫn đến chấm dứt tài khoản affiliate.',
];

export default function AffiliatePage() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  const copy = (text: string, which: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    if (which === 'link') { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
    else { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0b0f0c]" style={{ paddingTop: '4rem' }}>
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #92e600 0%, transparent 50%)' }} />
          <div className="relative container-max px-4 sm:px-6 py-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: 'rgba(146,230,0,0.1)', border: '1px solid rgba(146,230,0,0.3)', color: '#92e600' }}>
              ✨ {isEn ? 'Affiliate Program' : 'Chương trình Affiliate'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
              {isEn ? 'Earn with WorkFlowz' : 'Kiếm tiền cùng WorkFlowz'}
            </h1>
            <p className="text-[#cedde9] text-base">
              {isEn
                ? 'Share your link, earn 20% commission on every sale. No setup needed — you\'re already in!'
                : 'Chia sẻ link của bạn, nhận 20% hoa hồng cho mỗi giao dịch. Không cần thiết lập — bạn đã tự động tham gia!'}
            </p>
          </div>
        </div>

        <div className="container-max px-4 sm:px-6 pb-16 space-y-8">

          {/* Referral Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border p-6 sm:p-8"
            style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.15)' }}>
            <h2 className="text-lg font-bold text-white mb-5">
              {isEn ? '🔗 Your Referral Tools' : '🔗 Công cụ Referral của bạn'}
            </h2>
            <div className="space-y-4">
              {/* Referral link */}
              <div>
                <p className="text-xs font-semibold text-[#8a9a92] uppercase tracking-wider mb-1.5">
                  {isEn ? 'Referral Link' : 'Link Referral'}
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 rounded-xl border text-sm font-mono text-[#cedde9] truncate"
                    style={{ background: '#0b0f0c', borderColor: 'rgba(146,230,0,0.15)' }}>
                    {REFERRAL_LINK}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => copy(REFERRAL_LINK, 'link')}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm flex-shrink-0 transition-all"
                    style={{ background: '#92e600', color: '#0b0f0c' }}>
                    {copiedLink ? <CheckCircle size={15} /> : <Copy size={15} />}
                    {copiedLink ? (isEn ? 'Copied!' : 'Đã sao!') : (isEn ? 'Copy' : 'Sao chép')}
                  </motion.button>
                </div>
              </div>
              {/* Referral code */}
              <div>
                <p className="text-xs font-semibold text-[#8a9a92] uppercase tracking-wider mb-1.5">
                  {isEn ? 'Referral Code' : 'Mã Referral'}
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 rounded-xl border text-base font-black tracking-widest"
                    style={{ background: '#0b0f0c', borderColor: 'rgba(146,230,0,0.15)', color: '#92e600' }}>
                    {REFERRAL_CODE}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => copy(REFERRAL_CODE, 'code')}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm flex-shrink-0 transition-all border"
                    style={{ borderColor: 'rgba(146,230,0,0.4)', color: '#92e600' }}>
                    {copiedCode ? <CheckCircle size={15} /> : <Copy size={15} />}
                    {copiedCode ? (isEn ? 'Copied!' : 'Đã sao!') : (isEn ? 'Copy' : 'Sao chép')}
                  </motion.button>
                </div>
              </div>
              {/* Policy button */}
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={() => setPolicyOpen(true)}
                className="flex items-center gap-2 text-sm font-semibold mt-2 transition-colors"
                style={{ color: '#92e600' }}>
                <FileText size={14} />
                {isEn ? 'View Affiliate Policies' : 'Xem Chính sách Affiliate'}
                <ExternalLink size={12} />
              </motion.button>
            </div>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: '0', label: isEn ? 'Referrals' : 'Lượt giới thiệu', color: '#60a5fa' },
              { val: '0₫', label: isEn ? 'Total Earned' : 'Tổng thu nhập', color: '#92e600' },
              { val: '20%', label: isEn ? 'Commission Rate' : 'Tỷ lệ hoa hồng', color: '#a78bfa' },
            ].map(({ val, label, color }) => (
              <div key={label} className="rounded-2xl border p-4 text-center"
                style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>
                <p className="text-2xl font-black" style={{ color }}>{val}</p>
                <p className="text-xs text-[#8a9a92] mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Marketing Resources */}
          <div>
            <h2 className="text-lg font-bold text-white mb-1">
              {isEn ? '🎨 Marketing Resources' : '🎨 Tài nguyên Marketing'}
            </h2>
            <p className="text-sm text-[#8a9a92] mb-5">
              {isEn ? 'Ready-to-use materials — no editing needed.' : 'Tài liệu sẵn dùng — không cần chỉnh sửa.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MARKETING_RESOURCES.map(({ icon: Icon, titleEn, titleVi, descEn, descVi, color, img }) => (
                <motion.div
                  key={titleEn}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border overflow-hidden cursor-default"
                  style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>
                  <div className="h-32 overflow-hidden relative">
                    <img src={img} alt={titleEn} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e150d] via-[#0e150d]/40 to-transparent" />
                    <div className="absolute bottom-2 left-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                        <Icon size={14} style={{ color }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold text-white mb-1">{isEn ? titleEn : titleVi}</p>
                    <p className="text-[11px] text-[#8a9a92] leading-relaxed">{isEn ? descEn : descVi}</p>
                    <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: `${color}15`, color }}>
                      {isEn ? 'Template' : 'Mẫu'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border p-6"
            style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>
            <h2 className="text-base font-bold text-white mb-4">
              {isEn ? '📋 Affiliate Guidelines' : '📋 Quy định Affiliate'}
            </h2>
            <ul className="space-y-2.5">
              {GUIDELINES.map((g, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#cedde9]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black mt-0.5"
                    style={{ background: 'rgba(146,230,0,0.1)', color: '#92e600' }}>{i + 1}</span>
                  {g}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* Policy Modal */}
        {policyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setPolicyOpen(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-lg rounded-2xl border p-6 relative"
              style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.2)' }}
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setPolicyOpen(false)}
                className="absolute top-4 right-4 text-[#8a9a92] hover:text-white transition-colors">
                <X size={18} />
              </button>
              <h3 className="text-lg font-black text-white mb-4">
                {isEn ? 'Affiliate Policy' : 'Chính sách Affiliate'}
              </h3>
              <div className="space-y-3 text-sm text-[#cedde9] leading-relaxed max-h-72 overflow-y-auto pr-2">
                <p><strong className="text-white">1. Hoa hồng:</strong> 20% giá trị giao dịch, ghi nhận trong 30 ngày cookie.</p>
                <p><strong className="text-white">2. Thanh toán:</strong> Ngày 1 và 15 hàng tháng, tối thiểu 200.000 VNĐ.</p>
                <p><strong className="text-white">3. Cấm:</strong> Paid search branded keywords, spam, giả mạo nhân viên.</p>
                <p><strong className="text-white">4. Chấm dứt:</strong> WorkFlowz có quyền chấm dứt tài khoản nếu vi phạm.</p>
                <p><strong className="text-white">5. Điều chỉnh:</strong> Chính sách có thể thay đổi với thông báo 14 ngày trước.</p>
              </div>
              <button onClick={() => setPolicyOpen(false)}
                className="mt-5 w-full py-3 rounded-xl font-bold text-sm transition-all"
                style={{ background: '#92e600', color: '#0b0f0c' }}>
                {isEn ? 'Got it' : 'Đã hiểu'}
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
