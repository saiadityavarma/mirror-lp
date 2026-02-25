"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import CategoryNode from "./CategoryNode";
import QuestionNode from "./QuestionNode";
import ConsistencyEdge from "./ConsistencyEdge";
import { useGraphData } from "@/hooks/useGraphData";
import type { GraphNodeData } from "@/lib/types";

const nodeTypes = {
  category: CategoryNode,
  question: QuestionNode,
};

const edgeTypes = {
  consistency: ConsistencyEdge,
};

interface ConsistencyGraphProps {
  onNodeClick?: (nodeId: string, nodeData: GraphNodeData, nodeType: string) => void;
}

export default function ConsistencyGraph({ onNodeClick }: ConsistencyGraphProps) {
  const { graphData, isLoading, isError } = useGraphData();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [fitOnce, setFitOnce] = useState(false);

  useEffect(() => {
    if (graphData) {
      setNodes(graphData.nodes as Node[]);
      setEdges(graphData.edges as Edge[]);
      setFitOnce(false);
    }
  }, [graphData, setNodes, setEdges]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      if (onNodeClick) {
        onNodeClick(node.id, node.data as unknown as GraphNodeData, node.type || "question");
      }
    },
    [onNodeClick]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading graph...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        Failed to load graph. Is the backend running?
      </div>
    );
  }

  if (!graphData || (graphData.nodes.length === 0 && graphData.edges.length === 0)) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No questions yet. Add one to get started.
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView={!fitOnce}
      onInit={() => setFitOnce(true)}
      proOptions={{ hideAttribution: true }}
    >
      <MiniMap
        nodeStrokeWidth={3}
        zoomable
        pannable
        className="bg-gray-50"
      />
      <Controls />
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
    </ReactFlow>
  );
}
