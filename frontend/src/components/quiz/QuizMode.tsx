"use client";
import { useEffect, useState, useCallback } from "react";
import { getPrompts, addQuestion } from "@/lib/api";
import type { ConsistencyResult } from "@/lib/types";

const LIKERT = [
  { label: "Strongly\nDisagree", value: "Strongly Disagree", key: "1" },
  { label: "Disagree", value: "Disagree", key: "2" },
  { label: "Neutral", value: "Neutral", key: "3" },
  { label: "Agree", value: "Agree", key: "4" },
  { label: "Strongly\nAgree", value: "Strongly Agree", key: "5" },
];

interface Props {
  frameworkId: string;
  frameworkName: string;
  frameworkIcon: string;
  onSave: () => void;
  onConsistencyResults: (results: ConsistencyResult[]) => void;
  onComplete: () => void;
  onChangeFramework: () => void;
}

export default function QuizMode({
  frameworkId,
  frameworkName,
  frameworkIcon,
  onSave,
  onConsistencyResults,
  onComplete,
  onChangeFramework,
}: Props) {
  const [prompts, setPrompts] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<"consistent" | "inconsistent" | null>(null);
  const [answered, setAnswered] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setPrompts([]);
    setIndex(0);
    setAnswered(0);
    setDone(false);
    getPrompts(frameworkId).then(setPrompts).catch(() => {});
  }, [frameworkId]);

  const advance = useCallback(() => {
    const next = index + 1;
    if (next >= prompts.length) {
      setDone(true);
    } else {
      setIndex(next);
    }
  }, [index, prompts.length]);

  const handleAnswer = useCallback(
    async (answer: string) => {
      if (saving || !prompts[index]) return;
      setSaving(true);
      try {
        const result = await addQuestion(prompts[index], answer, frameworkId);
        const hasInconsistency = result.consistency.some((r) => !r.is_consistent);
        setFlash(hasInconsistency ? "inconsistent" : "consistent");
        onConsistencyResults(result.consistency);
        onSave();
        setAnswered((n) => n + 1);
        setTimeout(() => {
          setFlash(null);
          advance();
        }, 600);
      } catch {
        advance();
      } finally {
        setSaving(false);
      }
    },
    [saving, prompts, index, frameworkId, onSave, onConsistencyResults, advance]
  );

  // Keyboard shortcuts 1-5
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, string> = {
        "1": "Strongly Disagree",
        "2": "Disagree",
        "3": "Neutral",
        "4": "Agree",
        "5": "Strongly Agree",
      };
      if (map[e.key] && !saving && !done) handleAnswer(map[e.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleAnswer, saving, done]);

  const progress = prompts.length > 0 ? ((index) / prompts.length) * 100 : 0;
  const currentPrompt = prompts[index];

  // Completion screen
  if (done) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-6">✨</div>
        <h2 className="text-3xl font-bold text-white mb-3">
          {answered} reflection{answered !== 1 ? "s" : ""} recorded
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-md">
          Your contradiction graph is ready. See where your beliefs align — and where they don&apos;t.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onComplete}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            See my graph →
          </button>
          <button
            onClick={onChangeFramework}
            className="border border-slate-600 hover:border-slate-400 text-slate-300 px-6 py-3 rounded-xl transition-colors"
          >
            Change framework
          </button>
        </div>
      </div>
    );
  }

  // Loading
  if (prompts.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-500 animate-pulse">Loading questions...</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-slate-950 flex flex-col transition-colors duration-300 ${
        flash === "inconsistent" ? "bg-red-950/30" : flash === "consistent" ? "bg-green-950/20" : ""
      }`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onChangeFramework}
          className="text-slate-500 hover:text-slate-300 text-sm transition-colors flex items-center gap-1"
        >
          ← {frameworkIcon} {frameworkName}
        </button>
        <button
          onClick={onComplete}
          className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          Skip to graph →
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800 mx-6 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Counter */}
        <div className="text-slate-500 text-sm mb-8 tracking-wide">
          {index + 1} / {prompts.length}
        </div>

        {/* Question text */}
        <div className="max-w-2xl w-full text-center mb-12">
          <p className="text-white text-2xl font-medium leading-relaxed">
            {currentPrompt}
          </p>
        </div>

        {/* Likert buttons */}
        <div className="flex gap-3 flex-wrap justify-center">
          {LIKERT.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              disabled={saving}
              className={`
                flex flex-col items-center gap-2 px-5 py-4 rounded-xl border text-sm font-medium
                transition-all duration-150 min-w-[100px]
                ${
                  saving
                    ? "opacity-40 cursor-not-allowed border-slate-700 text-slate-500"
                    : "border-slate-600 text-slate-200 hover:border-indigo-400 hover:bg-indigo-950/50 hover:text-white active:scale-95"
                }
              `}
            >
              <span className="text-xs text-slate-500">{opt.key}</span>
              <span className="text-center whitespace-pre-line leading-tight">
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        {/* Skip this question */}
        <button
          onClick={advance}
          disabled={saving}
          className="mt-8 text-slate-600 hover:text-slate-400 text-sm transition-colors disabled:opacity-30"
        >
          Skip this question
        </button>

        {/* Keyboard hint */}
        <p className="mt-4 text-slate-700 text-xs">
          Press 1 – 5 to answer with keyboard
        </p>
      </div>

      {/* Flash overlay */}
      {flash && (
        <div
          className={`fixed inset-0 pointer-events-none transition-opacity duration-300 ${
            flash === "inconsistent" ? "bg-red-500/10" : "bg-green-500/10"
          }`}
        />
      )}
    </div>
  );
}
