"use client";

import { useState } from "react";
import { addQuestion } from "@/lib/api";
import { LIKERT_OPTIONS, type ConsistencyResult } from "@/lib/types";

interface AddQuestionPanelProps {
  frameworkId: string;
  onSave: () => void;
  onConsistencyResults: (results: ConsistencyResult[]) => void;
}

export default function AddQuestionPanel({
  frameworkId,
  onSave,
  onConsistencyResults,
}: AddQuestionPanelProps) {
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState<string>(LIKERT_OPTIONS[2]);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<"green" | "red" | null>(null);

  async function handleSave() {
    if (!text.trim()) return;
    setSaving(true);
    try {
      const result = await addQuestion(text.trim(), answer, frameworkId);
      onConsistencyResults(result.consistency);

      const hasInconsistency = result.consistency.some(
        (r) => !r.is_consistent
      );
      setFlash(hasInconsistency ? "red" : "green");
      setTimeout(() => setFlash(null), 1500);

      setText("");
      setAnswer(LIKERT_OPTIONS[2]);
      onSave();
    } catch (err) {
      console.error("Failed to save question:", err);
    } finally {
      setSaving(false);
    }
  }

  const flashBorder =
    flash === "green"
      ? "border-green-400"
      : flash === "red"
        ? "border-red-400"
        : "border-gray-200";

  return (
    <div className={`p-4 border-b ${flashBorder} transition-colors duration-300`}>
      <h2 className="text-sm font-semibold text-gray-700 mb-2">
        Add Question
      </h2>
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={3}
        placeholder="Enter a self-assessment statement (e.g., 'I always take responsibility for my mistakes')..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-2">
        <label className="block text-xs text-gray-500 mb-1">Answer</label>
        <select
          className="w-full border border-gray-300 rounded-md p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        >
          {LIKERT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving || !text.trim()}
          className="flex-1 bg-blue-600 text-white text-sm py-1.5 px-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
