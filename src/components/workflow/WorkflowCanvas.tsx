import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Edge,
  Panel,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, Cpu, Type, FileOutput, GitBranch,
  Save, Eye, Trash2, X, Play, GripVertical
} from 'lucide-react';
import { BlockType, Workflow } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';

// ─── Custom Node Components ───────────────────────────────────────────────

const NODE_STYLES: Record<BlockType, { bg: string; border: string; icon: typeof BookOpen; label: string }> = {
  instruction: { bg: 'from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30', border: 'border-blue-300 dark:border-blue-700', icon: BookOpen, label: 'Instruction' },
  aiPrompt:    { bg: 'from-primary-50 to-primary-100 dark:from-primary-950/50 dark:to-primary-900/30', border: 'border-primary-300 dark:border-primary-700', icon: Cpu, label: 'AI Prompt' },
  input:       { bg: 'from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/30', border: 'border-yellow-300 dark:border-yellow-700', icon: Type, label: 'Input' },
  output:      { bg: 'from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30', border: 'border-purple-300 dark:border-purple-700', icon: FileOutput, label: 'Output' },
  decision:    { bg: 'from-accent-50 to-accent-100 dark:from-red-950/50 dark:to-red-900/30', border: 'border-accent-300 dark:border-red-700', icon: GitBranch, label: 'Decision' },
};

const WorkflowNode = ({ data, selected }: { data: { type: BlockType; label: string; content: string }; selected?: boolean }) => {
  const style = NODE_STYLES[data.type] || NODE_STYLES.instruction;
  const Icon = style.icon;
  return (
    <div className={`min-w-[180px] max-w-[220px] rounded-xl border-2 bg-gradient-to-br ${style.bg} ${style.border} ${selected ? 'ring-2 ring-primary ring-offset-1' : ''} shadow-md transition-all`}>
      <div className={`flex items-center gap-2 px-3 py-2 border-b ${style.border}`}>
        <Icon size={14} className="flex-shrink-0 text-gray-600 dark:text-gray-300" />
        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{style.label}</span>
        <GripVertical size={12} className="ml-auto text-gray-300 cursor-grab" />
      </div>
      <div className="px-3 py-2">
        <p className="text-xs font-semibold text-gray-800 dark:text-white mb-0.5">{data.label}</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{data.content}</p>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
};

// ─── Block Palette Items ──────────────────────────────────────────────────
const PALETTE_ITEMS: { type: BlockType; label: string; labelEn: string; icon: typeof BookOpen; color: string }[] = [
  { type: 'instruction', label: 'Hướng Dẫn', labelEn: 'Instruction', icon: BookOpen, color: 'text-blue-500' },
  { type: 'aiPrompt',    label: 'AI Prompt',  labelEn: 'AI Prompt',   icon: Cpu,       color: 'text-primary' },
  { type: 'input',       label: 'Nhập Liệu',  labelEn: 'Input',       icon: Type,      color: 'text-yellow-500' },
  { type: 'output',      label: 'Kết Quả',    labelEn: 'Output',      icon: FileOutput,color: 'text-purple-500' },
  { type: 'decision',    label: 'Quyết Định', labelEn: 'Decision',    icon: GitBranch, color: 'text-accent' },
];

// ─── Convert Workflow to ReactFlow nodes ─────────────────────────────────
const workflowToNodes = (workflow: Workflow): Node[] =>
  workflow.blocks.map((b) => ({
    id: b.id,
    type: 'workflowNode',
    position: b.position,
    data: { type: b.type, label: b.title, content: b.content },
  }));

const workflowToEdges = (workflow: Workflow): Edge[] =>
  workflow.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: true,
    style: { stroke: '#00A651', strokeWidth: 2 },
  }));

// ─── Selected Block Config Panel ─────────────────────────────────────────
interface ConfigPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (id: string, label: string, content: string) => void;
  onDelete: (id: string) => void;
}

const ConfigPanel = ({ node, onClose, onUpdate, onDelete }: ConfigPanelProps) => {
  if (!node) return null;
  const [label, setLabel] = useState<string>(String(node.data.label ?? ''));
  const [content, setContent] = useState<string>(String(node.data.content ?? ''));

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col z-20 shadow-xl"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Block Config</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={16} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">Title</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="input-field text-sm"
            placeholder="Block title..."
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">Content / Prompt</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-field text-sm resize-none"
            rows={5}
            placeholder="Block content or AI prompt template..."
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onUpdate(String(node.id), label, content)}
            className="btn-primary text-xs !px-3 !py-2 flex-1"
          >
            Save
          </button>
          <button
            onClick={() => onDelete(String(node.id))}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main WorkflowCanvas ──────────────────────────────────────────────────
interface WorkflowCanvasProps {
  initialWorkflow?: Workflow;
  readOnly?: boolean;
  onSave?: (nodes: Node[], edges: Edge[]) => void;
}

const WorkflowCanvas = ({ initialWorkflow, readOnly = false, onSave }: WorkflowCanvasProps) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  let idCounter = useRef(1000);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialWorkflow ? workflowToNodes(initialWorkflow) : []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialWorkflow ? workflowToEdges(initialWorkflow) : []
  );
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowTitle, setWorkflowTitle] = useLocalStorage('wfz-builder-title', 'Workflow mới');
  const [saveMsg, setSaveMsg] = useState('');

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: '#00A651', strokeWidth: 2 },
    }, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (!readOnly) setSelectedNode(node);
  }, [readOnly]);

  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  // Drag a palette item onto canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow') as BlockType;
    if (!type || !reactFlowWrapper.current) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = {
      x: event.clientX - bounds.left - 100,
      y: event.clientY - bounds.top - 40,
    };
    const id = `node-${++idCounter.current}`;
    const paletteItem = PALETTE_ITEMS.find((p) => p.type === type);
    const newNode: Node = {
      id,
      type: 'workflowNode',
      position,
      data: { type, label: paletteItem?.label ?? type, content: 'Nhập nội dung...' },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const handleUpdateNode = (id: string, label: string, content: string) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, label, content } } : n));
    setSelectedNode((prev) => prev?.id === id ? { ...prev, data: { ...prev.data, label, content } } : prev);
  };

  const handleDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNode(null);
  };

  const handleSave = () => {
    onSave?.(nodes, edges);
    setSaveMsg('✓ Đã lưu!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      {!readOnly && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <input
            value={workflowTitle}
            onChange={(e) => setWorkflowTitle(e.target.value)}
            className="text-sm font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none flex-1 min-w-0"
            placeholder="Tên workflow..."
          />
          <div className="flex items-center gap-2 ml-auto">
            {saveMsg && <span className="text-xs text-primary font-medium animate-in">{saveMsg}</span>}
            <button onClick={handleSave} className="btn-primary text-xs !px-3 !py-1.5 flex items-center gap-1">
              <Save size={13} />{t('builder.save')}
            </button>
            <button className="btn-secondary text-xs !px-3 !py-1.5 flex items-center gap-1">
              <Eye size={13} />{t('builder.preview')}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left palette */}
        {!readOnly && (
          <div className="w-48 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-1.5 overflow-y-auto z-10">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('builder.blocks')}</p>
            {PALETTE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('application/reactflow', item.type)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 cursor-grab hover:border-primary hover:bg-primary-50/50 dark:hover:bg-primary/10 transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <Icon size={14} className={item.color} />
                  {isEn ? item.labelEn : item.label}
                </div>
              );
            })}
            <div className="mt-4 p-2 rounded-lg bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900">
              <p className="text-[10px] text-primary-700 dark:text-primary-300">
                💡 {t('builder.dragHint')}
              </p>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div ref={reactFlowWrapper} className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={!readOnly ? onNodesChange : undefined}
            onEdgesChange={!readOnly ? onEdgesChange : undefined}
            onConnect={!readOnly ? onConnect : undefined}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
            className="bg-gray-50 dark:bg-gray-950"
          >
            <Controls className="!shadow-md !rounded-xl" />
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="#d1d5db"
              className="dark:!bg-gray-950"
            />
            {nodes.length === 0 && !readOnly && (
              <Panel position="top-center">
                <div className="mt-16 text-center pointer-events-none">
                  <div className="text-5xl mb-3">🎯</div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t('builder.emptyHint')}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600">{t('builder.emptySubHint')}</p>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>

        {/* Config panel */}
        <AnimatePresence>
          {selectedNode && (
            <ConfigPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onUpdate={handleUpdateNode}
              onDelete={handleDeleteNode}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkflowCanvas;
