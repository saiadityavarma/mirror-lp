import json
import os

import requests

from backend.config import ANTHROPIC_API_KEY, GEMINI_API_KEY

SYSTEM_PROMPT = (
    "You are a self-assessment coach analyzing responses against Amazon's Leadership Principles. "
    "Given two Likert-scale self-assessment statements, determine if the answers are logically "
    "consistent with each other. Consider that some statements may be inversely related "
    "(e.g., claiming 'I always take ownership' but also agreeing 'I wait for others to assign me tasks' "
    "would be contradictory). Surface blind spots in self-perception. "
    "Be strict — flag subtle contradictions that reveal gaps between stated values and actual behavior. "
    "Return ONLY valid JSON with two fields: "
    '"is_consistent" (boolean) and "explanation" (string, 1-2 sentences).'
)


def _parse_json_response(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1] if "\n" in text else text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
    result = json.loads(text)
    return {
        "is_consistent": bool(result.get("is_consistent", True)),
        "explanation": str(result.get("explanation", "No explanation provided")),
    }


def _build_user_prompt(q1_text: str, q1_answer: str, q2_text: str, q2_answer: str) -> str:
    return (
        f"Question 1: {q1_text}\n"
        f"Answer 1: {q1_answer}\n\n"
        f"Question 2: {q2_text}\n"
        f"Answer 2: {q2_answer}"
    )


def _check_with_gemini(q1_text: str, q1_answer: str, q2_text: str, q2_answer: str) -> dict:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    user_prompt = _build_user_prompt(q1_text, q1_answer, q2_text, q2_answer)
    payload = {
        "contents": [{"parts": [{"text": f"{SYSTEM_PROMPT}\n\n{user_prompt}"}]}],
        "generationConfig": {"temperature": 0.1, "maxOutputTokens": 1024},
    }
    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    # Gemini 2.5 may return multiple parts (thinking + response). Get the last text part.
    parts = data["candidates"][0]["content"]["parts"]
    text = parts[-1]["text"]
    return _parse_json_response(text)


def _check_with_anthropic(q1_text: str, q1_answer: str, q2_text: str, q2_answer: str) -> dict:
    import anthropic

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    user_prompt = _build_user_prompt(q1_text, q1_answer, q2_text, q2_answer)
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )
    text = response.content[0].text
    return _parse_json_response(text)


def check_consistency(
    q1_text: str, q1_answer: str, q2_text: str, q2_answer: str
) -> dict:
    try:
        if GEMINI_API_KEY:
            return _check_with_gemini(q1_text, q1_answer, q2_text, q2_answer)
        elif ANTHROPIC_API_KEY:
            return _check_with_anthropic(q1_text, q1_answer, q2_text, q2_answer)
        else:
            return {
                "is_consistent": True,
                "explanation": "No API key configured - skipping consistency check",
            }
    except Exception as e:
        return {
            "is_consistent": True,
            "explanation": f"Error checking consistency: {str(e)}",
        }
