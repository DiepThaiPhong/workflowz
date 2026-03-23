// WorkFlowz Type Definitions
// Extends and replaces SkillBridge AI types for the WorkFlowz platform

// ─── User & Auth ───────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  role: 'learner' | 'creator';
  xp: number;
  streak: number;
  completedWorkflows: string[];
  savedWorkflows: string[];
  createdWorkflows: string[];
}

// ─── Workflow Block Types ───────────────────────────────────────────────────
export type BlockType = 'instruction' | 'aiPrompt' | 'input' | 'output' | 'decision';

export interface WorkflowBlock {
  id: string;
  type: BlockType;
  title: string;
  content: string;           // Instruction text or AI prompt template
  placeholder?: string;      // For input blocks
  options?: string[];        // For decision blocks
  outputFormat?: 'text' | 'json' | 'markdown'; // For output blocks
  aiModel?: string;          // 'gemini' for AI prompt blocks
  position: { x: number; y: number };
  userValue?: string;        // Filled at runtime
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

// ─── Workflow ──────────────────────────────────────────────────────────────
export type InteractionMode = 'workflow' | 'qa';
export type WorkflowCategory = 'writing' | 'coding' | 'business' | 'design' | 'data' | 'personal';

export interface Workflow {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  category: WorkflowCategory;
  tags: string[];
  blocks: WorkflowBlock[];
  edges: WorkflowEdge[];
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  thumbnail: string;
  price: number; // 0 = free
  currency: 'VND' | 'USD';
  runCount: number;
  completionRate: number; // 0-100
  rating: number; // 0-5
  ratingCount: number;
  isDraft: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  estimatedMinutes: number;
  interactionMode: InteractionMode;
  outputArtifactFormat: 'text' | 'json' | 'pdf';
}

// ─── Runtime Execution ─────────────────────────────────────────────────────
export interface WorkflowRunState {
  workflowId: string;
  currentBlockIndex: number;
  completedBlocks: string[];
  userInputs: Record<string, string>;
  aiResponses: Record<string, string>;
  outputArtifact?: string;
  startedAt: string;
  completedAt?: string;
  mode: InteractionMode;
}

// ─── Creator / Studio ──────────────────────────────────────────────────────
export interface CreatorStats {
  totalWorkflows: number;
  publishedWorkflows: number;
  draftWorkflows: number;
  totalRuns: number;
  totalRevenue: number; // VND
  avgCompletionRate: number;
  totalStudents: number;
}

export interface CreatorProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  totalWorkflows: number;
  totalStudents: number;
  verified: boolean;
}

// ─── Marketplace ───────────────────────────────────────────────────────────
export interface MarketplaceFilter {
  category?: WorkflowCategory;
  priceRange?: 'free' | 'paid' | 'all';
  duration?: 'short' | 'medium' | 'long' | 'all'; // <10, 10-30, >30 min
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  search?: string;
}

// ─── Chat / AI Tutor ──────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  confidence?: number; // 0-100
  workflowContext?: string; // Active workflow step context for RAG
}

// ─── Assessment (legacy, kept for compatibility) ───────────────────────────
export interface AssessmentResult {
  overallScore: number;
  categoryScores: Record<string, number>;
  recommendedPath: string;
  completedAt: string;
}

// ─── Daily Mission ─────────────────────────────────────────────────────────
export interface DailyMission {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  duration: string;
  durationEn?: string;
  xp: number;
  type: 'workflow' | 'video' | 'quiz' | 'practice';
  workflowId?: string;
  completed: boolean;
}

// ─── Community / Forum ────────────────────────────────────────────────────
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: string;
  likes: number;
  comments: ForumComment[];
  createdAt: string;
  isModerated: boolean;
  linkedWorkflowId?: string; // Link to a workflow
}

export interface ForumComment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
}

// ─── Impact / Metrics ────────────────────────────────────────────────────
export interface PlatformMetrics {
  totalUsers: number;
  totalWorkflows: number;
  totalRuns: number;
  completionRate: number;        // Target: ≥40%
  creatorConversionRate: number; // Target: ≥15%
  outputArtifactsGenerated: number;
  northStarPercent: number;      // % of completed workflows with output artifacts
}

// ─── App State ───────────────────────────────────────────────────────────
export interface AppState {
  role: 'learner' | 'creator';
  language: 'vi' | 'en';
  activeWorkflowId: string | null;
  darkMode: boolean;
}

// --- Legacy SkillBridge AI Types (kept for backward compatibility) --------

export type SkillCategory = 
  | 'basic' | 'intermediate' | 'advanced' 
  | 'ai' | 'coding' | 'business' | 'design' | 'data'
  | 'digital-literacy' | 'ai-basics' | 'job-skills' | 'community';

export interface SkillScore {
  category: SkillCategory;
  score: number;
  label: string;
  color?: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  category: SkillCategory;
}

export interface LearningModule {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'practice' | 'reading';
  completed: boolean;
  locked?: boolean;
  xp: number;
}

export interface LearningPath {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  icon: string;
  bgColor: string;
  color?: string;
  modules: LearningModule[];
  totalWeeks?: number;
  estimatedWeeks?: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  totalXP?: number;
  progress?: number;
  totalModules?: number;
  completedModules?: number;
}

export interface CommunityStats {
  totalMembers: number;
  livesEmpowered: number;
  targetMembers: number;
  citiesReached: number;
  workshopsHeld: number;
  hoursLearned: number;
}

export interface GrowthPlanMonth {
  month: number;
  title: string;
  goals: string[];
  channels: string[];
  targetReach: number;
  completed: boolean;
}
