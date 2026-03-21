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

const CATEGORY_COLORS: Record<string, string> = {
  writing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  coding: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  business: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  design: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  data: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  personal: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
};

const CATEGORY_LABELS_VI: Record<string, string> = {
  writing: '✍️ Viết lách',
  coding: '💻 Lập trình',
  business: '🚀 Kinh doanh',
  design: '🎨 Thiết kế',
  data: '📊 Dữ liệu',
  personal: '💡 Phát triển bản thân',
};

const CATEGORY_LABELS_EN: Record<string, string> = {
  writing: '✍️ Writing',
  coding: '💻 Coding',
  business: '🚀 Business',
  design: '🎨 Design',
  data: '📊 Data',
  personal: '💡 Personal Dev',
};

const WorkflowCard = ({ workflow, index = 0, compact = false }: WorkflowCardProps) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const title = isEn && workflow.titleEn ? workflow.titleEn : workflow.title;
  const desc = isEn && workflow.descriptionEn ? workflow.descriptionEn : workflow.description;
  const categoryLabels = isEn ? CATEGORY_LABELS_EN : CATEGORY_LABELS_VI;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.07 }}
        className="glass-card p-3 flex items-center gap-3 hover:shadow-lg transition-all cursor-pointer"
      >
        <img src={workflow.thumbnail} alt={title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-0.5 text-xs text-yellow-500"><Star size={10} fill="currentColor" />{workflow.rating}</span>
            <span className="text-xs text-gray-400">· {workflow.runCount.toLocaleString('vi-VN')} lượt chạy</span>
          </div>
        </div>
        {workflow.price === 0 ? (
          <span className="badge-primary text-[10px] px-2 py-0.5 whitespace-nowrap">{t('common.free')}</span>
        ) : (
          <span className="text-xs font-bold text-accent whitespace-nowrap">{(workflow.price / 1000).toFixed(0)}K</span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card overflow-hidden group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={workflow.thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Category chip */}
        <div className="absolute top-2 left-2">
          <span className={`badge text-[11px] px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[workflow.category]}`}>
            {categoryLabels[workflow.category]}
          </span>
        </div>

        {/* Price */}
        <div className="absolute top-2 right-2">
          {workflow.price === 0 ? (
            <span className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full">{t('common.free')}</span>
          ) : (
            <span className="bg-white/90 text-gray-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              {(workflow.price / 1000).toFixed(0)}K VNĐ
            </span>
          )}
        </div>

        {/* Play overlay */}
        <Link to={`/workflow/${workflow.id}`}>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-glow-green">
              <Play size={22} className="text-white ml-1" />
            </div>
          </div>
        </Link>

        {/* Completion bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${workflow.completionRate}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2 leading-snug">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{desc}</p>

        {/* Stats row */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock size={11} />{workflow.estimatedMinutes} phút</span>
            <span className="flex items-center gap-1"><Users size={11} />{workflow.runCount.toLocaleString('vi-VN')}</span>
            <span className="flex items-center gap-1 text-yellow-500"><Star size={11} fill="currentColor" />{workflow.rating}</span>
          </div>
          <span className="flex items-center gap-1 text-primary font-medium">
            <TrendingUp size={11} />{workflow.completionRate}%
          </span>
        </div>

        {/* Creator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {workflow.creatorAvatar ? (
              <img src={workflow.creatorAvatar} alt={workflow.creatorName} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                {workflow.creatorName[0]}
              </div>
            )}
            <span className="text-xs text-gray-400 truncate max-w-[100px]">{workflow.creatorName}</span>
          </div>
          <Link
            to={`/workflow/${workflow.id}`}
            className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
          >
            {workflow.price > 0 ? <><Lock size={11} />{t('workflow.unlock')}</> : <><Play size={11} />{t('workflow.runNow')}</>}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkflowCard;
