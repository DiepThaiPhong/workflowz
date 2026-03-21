import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, Send, Plus, Save, Play, Undo2, Redo2, ChevronDown, ChevronUp,
  MessageCircle, Code2, CheckSquare, FileText, List, X, Zap,
  BookOpen, Trash2
} from 'lucide-react';
import ReactFlow, {
  Background, Controls, MiniMap,
  addEdge, Connection, Edge, Node,
  useNodesState, useEdgesState, NodeTypes,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useLocalStorage from '../../hooks/useLocalStorage';
import StudioNode from './StudioNode';

const nodeTypes: NodeTypes = { studioNode: StudioNode };

// --------------- Template cards ---------------
const TEMPLATE_WORKFLOWS = [
  { id: 'tpl-1', title: 'Build Your First AI Chatbot', titleVi: 'Xây dựng AI Chatbot đầu tiên', desc: 'Step-by-step: from concept to working chatbot', image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80', category: 'AI', nodes: 5, color: '#92e600' },
  { id: 'tpl-2', title: 'Create Professional Business Plan', titleVi: 'Tạo kế hoạch kinh doanh', desc: 'AI-powered structured business planning', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80', category: 'Business', nodes: 6, color: '#92e600' },
  { id: 'tpl-3', title: 'Data Analysis Report', titleVi: 'Báo cáo phân tích dữ liệu', desc: 'AI analyzes your data & generates insights', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80', category: 'Data', nodes: 5, color: '#92e600' },
  { id: 'tpl-4', title: 'Email Automation Workflow', titleVi: 'Tự động hóa email', desc: 'Smart email sequences with AI templates', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80', category: 'Writing', nodes: 4, color: '#92e600' },
  { id: 'tpl-5', title: 'Resume Optimization', titleVi: 'Tối ưu hóa CV', desc: 'AI rewrites your CV for ATS', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80', category: 'Career', nodes: 6, color: '#92e600' },
  { id: 'tpl-6', title: '30-Day Learning Roadmap', titleVi: 'Lộ trình học 30 ngày', desc: 'Personalized AI study plan', image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80', category: 'Education', nodes: 4, color: '#92e600' },
];

// --------------- Node types for sidebar library ---------------
const NODE_LIBRARY = [
  { type: 'multiChoice', label: 'Multiple Choices', labelVi: 'Nhiều Lựa Chọn', icon: CheckSquare, color: '#92e600', bg: 'border-[#92e600]/20 hover:border-[#92e600]/40' },
  { type: 'codeBox',     label: 'Code Box',         labelVi: 'Hộp Code',        icon: Code2,        color: '#34d399', bg: 'border-[#34d399]/20 hover:border-[#34d399]/40' },
  { type: 'chatbot',     label: 'Chatbot',           labelVi: 'Chatbot AI',      icon: MessageCircle, color: '#92e600', bg: 'border-[#92e600]/20 hover:border-[#92e600]/40' },
  { type: 'scratch',     label: 'Scratch Blocks',    labelVi: 'Khối Scratch',    icon: FileText,     color: '#f59e0b', bg: 'border-[#f59e0b]/20 hover:border-[#f59e0b]/40' },
  { type: 'richText',    label: 'Rich Text',         labelVi: 'Văn bản',         icon: List,         color: '#92e600', bg: 'border-[#92e600]/20 hover:border-[#92e600]/40' },
];

// --------------- Mock AI generator ---------------
const generateWorkflowFromPrompt = async (prompt: string, isEn: boolean) => {
  await new Promise(r => setTimeout(r, 2200));
  const nodeId = (n: number) => `ai-node-${Date.now()}-${n}`;
  const nodes: Node[] = [
    { id: nodeId(1), type: 'studioNode', position: { x: 80, y: 80 },  data: { type: 'instruction', label: isEn ? 'Step 1: Getting Started'  : 'Bước 1: Bắt đầu',     layout: 'vertical',   blocks: [{ id: 'b1', type: 'text', content: isEn ? 'Welcome! Follow the steps below.' : 'Chào mừng! Làm theo các bước.' }] } },
    { id: nodeId(2), type: 'studioNode', position: { x: 80, y: 260 }, data: { type: 'chatbot',     label: isEn ? 'Step 2: AI Conversation'  : 'Bước 2: Hỏi AI',      layout: 'horizontal', blocks: [] } },
    { id: nodeId(3), type: 'studioNode', position: { x: 80, y: 440 }, data: { type: 'scratch',     label: isEn ? 'Step 3: Your Response'    : 'Bước 3: Câu trả lời', layout: 'vertical',   blocks: [] } },
    { id: nodeId(4), type: 'studioNode', position: { x: 80, y: 620 }, data: { type: 'richText',    label: isEn ? 'Output: Result'           : 'Kết quả cuối',        layout: 'vertical',   blocks: [{ id: 'o1', type: 'text', content: '{{AI_RESPONSE}}' }] } },
  ];
  const edges: Edge[] = [
    { id: 'ae1', source: nodeId(1), target: nodeId(2), animated: true, style: { stroke: '#92e600', strokeWidth: 2 } },
    { id: 'ae2', source: nodeId(2), target: nodeId(3), animated: true, style: { stroke: '#92e600', strokeWidth: 2 } },
    { id: 'ae3', source: nodeId(3), target: nodeId(4), animated: true, style: { stroke: '#92e600', strokeWidth: 2 } },
  ];
  return { nodes, edges, title: prompt || (isEn ? 'AI Generated Workflow' : 'Workflow do AI tạo') };
};

let idCounter = 0;
const uid = () => `node-${Date.now()}-${++idCounter}`;

export default function WorkflowEditorPanel() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [contentTab, setContentTab] = useState<'myOwn' | 'templates'>('templates');
  const [aiOpen, setAiOpen] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ nodes: Node[]; edges: Edge[]; title: string } | null>(null);
  const [workflowName, setWorkflowName] = useState('');
  const [savedWorkflows, setSavedWorkflows] = useLocalStorage<{ id: string; name: string; nodes: Node[]; edges: Edge[] }[]>('wfz-studio-workflows', []);
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [isOverTrash, setIsOverTrash]  = useState(false);
  const trashRef = useRef<HTMLDivElement>(null);

  const initialNodes: Node[] = [
    {
      id: 'welcome', type: 'studioNode', position: { x: 220, y: 120 },
      data: {
        type: 'instruction',
        label: isEn ? 'Welcome Block' : 'Khối chào mừng',
        layout: 'vertical',
        blocks: [{ id: 'wb1', type: 'text', content: isEn ? 'Start building your workflow here! Drag blocks from the left panel.' : 'Bắt đầu xây dựng workflow tại đây! Kéo các khối từ bảng trái.' }],
      },
    },
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (c: Connection) => setEdges(eds => addEdge({ ...c, animated: true, style: { stroke: '#92e600', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  // Trash bin drag handlers
  const onNodeDragStart = useCallback(() => setIsDraggingNode(true), []);
  const onNodeDragStop = useCallback((_event: React.MouseEvent, node: Node) => {
    setIsDraggingNode(false);
    setIsOverTrash(false);
    if (trashRef.current) {
      const rect = trashRef.current.getBoundingClientRect();
      const x = _event.clientX;
      const y = _event.clientY;
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        // Dropped on trash – delete the node
        setNodes(ns => ns.filter(n => n.id !== node.id));
        setEdges(es => es.filter(e => e.source !== node.id && e.target !== node.id));
      }
    }
  }, [setNodes, setEdges]);

  const onNodeDrag = useCallback((_event: React.MouseEvent) => {
    if (trashRef.current) {
      const rect = trashRef.current.getBoundingClientRect();
      const x = _event.clientX;
      const y = _event.clientY;
      setIsOverTrash(x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
    }
  }, []);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    const result = await generateWorkflowFromPrompt(aiPrompt, isEn);
    setAiResult(result);
    setAiLoading(false);
  };

  const handleInsertAi = () => {
    if (!aiResult) return;
    setNodes(ns => [...ns, ...aiResult.nodes]);
    setEdges(es => [...es, ...aiResult.edges]);
    setWorkflowName(aiResult.title);
    setAiResult(null);
    setAiPrompt('');
  };

  const handleSave = () => {
    const name = workflowName.trim() || (isEn ? 'Untitled Workflow' : 'Workflow chưa đặt tên');
    setSavedWorkflows(prev => [...prev, { id: uid(), name, nodes, edges }]);
  };

  const loadWorkflow = (wf: { name: string; nodes: Node[]; edges: Edge[] }) => {
    setNodes(wf.nodes);
    setEdges(wf.edges);
    setWorkflowName(wf.name);
  };

  const addNodeFromLibrary = (type: string, label: string) => {
    const id = uid();
    setNodes(ns => [...ns, {
      id,
      type: 'studioNode',
      position: { x: 120 + Math.random() * 200, y: 120 + Math.random() * 200 },
      data: {
        type,
        label,
        prompt: '',
        layout: 'vertical',
        blocks: [],
      },
    }]);
  };

  const loadTemplate = (tpl: typeof TEMPLATE_WORKFLOWS[0]) => {
    const baseId = uid();
    const n: Node[] = [
      { id: `${baseId}-1`, type: 'studioNode', position: { x: 80, y: 80 }, data: { type: 'instruction', label: isEn ? tpl.title : tpl.titleVi, prompt: isEn ? tpl.desc : tpl.desc, layout: 'vertical', blocks: [{ id: 'tb1', type: 'text', content: tpl.desc }] } },
      { id: `${baseId}-2`, type: 'studioNode', position: { x: 80, y: 260 }, data: { type: 'chatbot', label: isEn ? 'AI Step' : 'Bước AI', prompt: '', layout: 'horizontal', blocks: [] } },
      { id: `${baseId}-3`, type: 'studioNode', position: { x: 80, y: 440 }, data: { type: 'scratch', label: isEn ? 'Your Response' : 'Câu trả lời', prompt: '', layout: 'vertical', blocks: [] } },
    ];
    const e: Edge[] = [
      { id: `${baseId}-e1`, source: `${baseId}-1`, target: `${baseId}-2`, animated: true, style: { stroke: '#00A651', strokeWidth: 2 } },
      { id: `${baseId}-e2`, source: `${baseId}-2`, target: `${baseId}-3`, animated: true, style: { stroke: '#00A651', strokeWidth: 2 } },
    ];
    setNodes(n);
    setEdges(e);
    setWorkflowName(isEn ? tpl.title : tpl.titleVi);
    setContentTab('myOwn');
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">

        {/* Top toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#92e600]/10 flex-shrink-0" style={{ background: '#0e150d' }}>
        <input
          value={workflowName}
          onChange={e => setWorkflowName(e.target.value)}
          placeholder={t('studio.workflowName')}
          className="flex-1 max-w-xs bg-transparent text-white font-semibold text-sm placeholder-gray-600 outline-none border-b border-transparent pb-0.5 transition-colors"
          style={{ borderBottomColor: 'rgba(146,230,0,0.3)' }}
        />
        <div className="flex items-center gap-1.5 ml-auto">
          <button className="p-1.5 text-gray-500 hover:text-white transition-colors" title={t('studio.undoBtn')}><Undo2 size={15} /></button>
          <button className="p-1.5 text-gray-500 hover:text-white transition-colors" title={t('studio.redoBtn')}><Redo2 size={15} /></button>
          <div className="w-px h-4 mx-1" style={{ background: 'rgba(146,230,0,0.15)' }} />
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: '#0b0f0c', color: '#9ca3af', border: '1px solid rgba(146,230,0,0.15)' }}>
            <Save size={13} /> {t('studio.saveWorkflow')}
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: '#92e600', color: '#0b0f0c' }}>
            <Play size={13} /> {t('studio.previewRun')}
          </motion.button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Left panel */}
        <div className="w-72 flex-shrink-0 border-r flex flex-col overflow-hidden" style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>

          {/* AI Chat Panel */}
          <div className="border-b" style={{ borderColor: 'rgba(146,230,0,0.1)' }}>
            <button onClick={() => setAiOpen(!aiOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
              style={{ background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(146,230,0,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(146,230,0,0.1)' }}>
                  <Sparkles size={13} style={{ color: '#92e600' }} />
                </div>
                <span className="text-sm font-bold text-white">{t('studio.aiChat')}</span>
              </div>
              {aiOpen ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
            </button>

            <AnimatePresence>
              {aiOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-3 pb-3 space-y-2">
                    <p className="text-[11px] text-gray-500">{t('studio.aiChatSubtitle')}</p>
                    <textarea
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder={t('studio.aiPlaceholder')}
                      rows={3}
                      className="w-full rounded-xl px-3 py-2 text-xs text-gray-200 placeholder-gray-600 outline-none resize-none transition-colors"
                      style={{ background: '#0b0f0c', border: '1px solid rgba(146,230,0,0.15)' }}
                    />
                    {aiResult ? (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="rounded-xl p-2.5" style={{ background: 'rgba(146,230,0,0.06)', border: '1px solid rgba(146,230,0,0.2)' }}>
                        <p className="text-xs font-bold mb-1" style={{ color: '#92e600' }}>✨ {aiResult.title}</p>
                        <p className="text-[11px] text-gray-400 mb-2">{aiResult.nodes.length} nodes generated</p>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={handleInsertAi}
                          className="w-full py-1.5 text-xs font-bold rounded-lg transition-all"
                          style={{ background: '#92e600', color: '#0b0f0c' }}>
                          {t('studio.aiInsert')}
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.button whileTap={{ scale: 0.95 }} onClick={handleAiGenerate}
                        disabled={aiLoading || !aiPrompt.trim()}
                        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: '#92e600', color: '#0b0f0c' }}>
                        {aiLoading ? (
                          <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Zap size={13} /></motion.div>{t('studio.aiGenerating')}</>
                        ) : (
                          <><Send size={13} /> {t('studio.aiGenerate')}</>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Node Library */}
          <div className="border-b px-3 py-2" style={{ borderColor: 'rgba(146,230,0,0.1)' }}>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Block Library</p>
            <div className="space-y-1">
              {NODE_LIBRARY.map(({ type, label, labelVi, icon: Icon, color, bg }) => (
                <motion.button key={type} whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => addNodeFromLibrary(type, isEn ? label : labelVi)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all ${bg}`}
                  style={{ background: 'rgba(146,230,0,0.03)' }}>
                  <Icon size={14} style={{ color }} />
                  <span className="text-xs font-medium text-gray-200">{isEn ? label : labelVi}</span>
                  <Plus size={11} className="ml-auto text-gray-600" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* My Own / Templates tabs */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex border-b flex-shrink-0" style={{ borderColor: 'rgba(146,230,0,0.1)' }}>
              {(['myOwn', 'templates'] as const).map(tab => (
                <button key={tab} onClick={() => setContentTab(tab)}
                  className="flex-1 py-2.5 text-xs font-bold transition-all"
                  style={contentTab === tab ? { color: '#92e600', borderBottom: '2px solid #92e600' } : { color: '#6b7280' }}>
                  {tab === 'myOwn' ? t('studio.tabMyOwn') : t('studio.tabTemplates')}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <AnimatePresence mode="wait">
                {contentTab === 'myOwn' && (
                  <motion.div key="myOwn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {savedWorkflows.length === 0 ? (
                      <div className="text-center py-8 px-3">
                        <BookOpen size={28} className="text-gray-700 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">{t('studio.noSavedWorkflows')}</p>
                        <p className="text-[11px] text-gray-600 mt-1">{t('studio.noSavedHint')}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {savedWorkflows.map((wf, i) => (
                          <motion.button key={wf.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }} onClick={() => loadWorkflow(wf)}
                            className="w-full text-left p-3 rounded-xl bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50 transition-all">
                            <p className="text-xs font-semibold text-white truncate">{wf.name}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">{wf.nodes.length} nodes</p>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {contentTab === 'templates' && (
                  <motion.div key="templates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-2">
                    {TEMPLATE_WORKFLOWS.map((tpl, i) => (
                      <motion.button key={tpl.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }} onClick={() => loadTemplate(tpl)}
                        className="w-full text-left rounded-xl overflow-hidden border border-gray-700/60 hover:border-primary/40 transition-all group">
                        <div className="relative h-16 overflow-hidden">
                          <img src={tpl.image} alt={tpl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
                          <span className="absolute bottom-1 left-2 text-[10px] font-bold text-white text-shadow"
                            style={{ color: tpl.color }}>
                            {tpl.category}
                          </span>
                        </div>
                        <div className="p-2 bg-gray-800/70">
                          <p className="text-xs font-semibold text-white truncate">{isEn ? tpl.title : tpl.titleVi}</p>
                          <p className="text-[10px] text-gray-500">{tpl.nodes} nodes</p>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 h-full relative" style={{ background: '#0b0f0c' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.3}
            maxZoom={2}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1a2119" />
            <Controls className="[&>button]:bg-[#0e150d] [&>button]:border-[#92e600]/20 [&>button]:text-gray-400" />
            <MiniMap
              style={{ background: '#0e150d', border: '1px solid rgba(146,230,0,0.15)' }}
              maskColor="rgba(0,0,0,0.7)"
              nodeColor="#92e600"
            />
          </ReactFlow>

          {/* Trash bin – appears when dragging a node */}
          <AnimatePresence>
            {isDraggingNode && (
              <motion.div
                ref={trashRef}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: isOverTrash ? 1.2 : 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="absolute bottom-6 right-6 w-14 h-14 rounded-2xl flex items-center justify-center z-50 pointer-events-none"
                style={{
                  background: isOverTrash ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.1)',
                  border: `2px solid ${isOverTrash ? '#ef4444' : 'rgba(239,68,68,0.4)'}`,
                  boxShadow: isOverTrash ? '0 0 20px rgba(239,68,68,0.5)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Trash2 size={22} style={{ color: isOverTrash ? '#ef4444' : '#f87171' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
