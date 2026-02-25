"use client";

import { useState, useCallback, useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import ConsistencyGraph from "@/components/graph/ConsistencyGraph";
import AlertsPanel from "@/components/panels/AlertsPanel";
import DetailsSidebar from "@/components/panels/DetailsSidebar";
import FrameworkSelectPage from "@/components/FrameworkSelectPage";
import QuizMode from "@/components/quiz/QuizMode";
import { useGraphData } from "@/hooks/useGraphData";
import type { ConsistencyResult, GraphNodeData } from "@/lib/types";

type Mode = "select" | "quiz" | "graph";

interface Framework {
  id: string;
  name: string;
  icon: string;
}

interface SelectedNode {
  id: string;
  data: GraphNodeData;
  type: string;
}

function AppContent() {
  const { refresh } = useGraphData();
  const [mode, setMode] = useState<Mode>("select");
  const [framework, setFramework] = useState<Framework>({ id: "agency", name: "Agency & Personal Power", icon: "🧠" });
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [consistencyResults, setConsistencyResults] = useState<ConsistencyResult[]>([]);
  const [allFrameworks, setAllFrameworks] = useState<Framework[]>([]);

  // Load framework metadata so we have icon + name when quiz starts
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/frameworks`)
      .then((r) => r.json())
      .then((data) => setAllFrameworks(data.frameworks))
      .catch(() => {});
  }, []);

  const handleSelectFramework = useCallback(
    (id: string) => {
      const fw = allFrameworks.find((f) => f.id === id);
      if (fw) setFramework(fw);
      setMode("quiz");
    },
    [allFrameworks]
  );

  const handleSave = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleConsistencyResults = useCallback((results: ConsistencyResult[]) => {
    setConsistencyResults((prev) => [...results, ...prev]);
  }, []);

  const handleNodeClick = useCallback(
    (nodeId: string, nodeData: GraphNodeData, nodeType: string) => {
      setSelectedNode({ id: nodeId, data: nodeData, type: nodeType });
    },
    []
  );

  const handleDelete = useCallback(() => {
    refresh();
    setSelectedNode(null);
  }, [refresh]);

  // === SELECT screen ===
  if (mode === "select") {
    return <FrameworkSelectPage onSelect={handleSelectFramework} />;
  }

  // === QUIZ screen ===
  if (mode === "quiz") {
    return (
      <QuizMode
        frameworkId={framework.id}
        frameworkName={framework.name}
        frameworkIcon={framework.icon}
        onSave={handleSave}
        onConsistencyResults={handleConsistencyResults}
        onComplete={() => setMode("graph")}
        onChangeFramework={() => setMode("select")}
      />
    );
  }

  // === GRAPH screen ===
  return (
    <div className="graph-root flex flex-col h-screen bg-slate-950">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-white">Mirror</h1>
          <span className="text-xs text-slate-500">
            {framework.icon} {framework.name}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setMode("quiz")}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            + More questions
          </button>
          <button
            onClick={() => setMode("select")}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Change framework
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: alerts */}
        {consistencyResults.length > 0 && (
          <aside className="w-72 border-r border-slate-800 bg-slate-900 flex flex-col shrink-0 overflow-y-auto">
            <AlertsPanel results={consistencyResults} />
          </aside>
        )}

        {/* Center: graph */}
        <main className="flex-1 bg-slate-950">
          <ConsistencyGraph onNodeClick={handleNodeClick} />
        </main>

        {/* Right: node details */}
        <aside
          className={`border-l border-slate-800 bg-slate-900 shrink-0 overflow-y-auto transition-all duration-200 ${
            selectedNode ? "w-80" : "w-0"
          }`}
        >
          <DetailsSidebar
            selectedNode={selectedNode}
            onDelete={handleDelete}
            onClose={() => setSelectedNode(null)}
          />
        </aside>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}
