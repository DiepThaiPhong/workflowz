import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Star, Clock, Users, TrendingUp,
  ChevronRight, ChevronLeft, CheckCircle, Copy, Download,
  MessageSquare, Sparkles, X, ChevronDown, ChevronUp,
  Play, Puzzle, Tag
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { ALL_WORKFLOWS } from '../data/workflowData';
import { askTutor } from '../services/geminiService';
import type { InteractionMode } from '../types';

// ─── Quick suggestion chips for AI Mentor sidebar ──────────────────────────
const AI_SUGGESTIONS_EN = [
  'Explain this step',
  'Give me an example',
  'Tips to do better',
  'Simplify this',
  'What comes next?',
];
const AI_SUGGESTIONS_VI = [
  'Giải thích bước này',
  'Cho tôi một ví dụ',
  'Mẹo để làm tốt hơn',
  'Đơn giản hóa điều này',
  'Bước tiếp theo là gì?',
];

const MODE_CONFIG = [
  { id: 'step-by-step' as InteractionMode, enLabel: 'Step by Step', viLabel: 'Từng bước',    icon: Play },
  { id: 'qa'           as InteractionMode, enLabel: 'Q & A',         viLabel: 'Hỏi & Đáp',   icon: MessageSquare },
  { id: 'scratch'      as InteractionMode, enLabel: 'Scratch Mode',  viLabel: 'Tự khám phá', icon: Puzzle },
];

const BLOCK_TYPE_LABEL: Record<string, { en: string; vi: string; color: string }> = {
  instruction: { en: 'INSTRUCTION',  vi: 'HƯỚNG DẪN',   color: '#92e600' },
  input:       { en: 'YOUR INPUT',   vi: 'NHẬP CỦA BẠN',color: '#60a5fa' },
  aiPrompt:    { en: 'AI GENERATE',  vi: 'AI TẠO',      color: '#a78bfa' },
  decision:    { en: 'DECISION',     vi: 'LỰA CHỌN',    color: '#fb923c' },
  output:      { en: 'OUTPUT',       vi: 'KẾT QUẢ',     color: '#34d399' },
};

export default function WorkflowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const navigate = useNavigate();

  const workflow = ALL_WORKFLOWS.find(w => w.id === id);

  // Runner state
  const [mode, setMode] = useState<InteractionMode>(workflow?.interactionMode || 'step-by-step');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [outputArtifact, setOutputArtifact] = useState('');
  const [copied, setCopied] = useState(false);

  // AI Mentor Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarChat, setSidebarChat] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [sidebarInput, setSidebarInput] = useState('');
  const [sidebarLoading, setSidebarLoading] = useState(false);

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20 gap-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-xl font-bold text-white">Workflow không tồn tại</h1>
        <Link to="/marketplace" className="px-4 py-2 rounded-lg font-semibold text-sm"
          style={{ background: '#92e600', color: '#0b0f0c' }}>← Marketplace</Link>
      </div>
    );
  }

  const title = isEn && workflow.titleEn ? workflow.titleEn : workflow.title;
  const desc  = isEn && workflow.descriptionEn ? workflow.descriptionEn : workflow.description;
  const blocks = workflow.blocks;
  const block  = blocks[currentIdx];
  const isFirst = currentIdx === 0;
  const isLast  = currentIdx === blocks.length - 1;
  const progress = Math.round(((currentIdx + 1) / blocks.length) * 100);
  const blockMeta = BLOCK_TYPE_LABEL[block?.type] || BLOCK_TYPE_LABEL.instruction;

  const resolveTemplate = (tmpl: string) => {
    let r = tmpl;
    Object.entries(userInputs).forEach(([k, v]) => { r = r.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v); });
    Object.entries(aiResponses).forEach(([k, v]) => { r = r.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v); });
    return r;
  };

  const handleNext = async () => {
    if (block.type === 'aiPrompt' && !aiResponses[block.id]) {
      setIsGenerating(true);
      try {
        const { text } = await askTutor(resolveTemplate(block.content), []);
        setAiResponses(p => ({ ...p, [block.id]: text }));
        if (isLast || blocks[currentIdx + 1]?.type === 'output') setOutputArtifact(text);
      } catch {
        setAiResponses(p => ({ ...p, [block.id]: isEn ? 'An error occurred. Please try again.' : 'Đã xảy ra lỗi. Vui lòng thử lại.' }));
      } finally { setIsGenerating(false); }
      return;
    }
    if (isLast) {
      const artifact = block.type === 'output'
        ? (aiResponses[blocks[currentIdx - 1]?.id] || outputArtifact || (isEn ? 'Workflow complete!' : 'Workflow hoàn thành!'))
        : outputArtifact;
      setOutputArtifact(artifact);
      setCompleted(true);
    } else {
      setCurrentIdx(p => p + 1);
    }
  };

  const canProceed = () => {
    if (block?.type === 'input') return (userInputs[block.id] || '').trim().length > 0;
    if (block?.type === 'decision') return !!(userInputs[block.id]);
    return true;
  };

  const handleSuggestion = async (chip: string) => {
    setSidebarChat(c => [...c, { role: 'user', text: chip }]);
    setSidebarLoading(true);
    const context = `Workflow: "${title}". Current step: "${block?.title || ''}". Content: "${block?.content || ''}"`;
    try {
      const { text } = await askTutor(`${chip}\n\nContext: ${context}`, []);
      setSidebarChat(c => [...c, { role: 'ai', text }]);
    } catch {
      setSidebarChat(c => [...c, { role: 'ai', text: isEn ? 'Sorry, could not get a response.' : 'Xin lỗi, không lấy được phản hồi.' }]);
    } finally { setSidebarLoading(false); }
  };

  const handleSidebarSend = async () => {
    const msg = sidebarInput.trim();
    if (!msg || sidebarLoading) return;
    setSidebarInput('');
    await handleSuggestion(msg);
  };

  // ─── Completed screen ───────────────────────────────────────────────────
  if (completed) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-16 bg-[#0b0f0c] flex flex-col items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#92e600' }}>
              <CheckCircle size={32} color="#0b0f0c" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white text-center mb-1">
              {isEn ? '🎉 Workflow Complete!' : '🎉 Workflow hoàn thành!'}
            </h2>
            <p className="text-[#e9eff5] text-center text-sm mb-6">
              {isEn ? 'Your output has been generated.' : 'Kết quả đã được tạo thành công.'}
            </p>
            <div className="bg-[#0e150d] border border-[#92e600]/20 rounded-2xl p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white text-sm">📄 {isEn ? 'Output' : 'Kết quả'}</h3>
                <div className="flex gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(outputArtifact); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-[#92e600]/30 text-[#92e600] hover:bg-[#92e600]/10 transition-all">
                    <Copy size={11} /> {copied ? '✓' : (isEn ? 'Copy' : 'Sao chép')}
                  </button>
                  <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-[#e9eff5] hover:text-white transition-all">
                    <Download size={11} /> {isEn ? 'Save' : 'Lưu'}
                  </button>
                </div>
              </div>
              <pre className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto font-mono bg-[#0b0f0c] rounded-xl p-3">
                {outputArtifact || (isEn ? 'Workflow completed!' : 'Workflow đã hoàn thành!')}
              </pre>
            </div>
            <button onClick={() => { setCompleted(false); setCurrentIdx(0); setUserInputs({}); setAiResponses({}); }}
              className="w-full py-3 rounded-xl font-bold text-sm border border-[#92e600]/40 text-[#92e600] hover:bg-[#92e600]/10 transition-all">
              ↺ {isEn ? 'Run again' : 'Chạy lại'}
            </button>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  // ─── Main runner layout ─────────────────────────────────────────────────
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0b0f0c]" style={{ paddingTop: '4rem' }}>

        {/* ── Top header bar ── */}
        <div className="bg-[#0e150d] border-b border-[#92e600]/10 px-4 sm:px-6 py-3">
          <div className="container-max">
            {/* Breadcrumb */}
            <Link to="/marketplace"
              className="inline-flex items-center gap-1 text-xs text-[#cedde9] hover:text-gray-300 mb-2 transition-colors">
              <ArrowLeft size={12} /> {isEn ? 'Back to Marketplace' : 'Quay lại Marketplace'}
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-black text-white truncate">{title}</h1>
                <p className="text-sm text-[#e9eff5] mt-0.5 truncate">{desc}</p>
              </div>
              {/* Meta badges */}
              <div className="flex items-center gap-3 flex-wrap text-sm flex-shrink-0">
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star size={13} fill="currentColor" /> {workflow.rating}
                  <span className="text-[#cedde9] font-normal">({workflow.ratingCount})</span>
                </span>
                <span className="flex items-center gap-1 text-[#e9eff5]">
                  <Clock size={13} /> {workflow.estimatedMinutes}{isEn ? ' min' : ' phút'}
                </span>
                <span className="flex items-center gap-1 text-[#e9eff5]">
                  <Users size={13} /> {workflow.runCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1" style={{ color: '#92e600' }}>
                  <TrendingUp size={13} /> {workflow.completionRate}%
                </span>
                {workflow.price === 0 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: '#92e600', color: '#0b0f0c' }}>
                    {isEn ? 'FREE' : 'MIỄN PHÍ'}
                  </span>
                ) : (
                  <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {(workflow.price / 1000).toFixed(0)}K VNĐ
                  </span>
                )}
              </div>
            </div>

            {/* Mode tabs */}
            <div className="flex gap-1 mt-3 p-1 bg-[#0b0f0c] rounded-xl w-fit">
              {MODE_CONFIG.map(({ id: mId, enLabel, viLabel, icon: Icon }) => (
                <button key={mId} onClick={() => setMode(mId)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mode === mId
                      ? 'text-[#0b0f0c] shadow-sm'
                      : 'text-[#cedde9] hover:text-gray-300'
                  }`}
                  style={mode === mId ? { background: '#92e600' } : {}}>
                  <Icon size={12} /> {isEn ? enLabel : viLabel}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main content: left runner + right AI sidebar ── */}
        <div className="container-max px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">

          {/* ───── LEFT: Step runner ───── */}
          <div className="flex-1 min-w-0">
            {/* Progress bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-[#cedde9] mb-1.5">
                <span>{isEn ? `Step ${currentIdx + 1} of ${blocks.length}` : `Bước ${currentIdx + 1}/${blocks.length}`}</span>
                <span style={{ color: '#92e600' }}>{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#1a2119] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: '#92e600' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            {/* Block card */}
            <AnimatePresence mode="wait">
              <motion.div key={block.id}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                className="rounded-2xl border bg-[#0e150d] p-6 sm:p-8 mb-5 min-h-[280px]"
                style={{ borderColor: `${blockMeta.color}30` }}>

                {/* Block type badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black tracking-widest mb-4"
                  style={{ background: `${blockMeta.color}15`, color: blockMeta.color, border: `1px solid ${blockMeta.color}30` }}>
                  {isEn ? blockMeta.en : blockMeta.vi}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{block.title}</h2>

                {/* Instruction */}
                {block.type === 'instruction' && (
                  <div className="bg-[#0b0f0c] rounded-xl p-4 border border-[#92e600]/10">
                    <p className="text-gray-200 leading-relaxed text-base">{block.content}</p>
                  </div>
                )}

                {/* Input */}
                {block.type === 'input' && (
                  <div>
                    <p className="text-[#e9eff5] text-sm mb-3">{block.content}</p>
                    <textarea
                      value={userInputs[block.id] || ''}
                      onChange={e => setUserInputs(p => ({ ...p, [block.id]: e.target.value }))}
                      placeholder={block.placeholder || (isEn ? 'Type here...' : 'Nhập vào đây...')}
                      rows={5}
                      className="w-full bg-[#0b0f0c] border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm resize-none transition-colors"
                      style={{ borderColor: userInputs[block.id] ? '#92e600' : '#1a2119' }}
                      onFocus={e => e.target.style.borderColor = '#92e600'}
                      onBlur={e => e.target.style.borderColor = userInputs[block.id] ? '#92e600' : '#1a2119'}
                    />
                  </div>
                )}

                {/* Decision */}
                {block.type === 'decision' && (
                  <div>
                    <p className="text-[#e9eff5] text-sm mb-4">{block.content}</p>
                    <div className="flex flex-col gap-2">
                      {(block.options || []).map(opt => (
                        <button key={opt} onClick={() => setUserInputs(p => ({ ...p, [block.id]: opt }))}
                          className="px-4 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all"
                          style={{
                            borderColor: userInputs[block.id] === opt ? '#92e600' : '#1a2119',
                            color: userInputs[block.id] === opt ? '#92e600' : '#e9eff5',
                            background: userInputs[block.id] === opt ? 'rgba(146,230,0,0.08)' : 'transparent',
                          }}>
                          {userInputs[block.id] === opt ? '✓ ' : ''}{opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Prompt */}
                {block.type === 'aiPrompt' && (
                  isGenerating ? (
                    <div className="flex items-center gap-3 py-6">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div key={i}
                            animate={{ y: [-4, 4, -4] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            className="w-2.5 h-2.5 rounded-full" style={{ background: '#92e600' }} />
                        ))}
                      </div>
                      <p className="text-[#e9eff5] text-sm">{isEn ? 'AI is generating your response...' : 'AI đang tạo kết quả...'}</p>
                    </div>
                  ) : aiResponses[block.id] ? (
                    <div className="bg-[#0b0f0c] rounded-xl p-4 border border-[#92e600]/20 text-sm text-gray-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {aiResponses[block.id]}
                    </div>
                  ) : (
                    <p className="text-sm text-[#cedde9] italic py-4">
                      {isEn ? '→ Click "Next" to generate AI response...' : '→ Nhấn "Tiếp theo" để AI tạo kết quả...'}
                    </p>
                  )
                )}

                {/* Output */}
                {block.type === 'output' && (
                  <div className="bg-[#0b0f0c] rounded-xl p-4 border border-[#92e600]/10 text-sm text-[#e9eff5] italic">
                    {isEn ? 'Output will appear once all steps are complete...' : 'Kết quả sẽ xuất hiện sau khi hoàn thành tất cả bước...'}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Back / Next buttons (big, prominent) ── */}
            <div className="flex gap-3">
              <motion.button
                whileHover={!isFirst ? { scale: 1.02 } : {}}
                whileTap={!isFirst ? { scale: 0.97 } : {}}
                onClick={() => setCurrentIdx(p => Math.max(0, p - 1))}
                disabled={isFirst || isGenerating}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl border font-bold text-sm transition-all disabled:opacity-30"
                style={{ borderColor: '#1a2119', color: '#e9eff5' }}
              >
                <ChevronLeft size={18} /> {isEn ? 'Back' : 'Quay lại'}
              </motion.button>

              <motion.button
                whileHover={canProceed() ? { scale: 1.02 } : {}}
                whileTap={canProceed() ? { scale: 0.97 } : {}}
                onClick={handleNext}
                disabled={!canProceed() || isGenerating}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: canProceed() ? '#92e600' : '#1a2119', color: canProceed() ? '#0b0f0c' : '#4b5563', boxShadow: canProceed() ? '0 0 16px rgba(146,230,0,0.3)' : 'none' }}
              >
                {isGenerating ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-[#0b0f0c]/30 border-t-[#0b0f0c] rounded-full" /> {isEn ? 'Generating...' : 'Đang tạo...'}</>
                ) : isLast ? (
                  <><CheckCircle size={18} /> {isEn ? 'Complete Workflow' : 'Hoàn thành Workflow'}</>
                ) : (
                  <>{isEn ? 'Next' : 'Tiếp theo'} <ChevronRight size={18} /></>
                )}
              </motion.button>
            </div>
          </div>

          {/* ───── RIGHT: AI Mentor Sidebar ───── */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            {/* Collapsible header */}
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors mb-2"
              style={{ background: '#0e150d', borderColor: '#92e600/20', borderWidth: '1px', borderStyle: 'solid' }}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} style={{ color: '#92e600' }} />
                <span className="font-bold text-white text-sm">
                  {isEn ? 'WorkFlowz AI Mentor' : 'AI Mentor WorkFlowz'}
                </span>
              </div>
              {sidebarOpen ? <ChevronUp size={15} className="text-[#cedde9]" /> : <ChevronDown size={15} className="text-[#cedde9]" />}
            </button>

            <AnimatePresence>
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="rounded-2xl border bg-[#0e150d] overflow-hidden"
                    style={{ borderColor: 'rgba(146,230,0,0.15)' }}>

                    {/* Chat messages */}
                    <div className="h-48 overflow-y-auto p-3 space-y-2">
                      {sidebarChat.length === 0 && (
                        <p className="text-xs text-[#cedde9] text-center pt-4">
                          {isEn ? 'Ask AI anything about this step ✨' : 'Hỏi AI bất cứ điều gì về bước này ✨'}
                        </p>
                      )}
                      {sidebarChat.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                            msg.role === 'user'
                              ? 'text-[#0b0f0c] font-semibold'
                              : 'text-gray-200 bg-[#0b0f0c] border border-[#92e600]/10'
                          }`} style={msg.role === 'user' ? { background: '#92e600' } : {}}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {sidebarLoading && (
                        <div className="flex gap-1 pl-1 pt-1">
                          {[0, 1, 2].map(i => (
                            <motion.div key={i} animate={{ y: [-2, 2, -2] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                              className="w-1.5 h-1.5 rounded-full" style={{ background: '#92e600' }} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick suggestion chips */}
                    <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                      {(isEn ? AI_SUGGESTIONS_EN : AI_SUGGESTIONS_VI).map(chip => (
                        <button key={chip} onClick={() => handleSuggestion(chip)}
                          disabled={sidebarLoading}
                          className="text-[11px] px-2.5 py-1 rounded-full border transition-all disabled:opacity-40 text-gray-300 hover:text-white"
                          style={{ borderColor: 'rgba(146,230,0,0.25)', background: 'rgba(146,230,0,0.05)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#92e600'; (e.currentTarget as HTMLElement).style.color = '#92e600'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(146,230,0,0.25)'; (e.currentTarget as HTMLElement).style.color = ''; }}>
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="flex gap-2 px-3 pb-3">
                      <input
                        value={sidebarInput}
                        onChange={e => setSidebarInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSidebarSend()}
                        placeholder={isEn ? 'Ask AI anything...' : 'Hỏi AI bất cứ điều gì...'}
                        className="flex-1 bg-[#0b0f0c] border border-[#92e600]/20 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-[#92e600]/50 transition-colors"
                      />
                      <button onClick={handleSidebarSend} disabled={sidebarLoading || !sidebarInput.trim()}
                        className="px-3 py-2 rounded-lg text-[#0b0f0c] text-xs font-bold transition-all disabled:opacity-40"
                        style={{ background: '#92e600' }}>
                        ↑
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tags */}
            {workflow.tags.length > 0 && (
              <div className="mt-4 bg-[#0e150d] rounded-2xl border p-4" style={{ borderColor: 'rgba(146,230,0,0.1)' }}>
                <h3 className="flex items-center gap-1.5 text-[11px] font-bold text-[#cedde9] uppercase tracking-wider mb-3">
                  <Tag size={11} /> Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {workflow.tags.map(tag => (
                    <span key={tag}
                      className="text-[11px] px-2.5 py-0.5 rounded-full border font-medium"
                      style={{ borderColor: 'rgba(146,230,0,0.2)', color: '#92e600', background: 'rgba(146,230,0,0.05)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
