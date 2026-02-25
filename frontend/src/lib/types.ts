export interface Question {
  id: string;
  text: string;
  answer: string;
  category: string;
  created_at: string;
}

export interface ConsistencyResult {
  source_id: string;
  target_id: string;
  is_consistent: boolean;
  explanation: string;
  color: string;
  target_text?: string;
  target_answer?: string;
}

export interface AddQuestionResponse {
  question: Question;
  consistency: ConsistencyResult[];
}

export interface GraphNodeData {
  label: string;
  color?: string;
  full_text?: string;
  answer?: string;
  category?: string;
  [key: string]: unknown;
}

export interface GraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: GraphNodeData;
}

export interface GraphEdgeData {
  is_consistent: boolean;
  explanation: string;
  [key: string]: unknown;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  style: Record<string, any>;
  data: GraphEdgeData;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CheckRequest {
  question_text: string;
  question_answer: string;
  compare_text: string;
  compare_answer: string;
}

export interface CheckResponse {
  is_consistent: boolean;
  explanation: string;
}

export const LIKERT_OPTIONS = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
] as const;

export type LikertAnswer = (typeof LIKERT_OPTIONS)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  "Customer Obsession": "#3b82f6",
  "Ownership": "#8b5cf6",
  "Invent and Simplify": "#f59e0b",
  "Are Right, A Lot": "#ef4444",
  "Learn and Be Curious": "#10b981",
  "Hire and Develop the Best": "#ec4899",
  "Insist on the Highest Standards": "#06b6d4",
  "Think Big": "#f97316",
  "Bias for Action": "#84cc16",
  "Frugality": "#a855f7",
  "Earn Trust": "#14b8a6",
  "Dive Deep": "#e11d48",
  "Have Backbone; Disagree and Commit": "#7c3aed",
  "Deliver Results": "#059669",
  "Strive to be Earth's Best Employer": "#0ea5e9",
  "Success and Scale Bring Broad Responsibility": "#d946ef",
};
