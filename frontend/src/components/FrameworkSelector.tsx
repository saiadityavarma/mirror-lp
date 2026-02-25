"use client";
import { useEffect, useState } from "react";

interface Framework {
  id: string;
  name: string;
  description: string;
  icon: string;
  principle_count: number;
}

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

export default function FrameworkSelector({ selected, onChange }: Props) {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/frameworks")
      .then((r) => r.json())
      .then((data) => setFrameworks(data.frameworks))
      .catch(() => {});
  }, []);

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Choose a Framework
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {frameworks.map((fw) => (
          <button
            key={fw.id}
            onClick={() => onChange(fw.id)}
            className={`rounded-xl border-2 p-4 text-left transition-all hover:border-indigo-400 ${
              selected === fw.id
                ? "border-indigo-500 bg-indigo-950/40"
                : "border-gray-700 bg-gray-900/40"
            }`}
          >
            <div className="text-2xl mb-2">{fw.icon}</div>
            <div className="text-sm font-semibold text-white">{fw.name}</div>
            <div className="text-xs text-gray-400 mt-1">{fw.description}</div>
            <div className="text-xs text-indigo-400 mt-2">
              {fw.principle_count} principles
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
