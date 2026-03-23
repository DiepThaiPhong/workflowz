import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Award, Download, Share2, CheckCircle, Zap, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import useLocalStorage from '../hooks/useLocalStorage';
import { formatDate } from '../utils/helpers';

interface CompletedWorkflow {
  id: string;
  title: string;
  completedAt: string;
  xpEarned: number;
}

const CertificatePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const certRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shared, setShared] = useState(false);

  const [profile] = useLocalStorage('workflowz-profile', { name: 'WorkFlowz Learner', bio: '' });
  const [totalXP] = useLocalStorage('skillbridge-xp', 240);
  const [streak] = useLocalStorage('skillbridge-streak', 3);
  const [completedWorkflows] = useLocalStorage<CompletedWorkflow[]>('workflowz-completed', [
    { id: '1', title: 'Write a Professional Email', completedAt: new Date().toISOString(), xpEarned: 120 },
    { id: '2', title: 'Build a Job-Ready Resume', completedAt: new Date().toISOString(), xpEarned: 150 },
  ]);

  const isEn = i18n.language === 'en';
  const today = new Date().toLocaleDateString(isEn ? 'en-US' : 'vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownload = async () => {
    if (!certRef.current) return;
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: '#0A0F1C',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `WorkFlowz-Certificate-${profile.name.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Download failed:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    const text = isEn
      ? `I just earned a WorkFlowz Certificate! 🎓 Completed ${completedWorkflows.length} workflows with ${totalXP} XP. #WorkFlowz #DigitalSkills`
      : `Mình vừa nhận chứng chỉ WorkFlowz! 🎓 Hoàn thành ${completedWorkflows.length} workflow với ${totalXP} XP. #WorkFlowz #KỹNăngSố`;
    if (navigator.share) {
      navigator.share({ title: 'WorkFlowz Certificate', text });
    } else {
      navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  if (completedWorkflows.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-20 pb-16 flex items-center justify-center bg-gray-50 dark:bg-surface-dark">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-6">🏅</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('certificate.pageTitle')}</h1>
            <p className="text-[#cedde9] dark:text-[#e9eff5] mb-6">{t('certificate.noWorkflows')}</p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/marketplace')} className="btn-primary">
              {t('certificate.goToMarketplace')} <ArrowRight size={16} className="inline ml-1" />
            </motion.button>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-surface-dark">
        <div className="container-max px-4 sm:px-6 max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Award size={14} /> {t('certificate.achievement')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('certificate.pageTitle')}</h1>
            <p className="text-[#cedde9] dark:text-[#e9eff5]">{t('certificate.pageSubtitle')}</p>
          </motion.div>

          {/* Certificate Visual */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }} className="mb-8">
            <div ref={certRef}
              className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #0A0F1C 0%, #0D1829 50%, #0A0F1C 100%)' }}>
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-primary rounded-br-2xl" />

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

              <div className="relative p-8 sm:p-14 text-center">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Zap size={28} className="text-primary" fill="#00A651" />
                  <span className="text-2xl font-black text-white tracking-tight">WorkFlowz</span>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-light text-primary/80 mb-2 tracking-widest uppercase">
                  {t('certificate.certTitle')}
                </h2>
                <div className="w-32 h-px bg-primary/40 mx-auto mb-6" />

                {/* Body */}
                <p className="text-[#e9eff5] mb-3 text-sm">{t('certificate.certBody')}</p>
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">{profile.name}</h3>

                <p className="text-[#e9eff5] mb-2 text-sm">
                  {t('certificate.certCompleted')} <span className="text-primary font-bold">{completedWorkflows.length}</span> {t('certificate.certWorkflows')}
                </p>

                {/* Stats row */}
                <div className="flex items-center justify-center gap-8 my-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{totalXP}</div>
                    <div className="text-xs text-[#cedde9]">{t('certificate.certXP')}</div>
                  </div>
                  <div className="w-px h-10 bg-gray-700" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00D4FF]">{streak}</div>
                    <div className="text-xs text-[#cedde9]">{isEn ? 'Day Streak' : 'Chuỗi ngày'}</div>
                  </div>
                  <div className="w-px h-10 bg-gray-700" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{completedWorkflows.length}</div>
                    <div className="text-xs text-[#cedde9]">{isEn ? 'Workflows' : 'Workflow'}</div>
                  </div>
                </div>

                {/* Completed workflows */}
                <div className="text-left bg-white/5 rounded-xl p-4 mb-6 max-w-sm mx-auto">
                  {completedWorkflows.slice(0, 3).map((w) => (
                    <div key={w.id} className="flex items-center gap-2 py-1.5">
                      <CheckCircle size={14} className="text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-300 truncate">{w.title}</span>
                      <span className="ml-auto text-xs text-primary font-bold">+{w.xpEarned} XP</span>
                    </div>
                  ))}
                </div>

                {/* Date */}
                <div className="flex items-center justify-center gap-2 text-[#cedde9] text-sm mb-4">
                  <Calendar size={13} />
                  <span>{t('certificate.certDate')}: <strong className="text-[#e9eff5]">{today}</strong></span>
                </div>

                {/* Signature */}
                <div className="w-24 h-px bg-gray-600 mx-auto my-2" />
                <p className="text-xs text-[#cedde9]">{t('certificate.certSignature')}</p>
                <p className="text-xs text-gray-600 mt-1">{t('certificate.certIssued')}</p>
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleDownload} disabled={isDownloading}
              className="btn-primary flex items-center justify-center gap-2 min-w-[180px]">
              <Download size={16} />
              {isDownloading ? (isEn ? 'Generating...' : 'Đang tạo...') : t('certificate.downloadPNG')}
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleShare}
              className="btn-secondary flex items-center justify-center gap-2">
              <Share2 size={16} />
              {shared ? (isEn ? 'Copied!' : 'Đã sao chép!') : t('certificate.shareBtn')}
            </motion.button>
          </motion.div>

          {/* Completed workflows list */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }} className="glass-card p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-primary" />
              {t('certificate.completedCount')} ({completedWorkflows.length})
            </h3>
            <div className="space-y-3">
              {completedWorkflows.map((w, i) => (
                <motion.div key={w.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{w.title}</p>
                    <p className="text-xs text-[#e9eff5]">{formatDate ? formatDate(w.completedAt) : new Date(w.completedAt).toLocaleDateString()}</p>
                  </div>
                  <span className="badge-primary text-xs px-2 py-0.5">+{w.xpEarned} XP</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CertificatePage;
