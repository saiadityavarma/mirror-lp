"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import type { GraphNodeData } from "@/lib/types";
import { CATEGORY_COLORS, LIKERT_OPTIONS } from "@/lib/types";

const LIKERT_BADGE_COLORS: Record<string, string> = {
  "Strongly Disagree": "#ef4444",
  Disagree: "#f97316",
  Neutral: "#9ca3af",
  Agree: "#86efac",
  "Strongly Agree": "#22c55e",
};

export default function QuestionNode({ data }: NodeProps) {
  const nodeData = data as unknown as GraphNodeData;
  const categoryColor =
    nodeData.color ||
    (nodeData.category ? CATEGORY_COLORS[nodeData.category] : undefined) ||
    "#6b7280";
  const answer = nodeData.answer || "";
  const badgeColor =
    LIKERT_BADGE_COLORS[answer] ||
    (LIKERT_OPTIONS.includes(answer as any)
      ? "#9ca3af"
      : "#9ca3af");

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
      style={{ width: 200, minHeight: 70, borderLeftWidth: 4, borderLeftColor: categoryColor }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <div className="p-2">
        <p className="text-xs text-gray-700 leading-tight line-clamp-2">
          {nodeData.label}
        </p>
        {answer && (
          <span
            className="mt-1 inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: badgeColor }}
          >
            {answer}
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}
