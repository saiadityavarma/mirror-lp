"use client";

import type { ConsistencyResult } from "@/lib/types";

interface AlertsPanelProps {
  results: ConsistencyResult[];
}

export default function AlertsPanel({ results }: AlertsPanelProps) {
  if (results.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-400 text-center">
        No consistency checks yet
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">
        Consistency Alerts
      </h2>
      {results.map((result, idx) => (
        <div
          key={`${result.source_id}-${result.target_id}-${idx}`}
          className={`rounded-md border p-3 text-sm ${
            result.is_consistent
              ? "border-l-4 border-l-green-500 border-gray-200 bg-green-50"
              : "border-l-4 border-l-red-500 border-gray-200 bg-red-50"
          }`}
        >
          <span
            className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded ${
              result.is_consistent
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {result.is_consistent ? "Consistent" : "Inconsistent"}
          </span>
          <p className="mt-1 text-gray-600 text-xs leading-relaxed">
            {result.explanation}
          </p>
        </div>
      ))}
    </div>
  );
}
