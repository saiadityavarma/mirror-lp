"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import type { GraphNodeData } from "@/lib/types";

export default function CategoryNode({ data }: NodeProps) {
  const nodeData = data as unknown as GraphNodeData;
  const color = nodeData.color || "#6b7280";

  return (
    <div
      className="flex items-center justify-center rounded-full border-2 px-6 py-4"
      style={{
        width: 160,
        height: 80,
        backgroundColor: `${color}20`,
        borderColor: color,
      }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <span className="text-sm font-bold text-center" style={{ color }}>
        {nodeData.label}
      </span>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}
