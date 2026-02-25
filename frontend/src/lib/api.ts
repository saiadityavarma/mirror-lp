import type {
  AddQuestionResponse,
  CheckRequest,
  CheckResponse,
  GraphData,
  Question,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

export async function addQuestion(
  text: string,
  answer: string,
  frameworkId?: string
): Promise<AddQuestionResponse> {
  return request<AddQuestionResponse>("/api/questions", {
    method: "POST",
    body: JSON.stringify({ text, answer, framework_id: frameworkId }),
  });
}

export async function getQuestions(): Promise<Question[]> {
  return request<Question[]>("/api/questions");
}

export async function deleteQuestion(id: string): Promise<void> {
  await request<void>(`/api/questions/${id}`, { method: "DELETE" });
}

export async function getGraph(): Promise<GraphData> {
  return request<GraphData>("/api/graph");
}

export async function checkConsistency(
  req: CheckRequest
): Promise<CheckResponse> {
  return request<CheckResponse>("/api/check", {
    method: "POST",
    body: JSON.stringify(req),
  });
}
