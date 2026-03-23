import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play, Star, Clock, Users, Lock, TrendingUp } from 'lucide-react';
import { Workflow } from '../types';

interface WorkflowCardProps {
  workflow: Workflow;
  index?: number;
  compact?: boolean;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  writing:  { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
  coding:   { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' },
  business: { bg: 'rgba(249, 115, 22, 0.15)', text: '#fb923c', border: 'rgba(249, 115, 22, 0.3)' },
  design:   { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
  data:     { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
  personal: { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15', border: 'rgba(234, 179, 8, 0.3)' },
  ai:       { bg: 'rgba(146, 230, 0, 0.15)', text: '#b3f244', border: 'rgba(146, 230, 0, 0.3)' },
  digital:  { bg: 'rgba(20, 184, 166, 0.15)', text: '#5eead4', border: 'rgba(20, 184, 166, 0.3)' },
};

const CATEGORY_LABELS_VI: Record<string, string> = {
  writing: '✍️ Viết lách',
  coding: '💻 Lập trình',
  business: '🚀 Kinh doanh',
  design: '🎨 Thiết kế',
  data: '📊 Dữ liệu',
  personal: '💡 Phát triển bản thân',
  ai: '🤖 AI',
  digital: '💻 Kỹ năng số',
};

const CATEGORY_LABELS_EN: Record<string, string> = {
  writing: '✍️ Writing',
  coding: '💻 Coding',
  business: '🚀 Business',
  design: '🎨 Design',
  data: '📊 Data',
  personal: '💡 Personal Dev',
  ai: '🤖 AI',
  digital: '💻 Digital',
};

const WorkflowCard = ({ workflow, index = 0, compact = false }: WorkflowCardProps) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const title = isEn && workflow.titleEn ? workflow.titleEn : workflow.title;
  const desc = isEn && workflow.descriptionEn ? workflow.descriptionEn : workflow.description;
  const categoryLabels = isEn ? CATEGORY_LABELS_EN : CATEGORY_LABELS_VI;
  const categoryStyle = CATEGORY_STYLES[workflow.category] || CATEGORY_STYLES.personal;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.07, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="card p-3 flex items-center gap-3 cursor-pointer group"
      >
        <img src={workflow.thumbnail} alt={title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-0.5 text-xs text-yellow-500"><Star size={10} fill="currentColor" />{workflow.rating}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {workflow.runCount.toLocaleString('vi-VN')} lượt chạy</span>
          </div>
        </div>
        {workflow.price === 0 ? (
          <span className="pill pill-purple text-[10px] px-2 py-0.5 whitespace-nowrap">{t('common.free')}</span>
        ) : (
          <span className="text-xs font-bold text-primary whitespace-nowrap">{(workflow.price / 1000).toFixed(0)}K</span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="wf-card group"
    >
      {/* Thumbnail */}
      <div className="wf-card-image">
        <img
          src={workflow.thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Category chip */}
        <div className="absolute top-3 left-3">
          <span 
            className="pill text-[11px] font-medium"
            style={{ 
              background: categoryStyle.bg, 
              color: categoryStyle.text, 
              border: `1px solid ${categoryStyle.border}` 
            }}
          >
            {categoryLabels[workflow.category]}
          </span>
        </div>

        {/* Price */}
        <div className="absolute top-3 right-3">
          {workflow.price === 0 ? (
            <span 
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--grad-accent)', color: 'var(--bg-primary)' }}
            >
              {t('common.free')}
            </span>
          ) : (
            <span className="bg-white/95 text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {(workflow.price / 1000).toFixed(0)}K VNĐ
            </span>
          )}
        </div>

        {/* Play overlay */}
        <Link to={`/workflow/${workflow.id}`}>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ 
                background: 'var(--grad-accent)', 
                boxShadow: '0 0 30px rgba(146, 230, 0, 0.5)' 
              }}
            >
              <Play size={22} className="ml-1" style={{ color: 'var(--bg-primary)' }} />
            </div>
          </div>
        </Link>

        {/* Completion bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${workflow.completionRate}%`, background: 'var(--grad-accent)' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="wf-card-title mb-1.5">{title}</h3>
        <p className="text-xs mb-3 line-clamp-2" style={{ color: '#e9eff5' }}>{desc}</p>

        {/* Stats row */}
        <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock size={11} />{workflow.estimatedMinutes} phút</span>
            <span className="flex items-center gap-1"><Users size={11} />{workflow.runCount.toLocaleString('vi-VN')}</span>
            <span className="flex items-center gap-1 text-yellow-500"><Star size={11} fill="currentColor" />{workflow.rating}</span>
          </div>
          <span className="flex items-center gap-1 font-semibold text-primary">
            <TrendingUp size={11} />{workflow.completionRate}%
          </span>
        </div>

        {/* Creator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {workflow.creatorAvatar ? (
              <img src={workflow.creatorAvatar} alt={workflow.creatorName} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-primary"
                style={{ background: 'rgba(146, 230, 0, 0.15)' }}
              >
                {workflow.creatorName[0]}
              </div>
            )}
            <span className="text-xs truncate max-w-[100px]" style={{ color: 'var(--text-muted)' }}>{workflow.creatorName}</span>
          </div>
          <Link
            to={`/workflow/${workflow.id}`}
            className="flex items-center gap-1 text-xs text-primary font-semibold transition-all duration-200 hover:gap-2"
          >
            {workflow.price > 0 ? <><Lock size={11} />{t('workflow.unlock')}</> : <><Play size={11} />{t('workflow.runNow')}</>}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkflowCard;
