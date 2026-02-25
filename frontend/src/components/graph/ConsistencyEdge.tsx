"use client";

import { useState } from "react";
import {
  getBezierPath,
  EdgeLabelRenderer,
  type EdgeProps,
} from "@xyflow/react";

export default function ConsistencyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: EdgeProps) {
  const [hovered, setHovered] = useState(false);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as { is_consistent?: boolean; explanation?: string } | undefined;
  const isConsistent = edgeData?.is_consistent ?? true;
  const strokeColor = (style?.stroke as string) || (isConsistent ? "#22c55e" : "#ef4444");

  return (
    <>
      {/* Invisible wider path for easier hover */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        strokeDasharray={isConsistent ? undefined : "5 5"}
        className={isConsistent ? "" : "animate-[dash_1s_linear_infinite]"}
        style={style}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {hovered && edgeData?.explanation && (
        <EdgeLabelRenderer>
          <div
            className="absolute bg-white border border-gray-300 rounded px-2 py-1 text-xs shadow-lg max-w-[200px] pointer-events-none z-50"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            <span
              className={`font-semibold ${isConsistent ? "text-green-600" : "text-red-600"}`}
            >
              {isConsistent ? "Consistent" : "Inconsistent"}
            </span>
            <p className="text-gray-600 mt-0.5">{edgeData.explanation}</p>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
