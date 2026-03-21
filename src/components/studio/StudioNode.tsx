import { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Trash2, Plus, GripVertical, Code2, CheckSquare, MessageCircle, FileText,
  AlignLeft, Columns, Rows, Image as ImageIcon, Video, ChevronDown, ChevronUp, X, Flag, MousePointer, Repeat, SkipForward
} from 'lucide-react';

type BlockType = 'text' | 'image' | 'video' | 'checklist';
type NodeType = 'instruction' | 'multiChoice' | 'codeBox' | 'chatbot' | 'scratch' | 'richText';
type LayoutStyle = 'vertical' | 'horizontal';

interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
}

interface StudioNodeData {
  type: NodeType;
  label: string;
  prompt: string;
  layout: LayoutStyle;
  blocks: ContentBlock[];
}

// ─── Scratch block palette ─────────────────────────────────────────────────
const SCRATCH_BLOCKS = [
  // Events (yellow-orange)
  { id: 'flag',      label: 'When 🏁 clicked',       category: 'Events',   color: '#f59e0b', shape: 'hat' },
  { id: 'key',       label: 'When [Space] pressed',   category: 'Events',   color: '#f59e0b', shape: 'hat' },
  { id: 'click',     label: 'When this clicked',      category: 'Events',   color: '#f59e0b', shape: 'hat' },
  // Control (orange)
  { id: 'forever',   label: 'Forever',                category: 'Control',  color: '#fb923c', shape: 'loop' },
  { id: 'ifthen',    label: 'If <condition> then',    category: 'Control',  color: '#fb923c', shape: 'cond' },
  { id: 'repeat',    label: 'Repeat [10]',            category: 'Control',  color: '#fb923c', shape: 'loop' },
  // Sensing (light blue)
  { id: 'keypressed',label: 'Key [space] pressed?',   category: 'Sensing',  color: '#60a5fa', shape: 'bool' },
  { id: 'mousepos',  label: 'Mouse x position',       category: 'Sensing',  color: '#60a5fa', shape: 'report' },
] as const;

type ScratchBlockId = typeof SCRATCH_BLOCKS[number]['id'];

interface ScratchBlockInstance { id: string; blockId: ScratchBlockId }

const TYPE_COLORS: Record<NodeType, string> = {
  instruction: '#92e600',
  multiChoice: '#92e600',
  codeBox:     '#34d399',
  chatbot:     '#92e600',
  scratch:     '#f59e0b',
  richText:    '#92e600',
};

const TYPE_LABELS: Record<NodeType, string> = {
  instruction: 'Instruction',
  multiChoice: 'Multiple Choice',
  codeBox:     'Code Box',
  chatbot:     'Chatbot',
  scratch:     '⬛ Scratch',
  richText:    'Rich Text',
};

const BLOCK_ICONS: Record<BlockType, React.ReactNode> = {
  text:      <AlignLeft size={11} />,
  image:     <ImageIcon size={11} />,
  video:     <Video size={11} />,
  checklist: <CheckSquare size={11} />,
};

let blockIdCounter = 0;
const bid = () => `blk-${Date.now()}-${++blockIdCounter}`;
let scratchIdCounter = 0;
const sid = () => `scr-${Date.now()}-${++scratchIdCounter}`;

export default function StudioNode({ data, selected }: NodeProps<StudioNodeData>) {
  const [layout, setLayout] = useState<LayoutStyle>(data.layout || 'vertical');
  const [blocks, setBlocks] = useState<ContentBlock[]>(data.blocks || []);
  const [collapsed, setCollapsed] = useState(false);
  const [choices, setChoices] = useState(['Option A', 'Option B', 'Option C']);
  const [codeContent, setCodeContent] = useState('');

  // Scratch-specific state
  const [scratchBlocks, setScratchBlocks] = useState<ScratchBlockInstance[]>([]);
  const [activeScratchCat, setActiveScratchCat] = useState<'Events' | 'Control' | 'Sensing'>('Events');

  const color = TYPE_COLORS[data.type] || '#92e600';

  const addBlock = (type: BlockType) => setBlocks(bs => [...bs, { id: bid(), type, content: '' }]);
  const removeBlock = (id: string) => setBlocks(bs => bs.filter(b => b.id !== id));
  const updateBlock = (id: string, content: string) => setBlocks(bs => bs.map(b => b.id === id ? { ...b, content } : b));
  const addScratchBlock = (blockId: ScratchBlockId) => setScratchBlocks(bs => [...bs, { id: sid(), blockId }]);
  const removeScratchBlock = (id: string) => setScratchBlocks(bs => bs.filter(b => b.id !== id));

  // Scratch shape renderer
  const renderScratchShape = (block: typeof SCRATCH_BLOCKS[number]) => {
    const base = 'flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-white select-none cursor-grab active:cursor-grabbing';
    if (block.shape === 'hat') {
      return (
        <div className={base} style={{ background: block.color, borderRadius: '14px 14px 4px 4px', paddingTop: '8px' }}>
          <Flag size={10} /> {block.label}
        </div>
      );
    }
    if (block.shape === 'loop') {
      return (
        <div style={{ background: block.color, borderRadius: 4 }}>
          <div className={base}><Repeat size={10} />{block.label}</div>
          <div className="ml-4 my-1 min-h-[16px] bg-black/20 rounded mx-2" />
          <div className="px-3 py-1 text-[10px] text-white/70">end</div>
        </div>
      );
    }
    if (block.shape === 'cond') {
      return (
        <div style={{ background: block.color, borderRadius: 4 }}>
          <div className={base}><SkipForward size={10} />{block.label}</div>
          <div className="ml-4 my-1 min-h-[16px] bg-black/20 rounded mx-2" />
        </div>
      );
    }
    if (block.shape === 'bool') {
      return (
        <div className={base} style={{ background: block.color, borderRadius: 99 }}>
          <MousePointer size={10} /> {block.label}
        </div>
      );
    }
    return (
      <div className={base} style={{ background: block.color, borderRadius: 4 }}>
        {block.label}
      </div>
    );
  };

  // Content rendered for horizontal or vertical
  const renderContent = () => {
    if (data.type === 'instruction') {
      // No prompt field for instruction – just content blocks
      return (
        <div className={layout === 'horizontal' ? 'flex gap-3' : ''}>
          {/* Media column (horizontal: left) */}
          {layout === 'horizontal' && (
            <div className="w-1/2 flex flex-col gap-1.5">
              {blocks.filter(b => b.type === 'image' || b.type === 'video').map(block => (
                <div key={block.id} className="bg-[#0b0f0c] rounded-lg p-2 text-center text-[10px] text-gray-500 border border-[#92e600]/10">
                  {block.type === 'image' ? <><ImageIcon size={14} className="mx-auto mb-0.5 text-gray-600" /><span>Image</span></> : <><Video size={14} className="mx-auto mb-0.5 text-gray-600" /><span>Video</span></>}
                  <input value={block.content} onChange={e => updateBlock(block.id, e.target.value)}
                    placeholder="URL..." className="w-full bg-transparent text-[10px] text-gray-400 outline-none text-center mt-0.5" />
                </div>
              ))}
              <button onClick={() => addBlock('image')} className="text-[10px] text-gray-600 hover:text-[#92e600] mt-1">+ Image</button>
              <button onClick={() => addBlock('video')} className="text-[10px] text-gray-600 hover:text-[#92e600]">+ Video</button>
            </div>
          )}
          {/* Text/checklist column */}
          <div className={layout === 'horizontal' ? 'w-1/2 flex flex-col gap-1' : ''}>
            {renderTextBlocks()}
            {!layout.startsWith('horizontal') && renderMediaBlocks()}
            {renderAddButtons()}
          </div>
        </div>
      );
    }
    return (
      <div className={layout === 'horizontal' ? 'flex gap-3' : 'flex flex-col gap-2'}>
        {layout === 'horizontal' && (
          <div className="w-1/2 flex flex-col gap-1.5">
            {blocks.filter(b => b.type === 'image' || b.type === 'video').map(block => (
              <div key={block.id} className="bg-[#0b0f0c] rounded-lg p-2 text-center text-[10px] text-gray-500 border border-[#92e600]/10">
                {block.type === 'image' ? <ImageIcon size={14} className="mx-auto mb-0.5 text-gray-600" /> : <Video size={14} className="mx-auto mb-0.5 text-gray-600" />}
                <input value={block.content} onChange={e => updateBlock(block.id, e.target.value)}
                  placeholder="URL..." className="w-full bg-transparent text-[10px] text-gray-400 outline-none text-center" />
              </div>
            ))}
            <button onClick={() => addBlock('image')} className="text-[10px] text-gray-600 hover:text-[#92e600] mt-1">+ Image</button>
            <button onClick={() => addBlock('video')} className="text-[10px] text-gray-600 hover:text-[#92e600]">+ Video</button>
          </div>
        )}
        <div className={layout === 'horizontal' ? 'w-1/2 flex flex-col gap-1' : ''}>
          {renderTypeSpecific()}
          {renderTextBlocks()}
          {!layout.startsWith('horizontal') && renderMediaBlocks()}
          {renderAddButtons()}
        </div>
      </div>
    );
  };

  const renderTextBlocks = () => (
    <Reorder.Group axis="y" values={blocks.filter(b => b.type === 'text' || b.type === 'checklist')}
      onReorder={newOrder => setBlocks(bs => {
        const others = bs.filter(b => b.type !== 'text' && b.type !== 'checklist');
        return [...others, ...newOrder];
      })} className="space-y-1">
      {blocks.filter(b => b.type === 'text' || b.type === 'checklist').map(block => (
        <Reorder.Item key={block.id} value={block}>
          <div className="flex items-start gap-1.5 group">
            <div className="mt-1 cursor-grab text-gray-700 group-hover:text-gray-500"><GripVertical size={11} /></div>
            <div className="flex-1">
              {block.type === 'checklist' ? (
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" className="rounded" style={{ accentColor: '#92e600' }} />
                  <input value={block.content} onChange={e => updateBlock(block.id, e.target.value)}
                    placeholder="Checklist item..." className="flex-1 bg-transparent text-xs text-gray-300 outline-none placeholder-gray-600 border-b border-gray-800 pb-0.5" style={{ borderColor: 'rgba(146,230,0,0.15)' }} />
                </label>
              ) : (
                <input value={block.content} onChange={e => updateBlock(block.id, e.target.value)}
                  placeholder="Type here..." className="w-full bg-transparent text-xs text-gray-300 outline-none placeholder-gray-600 border-b border-gray-800 pb-0.5" />
              )}
            </div>
            <button onClick={() => removeBlock(block.id)} className="mt-1 text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><X size={11} /></button>
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );

  const renderMediaBlocks = () => (
    <>
      {blocks.filter(b => b.type === 'image' || b.type === 'video').map(block => (
        <div key={block.id} className="flex items-start gap-1.5 group">
          <div className="flex-1 bg-[#0b0f0c] rounded-lg px-2 py-2.5 text-center border border-[#92e600]/10">
            {block.type === 'image' ? <ImageIcon size={14} className="text-gray-600 mx-auto mb-0.5" /> : <Video size={14} className="text-gray-600 mx-auto mb-0.5" />}
            <input value={block.content} onChange={e => updateBlock(block.id, e.target.value)}
              placeholder={block.type === 'image' ? 'Image URL...' : 'YouTube / video URL...'}
              className="w-full bg-transparent text-[11px] text-gray-400 text-center outline-none placeholder-gray-600" />
          </div>
          <button onClick={() => removeBlock(block.id)} className="mt-2 text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><X size={11} /></button>
        </div>
      ))}
    </>
  );

  const renderAddButtons = () => (
    <div className="flex gap-1 flex-wrap mt-1">
      {(['text', 'checklist'] as BlockType[]).map(bt => (
        <button key={bt} onClick={() => addBlock(bt)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0b0f0c] text-[10px] text-gray-500 hover:text-gray-300 hover:bg-[#1a2119] transition-colors border border-[#92e600]/10">
          {BLOCK_ICONS[bt]} {bt}
        </button>
      ))}
      {layout !== 'horizontal' && (['image', 'video'] as BlockType[]).map(bt => (
        <button key={bt} onClick={() => addBlock(bt)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0b0f0c] text-[10px] text-gray-500 hover:text-gray-300 hover:bg-[#1a2119] transition-colors border border-[#92e600]/10">
          {BLOCK_ICONS[bt]} {bt}
        </button>
      ))}
    </div>
  );

  const renderTypeSpecific = () => {
    if (data.type === 'multiChoice') {
      return (
        <div className="mb-2">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Options</label>
          <div className="mt-1 space-y-1">
            {choices.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0" style={{ borderColor: color }} />
                <input value={c} onChange={e => setChoices(cs => cs.map((ch, j) => j === i ? e.target.value : ch))}
                  className="flex-1 bg-[#0b0f0c] text-xs text-gray-200 px-2 py-1 rounded-lg border border-[#92e600]/15 outline-none" />
                <button onClick={() => setChoices(cs => cs.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400"><X size={11} /></button>
              </div>
            ))}
            <button onClick={() => setChoices(cs => [...cs, `Option ${String.fromCharCode(65 + cs.length)}`])}
              className="text-[11px] hover:opacity-70 mt-1" style={{ color: '#92e600' }}>+ Add option</button>
          </div>
        </div>
      );
    }
    if (data.type === 'codeBox') {
      return (
        <div className="mb-2">
          <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Code</label>
          <textarea rows={4} value={codeContent} onChange={e => setCodeContent(e.target.value)}
            placeholder="// Write code here..." className="w-full bg-[#0b0f0c] border border-[#92e600]/15 rounded-lg px-2.5 py-2 text-xs text-green-400 placeholder-gray-700 font-mono outline-none resize-none" />
        </div>
      );
    }
    if (data.type === 'chatbot') {
      return (
        <div className="mb-2">
          <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Chatbot Prompt</label>
          <textarea rows={2} placeholder="You are an assistant that..."
            className="w-full bg-[#0b0f0c] border border-[#92e600]/15 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 placeholder-gray-600 outline-none resize-none" />
        </div>
      );
    }
    if (data.type === 'scratch') {
      return (
        <div className="mb-2">
          {/* Category tabs */}
          <div className="flex gap-1 mb-2">
            {(['Events', 'Control', 'Sensing'] as const).map(cat => (
              <button key={cat} onClick={() => setActiveScratchCat(cat)}
                className="px-2 py-0.5 rounded text-[10px] font-bold transition-all"
                style={{
                  background: activeScratchCat === cat
                    ? (cat === 'Events' ? '#f59e0b' : cat === 'Control' ? '#fb923c' : '#60a5fa')
                    : '#0b0f0c',
                  color: activeScratchCat === cat ? '#0b0f0c' : '#6b7280',
                }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Palette */}
          <div className="space-y-1 mb-2 max-h-28 overflow-y-auto">
            {SCRATCH_BLOCKS.filter(b => b.category === activeScratchCat).map(block => (
              <button key={block.id} onClick={() => addScratchBlock(block.id)}
                className="w-full text-left hover:opacity-80 transition-opacity">
                {renderScratchShape(block)}
              </button>
            ))}
          </div>

          {/* Script area */}
          {scratchBlocks.length > 0 && (
            <div className="bg-[#0b0f0c] rounded-lg p-2 border border-[#f59e0b]/20 min-h-[40px] space-y-1">
              <p className="text-[9px] text-gray-600 mb-1">Script</p>
              {scratchBlocks.map(inst => {
                const def = SCRATCH_BLOCKS.find(b => b.id === inst.blockId)!;
                return (
                  <div key={inst.id} className="group flex items-center gap-1">
                    <div className="flex-1">{def && renderScratchShape(def)}</div>
                    <button onClick={() => removeScratchBlock(inst.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-400 transition-all"><X size={10} /></button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        minWidth: layout === 'horizontal' ? 380 : 280,
        maxWidth: layout === 'horizontal' ? 480 : 340,
        borderColor: selected ? color : 'rgba(146,230,0,0.1)',
        border: '2px solid',
        background: '#0e150d',
        borderRadius: '1rem',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#92e600]/10"
        style={{ background: `${color}12` }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[#0b0f0c] text-[10px] font-black"
          style={{ background: color }}>
          {data.type[0].toUpperCase()}
        </div>
        <span className="flex-1 text-xs font-bold text-white truncate">{data.label}</span>
        <div className="flex items-center gap-0.5">
          {/* Layout toggle: Rows (vertical) ↔ Columns (horizontal) */}
          <button onClick={() => setLayout('vertical')} title="Vertical layout"
            className="p-1 rounded transition-colors"
            style={{ color: layout === 'vertical' ? '#92e600' : '#4b5563' }}>
            <Rows size={11} />
          </button>
          <button onClick={() => setLayout('horizontal')} title="Horizontal split (2 columns)"
            className="p-1 rounded transition-colors"
            style={{ color: layout === 'horizontal' ? '#92e600' : '#4b5563' }}>
            <Columns size={11} />
          </button>
          {/* Collapse */}
          <button onClick={() => setCollapsed(c => !c)}
            className="p-1 rounded text-gray-500 hover:text-gray-300 transition-colors">
            {collapsed ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-3 pt-2.5 pb-3">
              {renderContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* React Flow handles */}
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !border-2"
        style={{ background: color, borderColor: '#0e150d' }} />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !border-2"
        style={{ background: color, borderColor: '#0e150d' }} />
    </motion.div>
  );
}
