import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, ChevronRight } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import ProgressRing from '../components/ProgressRing';
import PageTransition from '../components/PageTransition';
import { assessmentQuestions, aiIntroMessages } from '../data/assessmentQuestions';
import { answerToScore, getSkillLabel } from '../utils/helpers';
import { AssessmentResult, SkillScore } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

type Phase = 'intro' | 'chat' | 'result';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  confidence?: number;
}

const SKILL_COLORS: Record<string, string> = {
  'digital-literacy': '#00A651',
  'ai-basics': '#4285F4',
  coding: '#FF6B35',
  'job-skills': '#DA291C',
  community: '#7B61FF',
};

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [, setAssessmentResult] = useLocalStorage<AssessmentResult | null>('skillbridge-assessment', null);

  const [phase, setPhase] = useState<Phase>('intro');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  // Play intro sequence
  const startIntro = () => {
    setPhase('chat');
    playIntroMessages();
  };

  const playIntroMessages = async () => {
    for (let i = 0; i < aiIntroMessages.length; i++) {
      await delay(i === 0 ? 300 : 1000);
      setMessages((prev) => [
        ...prev,
        { id: `intro-${i}`, role: 'ai', content: aiIntroMessages[i], confidence: undefined },
      ]);
    }
    await delay(800);
    askQuestion(0);
  };

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const askQuestion = async (idx: number) => {
    const q = assessmentQuestions[idx];
    if (!q) return;

    setIsTyping(true);
    await delay(600);
    setIsTyping(false);

    setMessages((prev) => [
      ...prev,
      {
        id: `q-${idx}`,
        role: 'ai',
        content: `(${idx + 1}/${assessmentQuestions.length}) ${q.question}`,
        confidence: 91,
      },
    ]);
  };

  const handleAnswer = async (optionIndex: number) => {
    const q = assessmentQuestions[currentQIdx];
    const answerText = q.options?.[optionIndex] ?? '';

    // Add user answer bubble
    setMessages((prev) => [
      ...prev,
      { id: `a-${currentQIdx}`, role: 'user', content: answerText },
    ]);

    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    const next = currentQIdx + 1;
    if (next < assessmentQuestions.length) {
      setCurrentQIdx(next);
      await delay(400);
      askQuestion(next);
    } else {
      // Calculate result
      await delay(600);
      setIsTyping(true);
      await delay(1200);
      setIsTyping(false);

      const scoreArr = calculateScores(newAnswers);
      const overall = Math.round(scoreArr.reduce((s, v) => s + v.score, 0) / scoreArr.length);
      const best = [...scoreArr].sort((a, b) => b.score - a.score)[0];

      // Build categoryScores map for AssessmentResult
      const catScores: Record<string, number> = {};
      scoreArr.forEach((s) => { catScores[s.category] = s.score; });

      const assessResult: AssessmentResult = {
        completedAt: new Date().toISOString(),
        categoryScores: catScores,
        overallScore: overall,
        recommendedPath: best.category,
      };

      // Keep scoreArr for local rendering
      const scores = scoreArr;

      // Store in localStorage for dashboard use
      setResult({ ...assessResult, _scores: scores } as AssessmentResult & { _scores: SkillScore[] });
      setAssessmentResult(assessResult);

      setMessages((prev) => [
        ...prev,
        {
          id: 'finish',
          role: 'ai',
          content: `Tuyệt vời! Bạn đã hoàn thành đánh giá 🎉 Điểm tổng thể: ${overall}/100. Mình đã phân tích kỹ năng của bạn và chuẩn bị lộ trình phù hợp nhất!`,
          confidence: 94,
        },
      ]);

      await delay(500);
      setPhase('result');
    }
  };

  const calculateScores = (answerArr: number[]): SkillScore[] => {
    // Map each question's category and convert answer index → score
    const catTotals: Record<string, number[]> = {};

    assessmentQuestions.forEach((q, i) => {
      if (answerArr[i] !== undefined) {
        if (!catTotals[q.category]) catTotals[q.category] = [];
        catTotals[q.category].push(answerToScore(answerArr[i]));
      }
    });

    return Object.entries(catTotals).map(([cat, vals]) => ({
      category: cat as SkillScore['category'],
      label: getSkillLabel(cat),
      score: Math.round(vals.reduce((s, v) => s + v, 0) / vals.length),
      color: SKILL_COLORS[cat] || '#00A651',
    }));
  };

  const currentQ = assessmentQuestions[currentQIdx];
  const progress = Math.round((currentQIdx / assessmentQuestions.length) * 100);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-8 px-4 bg-gray-50 dark:bg-surface-dark flex flex-col">
        <div className="container-max w-full max-w-2xl mx-auto flex flex-col flex-1">

          {/* Header */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain size={20} className="text-primary" />
              Đánh Giá Kỹ Năng Số
            </h1>
            {phase === 'chat' && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Tiến trình</span>
                  <span>{currentQIdx}/{assessmentQuestions.length} câu</span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* === INTRO PHASE === */}
          {phase === 'intro' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-8 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-glow-green">
                <span className="text-4xl">🤖</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Chào bạn! Mình là AI Mentor 👋
                </h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                  Chỉ mất <strong className="text-primary">5 phút</strong> để mình hiểu kỹ năng của bạn và tạo
                  lộ trình học cá nhân hóa!
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  ✓ 10 câu hỏi đơn giản &nbsp;·&nbsp; ✓ Không có câu trả lời sai
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startIntro}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  Bắt đầu đánh giá
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* === CHAT PHASE === */}
          {phase === 'chat' && (
            <div className="flex flex-col flex-1 gap-3">
              {/* Messages area */}
              <div
                ref={chatRef}
                className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-[300px] max-h-[45vh]"
              >
                <AnimatePresence>
                  {messages.map((msg) => (
                    <ChatBubble
                      key={msg.id}
                      role={msg.role}
                      content={msg.content}
                      confidence={msg.confidence}
                    />
                  ))}
                  {isTyping && (
                    <ChatBubble key="typing" role="ai" content="" isTyping />
                  )}
                </AnimatePresence>
              </div>

              {/* Answer options */}
              {!isTyping && phase === 'chat' && currentQ?.options && (
                <motion.div
                  key={currentQIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2"
                >
                  {currentQ.options.map((opt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAnswer(i)}
                      className="text-left px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                    >
                      <span className="text-primary font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {/* === RESULT PHASE === */}
          {phase === 'result' && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col gap-6"
            >
              <div className="glass-card p-6 text-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  🎉 Kết quả đánh giá của bạn
                </h2>
                <div className="flex justify-center mb-6">
                  <ProgressRing
                    percentage={result.overallScore}
                    size={140}
                    color="#00A651"
                    label={`${result.overallScore}`}
                    sublabel="/ 100"
                    animate
                  />
                </div>

                {/* Skill breakdown */}
                <div className="space-y-3 text-left">
                  {((result as AssessmentResult & { _scores?: SkillScore[] })._scores ?? 
                    Object.entries(result.categoryScores).map(([cat, score]) => ({ category: cat, score, label: getSkillLabel(cat), color: SKILL_COLORS[cat] || '#00A651' }))
                  ).map((s) => (
                    <div key={s.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{s.label}</span>
                        <span className="font-bold" style={{ color: s.color }}>{s.score}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.score}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-sm text-primary-800 dark:text-primary-200">
                  💡 Lộ trình đề xuất: <strong>{getSkillLabel(result.recommendedPath)}</strong>
                </div>
              </div>

              <div className="flex gap-3 flex-col sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="btn-primary flex-1"
                  onClick={() => navigate('/dashboard')}
                >
                  Xem lộ trình học của tôi →
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="btn-secondary flex-1"
                  onClick={() => navigate('/lo-trinh')}
                >
                  Khám phá tất cả lộ trình
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AssessmentPage;
