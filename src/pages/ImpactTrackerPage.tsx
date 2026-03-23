import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart, Globe, Users, BookOpen, Zap, TrendingUp } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ProgressRing from '../components/ProgressRing';
import { initialCommunityStats } from '../data/communityData';
import { formatNumber } from '../utils/helpers';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAppContext } from '../context/AppContext';

// Count-up hook
const useCountUp = (target: number, trigger: boolean, duration = 2000) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let cur = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      cur += step;
      if (cur >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(cur));
    }, 16);
    return () => clearInterval(id);
  }, [target, trigger, duration]);
  return val;
};

const STORIES_VI = [
  { name: 'Nguyễn Thị Lan', location: 'Quận 12, TP.HCM', avatar: 'https://i.pravatar.cc/60?img=47', story: 'Từ sợ máy tính đến tự làm Facebook Ads cho quán ăn, doanh thu tăng 30%.', emoji: '🍜' },
  { name: 'Trần Văn Minh', location: 'Bình Dương', avatar: 'https://i.pravatar.cc/60?img=12', story: 'Học Python 30 ngày, xây tool tự động hóa Excel tiết kiệm 2 tiếng/ngày.', emoji: '💻' },
  { name: 'Lê Thị Hoa', location: 'Đà Nẵng', avatar: 'https://i.pravatar.cc/60?img=32', story: 'Dùng Gemini viết nội dung TikTok, kênh đạt 5.000 followers sau 2 tháng.', emoji: '🎬' },
  { name: 'Phạm Đình Khôi', location: 'Cần Thơ', avatar: 'https://i.pravatar.cc/60?img=15', story: 'Tốt nghiệp khóa Lập trình cơ bản, được nhận việc tại công ty phần mềm.', emoji: '🏆' },
];

const STORIES_EN = [
  { name: 'Nguyen Thi Lan', location: 'District 12, HCM City', avatar: 'https://i.pravatar.cc/60?img=47', story: 'From afraid of computers to running Facebook Ads for her restaurant, revenue up 30%.', emoji: '🍜' },
  { name: 'Tran Van Minh', location: 'Binh Duong', avatar: 'https://i.pravatar.cc/60?img=12', story: 'Learned Python in 30 days, built an Excel automation tool saving 2 hours/day.', emoji: '💻' },
  { name: 'Le Thi Hoa', location: 'Da Nang', avatar: 'https://i.pravatar.cc/60?img=32', story: 'Used Gemini to create TikTok content, reaching 5,000 followers in 2 months.', emoji: '🎬' },
  { name: 'Pham Dinh Khoi', location: 'Can Tho', avatar: 'https://i.pravatar.cc/60?img=15', story: 'Completed the Coding Basics path and landed a job at a software company.', emoji: '🏆' },
];

const ImpactTrackerPage = () => {
  const { t, i18n } = useTranslation();
  const { isCreatorMode } = useAppContext();
  const [stats] = useLocalStorage('skillbridge-stats', initialCommunityStats);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const isEn = i18n.language === 'en';
  const stories = isEn ? STORIES_EN : STORIES_VI;

  const liveCount = useCountUp(stats.livesEmpowered, inView, 2500);
  const pct = Math.round((stats.livesEmpowered / stats.targetMembers) * 100);

  // Creator mode shows extra "courses created" stat
  const [creatorWorkflows] = useLocalStorage<unknown[]>('skillbridge-teacher-courses', []);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-surface-dark">
        <div className="container-max px-4 sm:px-6">
          {/* Header */}
          <div className="text-center py-10">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
              <Heart size={14} fill="currentColor" />
              {t('impact.badge')}
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('impact.title1')}{' '}
              <span className="gradient-text">{t('impact.title2')}</span>
            </h1>
            <p className="text-[#cedde9] dark:text-[#e9eff5] max-w-xl mx-auto">{t('impact.subtitle')}</p>
          </div>

          {/* Big progress ring */}
          <div ref={ref} className="flex flex-col items-center justify-center py-8">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
              <ProgressRing percentage={pct} size={220} strokeWidth={16} color="#00A651"
                trackColor="#E5F7ED" label={formatNumber(liveCount)} sublabel={`/ ${formatNumber(stats.targetMembers)} ${isEn ? 'goal' : 'mục tiêu'}`}
                animate={inView} />
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }} className="mt-4 text-lg font-semibold text-primary">
              {pct}% {t('impact.goalReached')}
            </motion.p>
          </div>

          {/* Stats grid */}
          <div className={`grid ${isCreatorMode ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'} gap-4 mb-12`}>
            {[
              { icon: Globe, value: stats.citiesReached, suffix: isEn ? ' cities' : ' tỉnh', label: t('impact.statsCities'), color: 'text-gblue' },
              { icon: Users, value: stats.totalMembers, suffix: '+', label: t('impact.statsMembers'), color: 'text-primary' },
              { icon: BookOpen, value: stats.workshopsHeld, suffix: '', label: t('impact.statsWorkshops'), color: 'text-accent' },
              { icon: Zap, value: stats.hoursLearned, suffix: '+', label: t('impact.statsHours'), color: 'text-yellow-500' },
              ...(isCreatorMode ? [{ icon: TrendingUp, value: creatorWorkflows.length, suffix: '', label: isEn ? 'Your workflows' : 'Workflow của bạn', color: 'text-accent' }] : []),
            ].map(({ icon: Icon, value, suffix, label, color }, i) => {
              const count = useCountUp(value, inView, 2000 + i * 200);
              return (
                <motion.div key={label} initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.1 }}
                  className="stat-card">
                  <Icon size={22} className={color} />
                  <p className={`text-2xl font-bold ${color}`}>{formatNumber(count)}{suffix}</p>
                  <p className="text-xs text-[#cedde9] dark:text-[#e9eff5]">{label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Mission statement */}
          <div className="glass-card p-6 sm:p-8 mb-12 text-center bg-gradient-to-r from-primary-50 dark:from-primary-950/30 to-transparent">
            <TrendingUp size={32} className="text-primary mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('impact.missionTitle')}</h2>
            <p className="text-[#cedde9] dark:text-[#e9eff5] max-w-lg mx-auto text-sm leading-relaxed">{t('impact.missionDesc')}</p>
          </div>

          {/* Community stories */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">{t('impact.storiesTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stories.map((s, i) => (
                <motion.div key={s.name} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass-card p-5 flex gap-4">
                  <div className="relative flex-shrink-0">
                    <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full object-cover" />
                    <span className="absolute -bottom-1 -right-1 text-lg">{s.emoji}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{s.name}</p>
                      <span className="text-xs text-[#e9eff5]">·</span>
                      <p className="text-xs text-[#e9eff5]">{s.location}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{s.story}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ImpactTrackerPage;
