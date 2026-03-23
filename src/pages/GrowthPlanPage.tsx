import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Map, Share2, Download, CheckCircle, Circle, ArrowRight, Gift, Copy, Check } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { growthPlanMonths } from '../data/communityData';
import { generateShareUrl } from '../utils/helpers';
import useLocalStorage from '../hooks/useLocalStorage';

const mindsetOptions = [
  { value: 1, emoji: '😰', labelVi: 'Rất sợ AI', labelEn: 'Very afraid' },
  { value: 2, emoji: '😟', labelVi: 'Hơi lo lắng', labelEn: 'A bit worried' },
  { value: 3, emoji: '😐', labelVi: 'Trung lập', labelEn: 'Neutral' },
  { value: 4, emoji: '🙂', labelVi: 'Khá thoải mái', labelEn: 'Comfortable' },
  { value: 5, emoji: '🚀', labelVi: 'AI là trợ thủ!', labelEn: 'AI is my tool!' },
];

const GrowthPlanPage = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const [userPoints, setUserPoints] = useLocalStorage<number>('skillbridge-points', 0);
  const [shareActivities, setShareActivities] = useLocalStorage<string[]>('skillbridge-shares', []);
  const [mindsetScore, setMindsetScore] = useLocalStorage<number | null>('skillbridge-mindset', null);
  const [completedMonths, setCompletedMonths] = useLocalStorage<number[]>('skillbridge-growth-months', []);

  const [copied, setCopied] = useState(false);
  const [showShareReward, setShowShareReward] = useState(false);

  const shareUrl = generateShareUrl();

  const handleShare = async () => {
    const shareData = {
      title: 'SkillBridge AI – ' + (isEn ? 'Free digital skills!' : 'Học kỹ năng số miễn phí!'),
      text: isEn
        ? "I'm learning digital skills with SkillBridge AI! Join me 🚀"
        : 'Mình đang học kỹ năng số với AI Mentor tại SkillBridge AI! 🚀',
      url: shareUrl,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2500); }
      const today = new Date().toDateString();
      if (!shareActivities.includes(today)) {
        setShareActivities((prev) => [...prev, today]);
        setUserPoints((prev) => prev + 100);
        setShowShareReward(true);
        setTimeout(() => setShowShareReward(false), 3000);
      }
    } catch { /* user cancelled */ }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleMonth = (month: number) => {
    setCompletedMonths((prev) => prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]);
  };

  return (
    <PageTransition>
      {showShareReward && (
        <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-5 py-3 rounded-xl shadow-glow-green flex items-center gap-2">
          <Gift size={18} />{t('growth.shareReward')}
        </motion.div>
      )}

      <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-surface-dark">
        <div className="container-max px-4 sm:px-6">
          {/* Header */}
          <div className="text-center py-10">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
              <Map size={14} />{t('growth.badge')}
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('growth.title1')}{' '}
              <span className="gradient-text">{t('growth.title2')}</span>
            </h1>
            <p className="text-[#cedde9] dark:text-[#e9eff5] max-w-xl mx-auto">{t('growth.subtitle')}</p>
          </div>

          {/* Viral share */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 sm:p-8 mb-10 bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden relative">
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute -right-4 -bottom-8 w-24 h-24 rounded-full bg-white/5" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
              <div className="text-5xl">🚀</div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold mb-2">{t('growth.shareTitle')}</h2>
                <p className="text-primary-100 text-sm mb-4">{t('growth.shareDesc')}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-all">
                    <Share2 size={18} />{t('growth.shareBtn')}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={copyLink}
                    className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-medium px-6 py-3 rounded-xl transition-all">
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? t('growth.copied') : t('growth.copyBtn')}
                  </motion.button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-primary-100">
              <Gift size={14} />
              {t('growth.pointsNote')} <strong className="text-white mx-1">{userPoints}</strong> {t('growth.pointsShared')} <strong className="text-white mx-1">{shareActivities.length}</strong> {t('growth.pointsTimes')}
            </div>
          </motion.div>

          {/* Mindset survey */}
          <div className="glass-card p-6 mb-10">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{t('growth.mindsetTitle')}</h2>
            <p className="text-sm text-[#cedde9] dark:text-[#e9eff5] mb-5">{t('growth.mindsetDesc')}</p>
            <div className="grid grid-cols-5 gap-2">
              {mindsetOptions.map((opt) => (
                <motion.button key={opt.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setMindsetScore(opt.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    mindsetScore === opt.value ? 'border-primary bg-primary-50 dark:bg-primary-900/30' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/50 hover:border-primary/30'
                  }`}>
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-[10px] text-center text-[#cedde9] dark:text-[#e9eff5] leading-tight hidden sm:block">
                    {isEn ? opt.labelEn : opt.labelVi}
                  </span>
                </motion.button>
              ))}
            </div>
            {mindsetScore && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-primary font-medium">
                {mindsetScore >= 4
                  ? (isEn ? '🎉 Excellent! You\'re ready to use AI to grow!' : '🎉 Tuyệt vời! Bạn đã sẵn sàng dùng AI để phát triển!')
                  : (isEn ? '💪 No worries! SkillBridge AI will help you get confident day by day.' : '💪 Đừng lo! SkillBridge AI sẽ giúp bạn tự tin hơn từng ngày.')}
              </motion.p>
            )}
          </div>

          {/* 6-month roadmap */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('growth.roadmapTitle')}</h2>
              <button onClick={() => window.print()}
                className="btn-secondary flex items-center gap-2 text-sm !px-4 !py-2">
                <Download size={15} />
                <span className="hidden sm:inline">{t('growth.downloadPDF')}</span>
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
              <div className="space-y-4">
                {growthPlanMonths.map((month, i) => {
                  const isDone = completedMonths.includes(month.month);
                  return (
                    <motion.div key={month.month} initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                      className={`sm:pl-16 relative ${isDone ? 'opacity-80' : ''}`}>
                      <div className={`absolute left-3 top-5 sm:left-2.5 w-5 h-5 rounded-full hidden sm:flex items-center justify-center z-10 border-2 border-white dark:border-surface-dark ${isDone ? 'bg-primary' : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600'}`}>
                        {isDone ? <CheckCircle size={14} className="text-white" /> : null}
                      </div>
                      <div className={`glass-card p-5 ${isDone ? 'mission-complete' : ''}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="badge-primary text-xs px-2 py-0.5 rounded-full">
                                {t('growth.month')} {month.month}
                              </span>
                              <span className="text-xs text-[#e9eff5]">{t('growth.target')}: {month.targetReach.toLocaleString('vi-VN')} {t('growth.people')}</span>
                            </div>
                            <h3 className={`font-bold text-base mb-3 ${isDone ? 'text-[#e9eff5] dark:text-gray-600' : 'text-gray-900 dark:text-white'}`}>
                              {month.title}
                            </h3>
                            <ul className="space-y-1.5 mb-3">
                              {month.goals.map((goal) => (
                                <li key={goal} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                  <ArrowRight size={14} className="text-primary flex-shrink-0 mt-0.5" />{goal}
                                </li>
                              ))}
                            </ul>
                            <div className="flex flex-wrap gap-1.5">
                              {month.channels.map((ch) => (
                                <span key={ch} className="badge-blue text-[11px] px-2 py-0.5 rounded-full">{ch}</span>
                              ))}
                            </div>
                          </div>
                          <button onClick={() => toggleMonth(month.month)}
                            className={`flex-shrink-0 mt-1 transition-colors ${isDone ? 'text-primary' : 'text-gray-300 dark:text-gray-600 hover:text-primary'}`}>
                            {isDone ? <CheckCircle size={24} fill="currentColor" /> : <Circle size={24} />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="glass-card p-8 text-center bg-gradient-to-br from-primary-50 dark:from-primary-950/30 to-white dark:to-surface-dark">
            <div className="text-5xl mb-4">🌱</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('growth.ctaTitle')}</h2>
            <p className="text-[#cedde9] dark:text-[#e9eff5] mb-6 max-w-md mx-auto">{t('growth.ctaDesc')}</p>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleShare}
              className="btn-primary inline-flex items-center gap-2">
              <Share2 size={18} />{t('growth.ctaBtn')}
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default GrowthPlanPage;
