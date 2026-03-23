import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Search, TrendingUp, Star, Clock, ChevronDown, ChevronUp, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import WorkflowCard from '../components/WorkflowCard';
import { ALL_WORKFLOWS } from '../data/workflowData';
import { WorkflowCategory } from '../types';

const CATEGORIES: { id: WorkflowCategory; labelVi: string; labelEn: string; icon: string }[] = [
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
  { id: 'popular', labelVi: 'Phổ biến nhất', labelEn: 'Most Popular', ascending: false },
  { id: 'rating',  labelVi: 'Đánh giá cao',  labelEn: 'Top Rated', ascending: false },
  { id: 'newest',  labelVi: 'Mới nhất',      labelEn: 'Newest', ascending: false },
  { id: 'oldest',  labelVi: 'Cũ nhất',       labelEn: 'Oldest', ascending: true },
];

const LEVEL_OPTIONS = [
  { id: 'beginner', labelVi: 'Cơ bản',    labelEn: 'Beginner' },
  { id: 'intermediate', labelVi: 'Trung bình', labelEn: 'Intermediate' },
  { id: 'advanced', labelVi: 'Nâng cao',  labelEn: 'Advanced' },
];

const DURATION_OPTIONS = [
  { id: 'short',  labelVi: '< 15 phút',    labelEn: '< 15 min' },
  { id: 'medium', labelVi: '15-30 phút',   labelEn: '15-30 min' },
  { id: 'long',   labelVi: '> 30 phút',    labelEn: '> 30 min' },
];

const PRICE_OPTIONS = [
  { id: 'free', labelVi: 'Miễn phí',   labelEn: 'Free' },
  { id: 'paid', labelVi: 'Có phí',     labelEn: 'Paid' },
];

const FEATURED = ALL_WORKFLOWS.slice(0, 2);

// Single-select (radio) filter section component
const RadioFilterSection = <T extends { id: string }>({
  title,
  items,
  selectedId,
  onSelect,
  renderLabel,
}: {
  title: string;
  items: T[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  renderLabel: (item: T) => React.ReactNode;
}) => {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
        {title}
      </h3>
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <label
              key={item.id}
              className="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200 group"
              style={{ color: isSelected ? '#92e600' : '#e9eff5' }}
            >
              <div 
                className="flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all duration-200 flex-shrink-0"
                style={{ 
                  borderColor: isSelected ? '#92e600' : 'var(--border-hover)',
                  padding: '2px'
                }}
              >
                <div 
                  className="w-full h-full rounded-full transition-all duration-200"
                  style={{ 
                    background: isSelected ? '#92e600' : 'transparent',
                    boxShadow: isSelected ? '0 0 8px rgba(146, 230, 0, 0.5)' : 'none'
                  }}
                />
              </div>
              <input
                type="radio"
                name={title}
                checked={isSelected}
                onChange={() => onSelect(isSelected ? null : item.id)}
                className="sr-only"
              />
              <span className="text-sm group-hover:text-primary transition-colors">
                {renderLabel(item)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

// Multi-select filter section component
const MultiFilterSection = <T extends { id: string }>({
  title,
  items,
  selectedIds,
  onToggle,
  renderLabel,
  isEn,
  showAll,
  onToggleShowAll,
  maxVisible = 3,
}: {
  title: string;
  items: T[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  renderLabel: (item: T) => React.ReactNode;
  isEn: boolean;
  showAll: boolean;
  onToggleShowAll: () => void;
  maxVisible?: number;
}) => {
  const visibleItems = showAll ? items : items.slice(0, maxVisible);
  const hasMore = items.length > maxVisible;

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
        {title}
      </h3>
      <div className="flex flex-col gap-1">
        {visibleItems.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <label
              key={item.id}
              className="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200 group"
              style={{ color: isSelected ? '#92e600' : '#e9eff5' }}
            >
              <div 
                className="flex items-center justify-center w-4 h-4 rounded border-2 transition-all duration-200 flex-shrink-0"
                style={{ 
                  borderColor: isSelected ? '#92e600' : 'var(--border-hover)',
                  background: isSelected ? '#92e600' : 'transparent',
                  boxShadow: isSelected ? '0 0 8px rgba(146, 230, 0, 0.5)' : 'none'
                }}
              >
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path 
                      d="M2 5L4 7L8 3" 
                      stroke="var(--bg-primary)" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(item.id)}
                className="sr-only"
              />
              <span className="text-sm group-hover:text-primary transition-colors">
                {renderLabel(item)}
              </span>
            </label>
          );
        })}
      </div>
      {hasMore && (
        <button
          onClick={onToggleShowAll}
          className="flex items-center gap-1 mt-2 px-2 text-xs font-medium transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          {showAll ? (
            <>
              <ChevronUp size={12} />
              {isEn ? 'Show less' : 'Thu gọn'}
            </>
          ) : (
            <>
              <ChevronDown size={12} />
              {isEn ? `Show ${items.length - maxVisible} more` : `Xem thêm ${items.length - maxVisible}`}
            </>
          )}
        </button>
      )}
    </div>
  );
};

const MarketplacePage = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<WorkflowCategory[]>([]);
  const [sort, setSort] = useState('popular');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Toggle multi-select filter
  const toggleFilter = (id: string, selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sync category from ?category= URL param (from Discover dropdown navigation)
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat && CATEGORIES.find(c => c.id === urlCat)) {
      setSelectedCategories([urlCat as WorkflowCategory]);
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...ALL_WORKFLOWS];
    
    // Category filter (multi-select)
    if (selectedCategories.length > 0) {
      result = result.filter((w) => selectedCategories.includes(w.category as WorkflowCategory));
    }
    
    // Level filter (multi-select)
    if (selectedLevels.length > 0) {
      result = result.filter((w) => selectedLevels.includes(w.level || ''));
    }
    
    // Duration filter (multi-select)
    if (selectedDurations.length > 0) {
      result = result.filter((w) => {
        const mins = w.estimatedMinutes || 0;
        const matches: string[] = [];
        if (mins < 15) matches.push('short');
        if (mins >= 15 && mins <= 30) matches.push('medium');
        if (mins > 30) matches.push('long');
        return matches.some(m => selectedDurations.includes(m));
      });
    }
    
    // Price filter (single-select)
    if (selectedPrice) {
      result = result.filter((w) => {
        if (selectedPrice === 'free' && w.price === 0) return true;
        if (selectedPrice === 'paid' && w.price > 0) return true;
        return false;
      });
    }
    
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((w) =>
        w.title.toLowerCase().includes(q) ||
        (w.titleEn?.toLowerCase().includes(q)) ||
        w.tags.some((tag) => tag.includes(q))
      );
    }
    
    // Sort
    if (sort === 'popular') result.sort((a, b) => b.runCount - a.runCount);
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sort === 'newest') result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === 'oldest') result.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    
    return result;
  }, [selectedCategories, search, sort, selectedLevels, selectedDurations, selectedPrice]);

  const currentSortOption = SORT_OPTIONS.find(o => o.id === sort);

  // Count active filters
  const activeFiltersCount = selectedLevels.length + selectedDurations.length + (selectedPrice ? 1 : 0) + selectedCategories.length;

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedDurations([]);
    setSelectedPrice(null);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-16" style={{ background: 'var(--bg-primary)' }}>
        {/* Hero section */}
        <div 
          className="py-12 px-4 mb-8 border-b"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="container-max text-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pill pill-purple mb-4"
            >
              <TrendingUp size={12} />
              {isEn ? 'Workflow Marketplace' : 'Chợ Workflow'}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl font-display font-bold mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              {selectedCategories.length === 1 ? (
                <>
                  {isEn ? CATEGORIES.find(c => c.id === selectedCategories[0])?.labelEn : CATEGORIES.find(c => c.id === selectedCategories[0])?.labelVi}{' '}
                  <span className="text-primary">{isEn ? 'Workflows' : 'Workflow'}</span>
                </>
              ) : (
                isEn ? <>Discover & Run <span className="text-primary">Workflows</span></> : <>Khám Phá & Chạy <span className="text-primary">Workflow</span></>
              )}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-lg mx-auto mb-6"
              style={{ color: '#e9eff5' }}
            >
              {isEn
                ? 'Browse AI-powered workflows created by the community. Run them instantly and get real output artifacts.'
                : 'Duyệt qua các workflow AI được tạo bởi cộng đồng. Chạy ngay và nhận kết quả thực tế.'}
            </motion.p>
            {/* Search bar */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="input-with-icon max-w-xl mx-auto"
            >
              <Search size={18} className="icon" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isEn ? 'Search workflows...' : 'Tìm kiếm workflow...'}
                className="input"
                style={{ paddingLeft: '44px' }}
              />
            </motion.div>
          </div>
        </div>

        <div className="container-max px-4 sm:px-6">
          {/* Featured workflows */}
          {selectedCategories.length === 0 && activeFiltersCount === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Star size={18} className="text-yellow-500" fill="currentColor" />
                {isEn ? 'Featured Workflows' : 'Workflow Nổi Bật'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FEATURED.map((wf, i) => (
                  <motion.div
                    key={wf.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -2 }}
                    className="card overflow-hidden flex flex-col sm:flex-row gap-0"
                  >
                    <img src={wf.thumbnail} alt={wf.title} className="w-full sm:w-32 h-36 sm:h-auto object-cover flex-shrink-0" />
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="pill pill-purple text-[10px]">⭐ Featured</span>
                        <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                          <Clock size={10} />{wf.estimatedMinutes}{isEn ? ' min' : ' phút'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                        {isEn && wf.titleEn ? wf.titleEn : wf.title}
                      </h3>
                      <p className="text-xs mb-3 line-clamp-2" style={{ color: '#e9eff5' }}>
                        {isEn && wf.descriptionEn ? wf.descriptionEn : wf.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-yellow-500"><Star size={11} fill="currentColor" />{wf.rating}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {wf.runCount.toLocaleString()} runs</span>
                        <span className="pill pill-purple text-[10px] ml-auto">{t('common.free')}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar filters */}
            <div className="lg:w-52 flex-shrink-0">
              <div 
                className="card sticky top-20"
                style={{ top: 'calc(var(--nav-h) + 16px)' }}
              >
                {/* Categories - Multi-select */}
                <MultiFilterSection
                  title={isEn ? 'Categories' : 'Chủ đề'}
                  items={CATEGORIES}
                  selectedIds={selectedCategories}
                  onToggle={(id) => toggleFilter(id, selectedCategories, setSelectedCategories as React.Dispatch<React.SetStateAction<string[]>>)}
                  renderLabel={(cat) => (
                    <>
                      <span className="mr-1">{cat.icon}</span>
                      {isEn ? cat.labelEn : cat.labelVi}
                    </>
                  )}
                  isEn={isEn}
                  showAll={showAllCategories}
                  onToggleShowAll={() => setShowAllCategories(!showAllCategories)}
                  maxVisible={3}
                />

                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <MultiFilterSection
                    title={isEn ? 'Level' : 'Trình độ'}
                    items={LEVEL_OPTIONS}
                    selectedIds={selectedLevels}
                    onToggle={(id) => toggleFilter(id, selectedLevels, setSelectedLevels)}
                    renderLabel={(opt) => isEn ? opt.labelEn : opt.labelVi}
                    isEn={isEn}
                    showAll={true}
                    onToggleShowAll={() => {}}
                    maxVisible={10}
                  />
                </div>

                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <MultiFilterSection
                    title={isEn ? 'Duration' : 'Thời lượng'}
                    items={DURATION_OPTIONS}
                    selectedIds={selectedDurations}
                    onToggle={(id) => toggleFilter(id, selectedDurations, setSelectedDurations)}
                    renderLabel={(opt) => isEn ? opt.labelEn : opt.labelVi}
                    isEn={isEn}
                    showAll={true}
                    onToggleShowAll={() => {}}
                    maxVisible={10}
                  />
                </div>

                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <RadioFilterSection
                    title={isEn ? 'Price' : 'Giá'}
                    items={PRICE_OPTIONS}
                    selectedId={selectedPrice}
                    onSelect={setSelectedPrice}
                    renderLabel={(opt) => isEn ? opt.labelEn : opt.labelVi}
                  />
                </div>
              </div>
            </div>

            {/* Workflow grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {filtered.length} {isEn ? 'workflows found' : 'workflow được tìm thấy'}
                  {selectedCategories.length > 0 && selectedCategories.map(catId => {
                    const cat = CATEGORIES.find(c => c.id === catId);
                    return cat ? (
                      <span key={catId} className="pill pill-purple text-xs ml-2">
                        {cat.icon} {isEn ? cat.labelEn : cat.labelVi}
                      </span>
                    ) : null;
                  })}
                </p>
                
                <div className="flex items-center gap-3">
                  {/* Sort dropdown */}
                  <div className="relative" ref={sortDropdownRef}>
                    <button
                      onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        color: '#e9eff5'
                      }}
                    >
                      {currentSortOption?.ascending ? (
                        <ArrowUpAZ size={14} className="text-primary" />
                      ) : (
                        <ArrowDownAZ size={14} className="text-primary" />
                      )}
                      {isEn 
                        ? (currentSortOption?.labelEn || 'Sort')
                        : (currentSortOption?.labelVi || 'Sắp xếp')
                      }
                      <ChevronDown size={14} className={`transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {sortDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden z-20"
                          style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-hover)',
                            boxShadow: 'var(--shadow-lg)',
                          }}
                        >
                          <div className="p-1.5">
                            {SORT_OPTIONS.map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  setSort(opt.id);
                                  setSortDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all duration-200"
                                style={sort === opt.id
                                  ? { background: 'rgba(146,230,0,0.12)', color: 'var(--primary)', fontWeight: 600 }
                                  : { color: '#e9eff5' }}
                              >
                                {opt.ascending ? (
                                  <ArrowUpAZ size={12} />
                                ) : (
                                  <ArrowDownAZ size={12} />
                                )}
                                {isEn ? opt.labelEn : opt.labelVi}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {activeFiltersCount > 0 && (
                    <button 
                      onClick={clearAllFilters} 
                      className="text-xs transition-colors duration-200 flex items-center gap-1"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      × {isEn ? 'Clear all' : 'Xóa tất cả'}
                    </button>
                  )}
                </div>
              </div>
              {filtered.length === 0 ? (
                <div className="card p-10 text-center">
                  <div className="text-5xl mb-3">🔍</div>
                  <p style={{ color: '#e9eff5' }}>
                    {isEn ? 'No workflows found. Try a different filter.' : 'Không tìm thấy workflow. Thử bộ lọc khác.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
