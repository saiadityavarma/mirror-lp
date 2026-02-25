"use client";

import { useState } from "react";
import { deleteQuestion } from "@/lib/api";
import { CATEGORY_COLORS, type GraphNodeData } from "@/lib/types";

interface DetailsSidebarProps {
  selectedNode: {
    id: string;
    data: GraphNodeData;
    type: string;
  } | null;
  onDelete: () => void;
  onClose: () => void;
}

export default function DetailsSidebar({
  selectedNode,
  onDelete,
  onClose,
}: DetailsSidebarProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!selectedNode) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await deleteQuestion(selectedNode.id);
      setConfirmDelete(false);
      onDelete();
      onClose();
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeleting(false);
    }
  }

  if (!selectedNode) {
    return (
      <div className="p-4 text-sm text-gray-400 text-center mt-8">
        Click a node to see details
      </div>
    );
  }

  const { data, type } = selectedNode;
  const categoryColor =
    data.color ||
    (data.category ? CATEGORY_COLORS[data.category] : undefined) ||
    "#6b7280";

  if (type === "category") {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Category</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            x
          </button>
        </div>
        <div
          className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3"
          style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
        >
          {data.label}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">Question Details</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          x
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Question</label>
          <p className="text-sm text-gray-800">{data.full_text || data.label}</p>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Answer</label>
          <p className="text-sm font-medium text-gray-800">{data.answer || "N/A"}</p>
        </div>

        {data.category && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
              }}
            >
              {data.category}
            </span>
          </div>
        )}

        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`w-full text-sm py-1.5 px-3 rounded-md transition-colors ${
              confirmDelete
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-100 text-red-600 hover:bg-red-50"
            } disabled:opacity-50`}
          >
            {deleting
              ? "Deleting..."
              : confirmDelete
                ? "Click again to confirm"
                : "Delete Question"}
          </button>
          {confirmDelete && !deleting && (
            <button
              onClick={() => setConfirmDelete(false)}
              className="w-full mt-1 text-xs text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
