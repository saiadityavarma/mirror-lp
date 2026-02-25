"use client";

import { useState, useCallback } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import ConsistencyGraph from "@/components/graph/ConsistencyGraph";
import FrameworkSelector from "@/components/FrameworkSelector";
import AddQuestionPanel from "@/components/panels/AddQuestionPanel";
import AlertsPanel from "@/components/panels/AlertsPanel";
import DetailsSidebar from "@/components/panels/DetailsSidebar";
import { useGraphData } from "@/hooks/useGraphData";
import type { ConsistencyResult, GraphNodeData } from "@/lib/types";

interface SelectedNode {
  id: string;
  data: GraphNodeData;
  type: string;
}

function AppContent() {
  const { refresh } = useGraphData();
  const [frameworkId, setFrameworkId] = useState("agency");
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [consistencyResults, setConsistencyResults] = useState<
    ConsistencyResult[]
  >([]);

  const handleNodeClick = useCallback(
    (nodeId: string, nodeData: GraphNodeData, nodeType: string) => {
      setSelectedNode({ id: nodeId, data: nodeData, type: nodeType });
    },
    []
  );

  const handleSave = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleDelete = useCallback(() => {
    refresh();
    setSelectedNode(null);
  }, [refresh]);

  const handleConsistencyResults = useCallback(
    (results: ConsistencyResult[]) => {
      setConsistencyResults((prev) => [...results, ...prev]);
    },
    []
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center px-4 py-2 border-b border-gray-200 bg-white shrink-0">
        <h1 className="text-lg font-bold text-gray-800">Mirror</h1>
        <span className="ml-2 text-xs text-gray-400">
          Universal self-reflection engine
        </span>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-80 border-r border-gray-200 bg-white flex flex-col shrink-0">
          <FrameworkSelector selected={frameworkId} onChange={setFrameworkId} />
          <AddQuestionPanel
            frameworkId={frameworkId}
            onSave={handleSave}
            onConsistencyResults={handleConsistencyResults}
          />
          <AlertsPanel results={consistencyResults} />
        </aside>

        {/* Center: graph */}
        <main className="flex-1 bg-gray-50">
          <ConsistencyGraph onNodeClick={handleNodeClick} />
        </main>

        {/* Right sidebar (conditional) */}
        <aside
          className={`border-l border-gray-200 bg-white shrink-0 overflow-y-auto transition-all duration-200 ${
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
