// Utility helper functions

// Format number with Vietnamese locale (e.g., 1000 → "1.000")
export const formatNumber = (n: number): string =>
  n.toLocaleString('vi-VN');

// Format date to Vietnamese (e.g., "15 tháng 3, 2026")
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Format relative time ("2 giờ trước", "hôm qua", etc.)
export const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDate(dateStr);
};

// Calculate overall score from skill scores
export const calcOverallScore = (scores: { score: number }[]): number => {
  if (!scores.length) return 0;
  return Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);
};

// Map assessment answer index to score (0-100)
export const answerToScore = (answerIndex: number): number => {
  const scoreMap = [20, 45, 70, 95];
  return scoreMap[answerIndex] ?? 20;
};

// Generate shareable URL (simulated)
export const generateShareUrl = (): string => {
  const base = window.location.origin;
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${base}?ref=${code}`;
};

// Merge class names (utility)
export const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(' ');

// Get skill label in Vietnamese
export const getSkillLabel = (category: string): string => {
  const map: Record<string, string> = {
    'digital-literacy': 'Kỹ Năng Số',
    'ai-basics': 'AI Cơ Bản',
    coding: 'Lập Trình',
    'job-skills': 'Kỹ Năng Nghề',
    community: 'Cộng Đồng',
  };
  return map[category] || category;
};

// Get level label in Vietnamese
export const getLevelLabel = (level: string): string => {
  const map: Record<string, string> = {
    Beginner: 'Cơ bản',
    Intermediate: 'Trung cấp',
    Advanced: 'Nâng cao',
  };
  return map[level] || level;
};
