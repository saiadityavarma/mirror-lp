import os
from pathlib import Path

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

DATABASE_PATH = "backend/data/consistency.db"
CHROMA_PATH = "backend/data/chroma"

CATEGORIES = {
    "Customer Obsession": "#3b82f6",
    "Ownership": "#8b5cf6",
    "Invent and Simplify": "#f59e0b",
    "Are Right, A Lot": "#ef4444",
    "Learn and Be Curious": "#10b981",
    "Hire and Develop the Best": "#ec4899",
    "Insist on the Highest Standards": "#06b6d4",
    "Think Big": "#f97316",
    "Bias for Action": "#84cc16",
    "Frugality": "#a855f7",
    "Earn Trust": "#14b8a6",
    "Dive Deep": "#e11d48",
    "Have Backbone; Disagree and Commit": "#7c3aed",
    "Deliver Results": "#059669",
    "Strive to be Earth's Best Employer": "#0ea5e9",
    "Success and Scale Bring Broad Responsibility": "#d946ef",
}

LIKERT_SCALE = {
    "Strongly Disagree": 1,
    "Disagree": 2,
    "Neutral": 3,
    "Agree": 4,
    "Strongly Agree": 5,
}

# Ensure data directory exists
Path(DATABASE_PATH).parent.mkdir(parents=True, exist_ok=True)
Path(CHROMA_PATH).mkdir(parents=True, exist_ok=True)
