import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, TrendingUp, Star, Clock, Zap } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import WorkflowCard from '../components/WorkflowCard';
import { ALL_WORKFLOWS } from '../data/workflowData';
import { WorkflowCategory } from '../types';

const CATEGORIES: { id: WorkflowCategory | 'all'; labelVi: string; labelEn: string; icon: string }[] = [
  { id: 'all',                         labelVi: 'Tất cả',           labelEn: 'All',              icon: '🌐' },
  { id: 'writing',                     labelVi: 'Viết lách',        labelEn: 'Writing',          icon: '✍️' },
  { id: 'coding',                      labelVi: 'Lập trình',        labelEn: 'Coding',           icon: '💻' },
  { id: 'business',                    labelVi: 'Kinh doanh',       labelEn: 'Business',         icon: '🚀' },
  { id: 'data',                        labelVi: 'Dữ liệu',          labelEn: 'Data',             icon: '📊' },
  { id: 'design',                      labelVi: 'Thiết kế',         labelEn: 'Design',           icon: '🎨' },
  { id: 'personal',                    labelVi: 'Bản thân',         labelEn: 'Personal',         icon: '💡' },
  { id: 'ai' as WorkflowCategory,      labelVi: 'AI & Tự động hoá', labelEn: 'AI Productivity',  icon: '🤖' },
  { id: 'digital' as WorkflowCategory, labelVi: 'Kỹ năng số',       labelEn: 'Digital Literacy', icon: '📱' },
];

const SORT_OPTIONS = [
  { id: 'popular', labelVi: 'Phổ biến nhất', labelEn: 'Most Popular' },
  { id: 'rating',  labelVi: 'Đánh giá cao',  labelEn: 'Top Rated' },
  { id: 'newest',  labelVi: 'Mới nhất',      labelEn: 'Newest' },
  { id: 'free',    labelVi: 'Miễn phí',      labelEn: 'Free Only' },
];

const FEATURED = ALL_WORKFLOWS.slice(0, 2);

const MarketplacePage = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<WorkflowCategory | 'all'>('all');
  const [sort, setSort] = useState('popular');

  // Sync category from ?category= URL param (from Discover dropdown navigation)
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat) {
      setCategory(urlCat as WorkflowCategory | 'all');
    } else {
      setCategory('all');
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...ALL_WORKFLOWS];
    if (category !== 'all') result = result.filter((w) => (w.category as string) === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((w) =>
        w.title.toLowerCase().includes(q) ||
        (w.titleEn?.toLowerCase().includes(q)) ||
        w.tags.some((tag) => tag.includes(q))
      );
    }
    if (sort === 'popular') result.sort((a, b) => b.runCount - a.runCount);
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sort === 'newest') result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === 'free') result = result.filter((w) => w.price === 0);
    return result;
  }, [category, search, sort]);

  const currentCatLabel = CATEGORIES.find(c => c.id === category);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16 bg-[#0b0f0c]">
        {/* Hero section */}
        <div className="bg-[#0e150d] border-b border-[#92e600]/10 text-white py-12 px-4 mb-8">
          <div className="container-max text-center">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium mb-4"
              style={{ background: 'rgba(146,230,0,0.08)', borderColor: 'rgba(146,230,0,0.25)', color: '#92e600' }}>
              <TrendingUp size={12} />
              {isEn ? 'Workflow Marketplace' : 'Chợ Workflow'}
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              {currentCatLabel && category !== 'all' ? (
                <>
                  {isEn ? currentCatLabel.labelEn : currentCatLabel.labelVi}{' '}
                  <span style={{ color: '#92e600' }}>{isEn ? 'Workflows' : 'Workflow'}</span>
                </>
              ) : (
                isEn ? <>Discover & Run <span style={{ color: '#92e600' }}>Workflows</span></> : <>Khám Phá & Chạy <span style={{ color: '#92e600' }}>Workflow</span></>
              )}
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto mb-6">
              {isEn
                ? 'Browse AI-powered workflows created by the community. Run them instantly and get real output artifacts.'
                : 'Duyệt qua các workflow AI được tạo bởi cộng đồng. Chạy ngay và nhận kết quả thực tế.'}
            </p>
            {/* Search bar */}
            <div className="relative max-w-xl mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isEn ? 'Search workflows...' : 'Tìm kiếm workflow...'}
                className="w-full pl-11 pr-4 py-3 rounded-xl border text-white placeholder-gray-500 focus:outline-none transition-all"
                style={{ background: 'rgba(146,230,0,0.06)', borderColor: 'rgba(146,230,0,0.2)' }}
              />
            </div>
          </div>
        </div>

        <div className="container-max px-4 sm:px-6">
          {/* Featured workflows */}
          {category === 'all' && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Star size={18} className="text-yellow-500" fill="currentColor" />
                {isEn ? 'Featured Workflows' : 'Workflow Nổi Bật'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FEATURED.map((wf, i) => (
                  <motion.div
                    key={wf.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl overflow-hidden flex flex-col sm:flex-row gap-0 border"
                    style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.15)' }}
                  >
                    <img src={wf.thumbnail} alt={wf.title} className="w-full sm:w-32 h-36 sm:h-auto object-cover flex-shrink-0" />
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                          style={{ background: 'rgba(146,230,0,0.15)', color: '#92e600' }}>⭐ Featured</span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} />{wf.estimatedMinutes}{isEn ? ' min' : ' phút'}</span>
                      </div>
                      <h3 className="font-bold text-sm text-white mb-1">
                        {isEn && wf.titleEn ? wf.titleEn : wf.title}
                      </h3>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                        {isEn && wf.descriptionEn ? wf.descriptionEn : wf.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-yellow-500"><Star size={11} fill="currentColor" />{wf.rating}</span>
                        <span className="text-xs text-gray-500">· {wf.runCount.toLocaleString()} runs</span>
                        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold"
                          style={{ background: 'rgba(146,230,0,0.15)', color: '#92e600' }}>{t('common.free')}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar filters */}
            <div className="lg:w-52 flex-shrink-0">
              <div className="rounded-2xl p-4 sticky top-20 border" style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Filter size={11} />{isEn ? 'Categories' : 'Chủ đề'}
                </h3>
                <div className="flex flex-col gap-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all"
                      style={category === cat.id
                        ? { background: 'rgba(146,230,0,0.12)', color: '#92e600', fontWeight: 600 }
                        : { color: '#9ca3af' }}
                    >
                      <span>{cat.icon}</span>
                      {isEn ? cat.labelEn : cat.labelVi}
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(146,230,0,0.1)' }}>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                    <Zap size={11} />{isEn ? 'Sort By' : 'Sắp xếp'}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSort(opt.id)}
                        className="px-3 py-2 rounded-lg text-sm text-left transition-all"
                        style={sort === opt.id
                          ? { background: 'rgba(146,230,0,0.12)', color: '#92e600', fontWeight: 600 }
                          : { color: '#9ca3af' }}
                      >
                        {isEn ? opt.labelEn : opt.labelVi}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  {filtered.length} {isEn ? 'workflows found' : 'workflow được tìm thấy'}
                  {category !== 'all' && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(146,230,0,0.1)', color: '#92e600' }}>
                      {isEn ? currentCatLabel?.labelEn : currentCatLabel?.labelVi}
                    </span>
                  )}
                </p>
                {category !== 'all' && (
                  <button onClick={() => setCategory('all')} className="text-xs text-gray-500 hover:text-white transition-colors">
                    × {isEn ? 'Clear filter' : 'Xóa lọc'}
                  </button>
                )}
              </div>
              {filtered.length === 0 ? (
                <div className="rounded-2xl p-10 text-center border" style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>
                  <div className="text-5xl mb-3">🔍</div>
                  <p className="text-gray-400">
                    {isEn ? 'No workflows found. Try a different filter.' : 'Không tìm thấy workflow. Thử bộ lọc khác.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((wf, i) => (
                    <WorkflowCard key={wf.id} workflow={wf} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MarketplacePage;
