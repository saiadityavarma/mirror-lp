import os
from pathlib import Path

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

DATABASE_PATH = "backend/data/consistency.db"
CHROMA_PATH = "backend/data/chroma"

# Multi-framework support
FRAMEWORKS = {
    "agency": {
        "name": "Agency & Personal Power",
        "description": "Are you the author of your life, or a passenger in it?",
        "icon": "🧠",
        "principles": [
            "Self-Determination",
            "Accountability",
            "Intentionality",
            "Resilience",
            "Boundaries",
            "Growth Mindset",
            "Authenticity",
            "Agency over Fear",
        ],
        "colors": [
            "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444",
            "#10b981", "#ec4899", "#06b6d4", "#f97316",
        ],
    },
    "ethics": {
        "name": "Ethics & Character",
        "description": "Do your actions actually match your stated values?",
        "icon": "⚖️",
        "principles": [
            "Honesty",
            "Fairness",
            "Courage",
            "Compassion",
            "Integrity",
            "Responsibility",
            "Humility",
            "Wisdom",
        ],
        "colors": [
            "#0ea5e9", "#a855f7", "#f97316", "#ec4899",
            "#14b8a6", "#7c3aed", "#84cc16", "#e11d48",
        ],
    },
    "stoic": {
        "name": "Stoic Virtues",
        "description": "Ancient wisdom for surfacing modern contradictions.",
        "icon": "🏛️",
        "principles": [
            "Wisdom",
            "Justice",
            "Courage",
            "Temperance",
            "Amor Fati",
            "Memento Mori",
            "Dichotomy of Control",
            "Present Moment",
        ],
        "colors": [
            "#d97706", "#059669", "#dc2626", "#7c3aed",
            "#0891b2", "#475569", "#9333ea", "#15803d",
        ],
    },
    "amazon": {
        "name": "Amazon Leadership Principles",
        "description": "The 16 principles behind one of the world's most examined leadership cultures.",
        "icon": "📦",
        "principles": [
            "Customer Obsession",
            "Ownership",
            "Invent and Simplify",
            "Are Right, A Lot",
            "Learn and Be Curious",
            "Hire and Develop the Best",
            "Insist on the Highest Standards",
            "Think Big",
            "Bias for Action",
            "Frugality",
            "Earn Trust",
            "Dive Deep",
            "Have Backbone; Disagree and Commit",
            "Deliver Results",
            "Strive to be Earth's Best Employer",
            "Success and Scale Bring Broad Responsibility",
        ],
        "colors": [
            "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444",
            "#10b981", "#ec4899", "#06b6d4", "#f97316",
            "#84cc16", "#a855f7", "#14b8a6", "#e11d48",
            "#7c3aed", "#059669", "#0ea5e9", "#d946ef",
        ],
    },
}

DEFAULT_FRAMEWORK = "agency"

# Build a flat CATEGORIES dict for the active framework (backward compat)
def get_categories(framework_id: str = DEFAULT_FRAMEWORK) -> dict:
    fw = FRAMEWORKS.get(framework_id, FRAMEWORKS[DEFAULT_FRAMEWORK])
    return {
        principle: color
        for principle, color in zip(fw["principles"], fw["colors"])
    }

# Legacy flat categories (default framework)
CATEGORIES = get_categories(DEFAULT_FRAMEWORK)

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
