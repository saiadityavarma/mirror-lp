"use client";
import { useEffect, useState } from "react";

interface Framework {
  id: string;
  name: string;
  description: string;
  icon: string;
  principle_count: number;
  principles: string[];
}

interface Props {
  onSelect: (id: string) => void;
}

export default function FrameworkSelectPage({ onSelect }: Props) {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/frameworks`)
      .then((r) => r.json())
      .then((data) => setFrameworks(data.frameworks))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto" style={{ paddingBottom: "env(safe-area-inset-bottom, 24px)" }}>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
          Mirror
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Choose a framework. Answer honestly. Watch your contradictions surface.
        </p>
      </div>

      {/* Framework cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl">
        {frameworks.map((fw) => (
          <button
            key={fw.id}
            onClick={() => onSelect(fw.id)}
            onMouseEnter={() => setHoveredId(fw.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`
              relative text-left rounded-2xl border p-6 transition-all duration-200 cursor-pointer
              ${
                hoveredId === fw.id
                  ? "border-indigo-500 bg-indigo-950/60 shadow-lg shadow-indigo-900/30 scale-[1.02]"
                  : "border-slate-700 bg-slate-900/60"
              }
            `}
          >
            <div className="text-4xl mb-4">{fw.icon}</div>
            <div className="text-xl font-semibold text-white mb-2">
              {fw.name}
            </div>
            <div className="text-slate-400 text-sm leading-relaxed mb-4">
              {fw.description}
            </div>

            {/* Principles preview */}
            <div className="flex flex-wrap gap-1.5">
              {fw.principles.slice(0, 4).map((p) => (
                <span
                  key={p}
                  className="text-xs bg-slate-800 text-slate-300 rounded-full px-2.5 py-0.5"
                >
                  {p}
                </span>
              ))}
              {fw.principles.length > 4 && (
                <span className="text-xs text-slate-500 px-1 py-0.5">
                  +{fw.principles.length - 4} more
                </span>
              )}
            </div>

            {/* CTA */}
            <div
              className={`mt-5 text-sm font-medium transition-colors ${
                hoveredId === fw.id ? "text-indigo-400" : "text-slate-500"
              }`}
            >
              {fw.principle_count} questions →
            </div>
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <p className="mt-10 text-slate-600 text-xs">
        Your answers stay local. No accounts. No judgment.
      </p>
    </div>
  );
}
