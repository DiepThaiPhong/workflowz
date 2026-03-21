import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage for testing (before any imports that use it)
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// ------ Helper functions tests ------
describe('helpers', () => {
  const { formatNumber, answerToScore, getSkillLabel } = await import('../../utils/helpers');

  it('formatNumber returns Vietnamese locale string', () => {
    expect(formatNumber(1000)).toBe('1.000');
    expect(formatNumber(342)).toBe('342');
  });

  it('answerToScore maps 0-3 to 20-95', () => {
    expect(answerToScore(0)).toBe(20);
    expect(answerToScore(1)).toBe(45);
    expect(answerToScore(2)).toBe(70);
    expect(answerToScore(3)).toBe(95);
  });

  it('getSkillLabel returns Vietnamese label', () => {
    expect(getSkillLabel('digital-literacy')).toBe('Kỹ Năng Số');
    expect(getSkillLabel('ai-basics')).toBe('AI Cơ Bản');
    expect(getSkillLabel('coding')).toBe('Lập Trình');
  });
});

// ------ geminiService tests ------
describe('geminiService', () => {
  const { askTutor, moderatePost } = await import('../../services/geminiService');

  it('askTutor returns text and confidence', async () => {
    const result = await askTutor('AI là gì?');
    expect(result).toHaveProperty('text');
    expect(result).toHaveProperty('confidence');
    expect(typeof result.text).toBe('string');
    expect(result.text.length).toBeGreaterThan(10);
    expect(result.confidence).toBeGreaterThanOrEqual(78);
    expect(result.confidence).toBeLessThanOrEqual(96);
  });

  it('moderatePost flags unsafe content', async () => {
    const safe = await moderatePost('Chia sẻ kinh nghiệm học tập');
    expect(safe.safe).toBe(true);
    const unsafe = await moderatePost('Trang web lừa đảo');
    expect(unsafe.safe).toBe(false);
  });
});

// ------ Assessment data tests ------
describe('Assessment questions', () => {
  const { assessmentQuestions } = await import('../../data/assessmentQuestions');

  it('has exactly 10 questions', () => {
    expect(assessmentQuestions).toHaveLength(10);
  });

  it('all questions have options', () => {
    assessmentQuestions.forEach((q: { options?: string[] }) => {
      expect(q.options).toBeDefined();
      expect(q.options!.length).toBeGreaterThanOrEqual(3);
    });
  });
});

// ------ Learning paths tests ------
describe('Learning paths', () => {
  const { learningPaths } = await import('../../data/learningPaths');

  it('has exactly 5 paths', () => {
    expect(learningPaths).toHaveLength(5);
  });

  it('each path has modules matching totalModules', () => {
    learningPaths.forEach((p: { modules: unknown[]; totalModules: number }) => {
      expect(p.modules.length).toBeGreaterThan(0);
      expect(p.modules.length).toBe(p.totalModules);
    });
  });
});
