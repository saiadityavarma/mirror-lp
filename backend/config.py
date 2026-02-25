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

QUESTION_BANK: dict[str, list[str]] = {
    "agency": [
        "I take full responsibility for outcomes in my life, even when circumstances are difficult.",
        "I regularly set clear intentions for what I want to achieve in the next 90 days.",
        "When I face fear or resistance, I act anyway rather than waiting for comfort.",
        "I am intentional about how I spend my time and energy each day.",
        "I enforce my personal boundaries even when it creates conflict.",
        "I actively seek feedback and use it to grow, rather than defending my current position.",
        "I express who I truly am rather than performing a version I think others want to see.",
        "When I commit to something, I follow through regardless of how I feel in the moment.",
        "I take initiative on problems even when no one has assigned them to me.",
        "I regularly review whether my actions are aligned with my long-term values.",
        "When things go wrong, my first instinct is to ask what I could have done differently.",
        "I make decisions based on my values rather than what others expect of me.",
        "I am honest with myself about my real motivations, not just the ones I'd admit publicly.",
        "I invest in my own growth even when it's uncomfortable or inconvenient.",
        "I choose my response to circumstances rather than being controlled by them.",
    ],
    "ethics": [
        "I tell the truth even when it's uncomfortable or when lying would be easier.",
        "I treat people fairly regardless of whether they can do something for me.",
        "I speak up when I see something wrong, even if it puts me in an awkward position.",
        "I consider the impact of my decisions on people who are not in the room.",
        "My private behavior matches what I claim to value publicly.",
        "I take responsibility for mistakes without deflecting or rationalizing.",
        "I acknowledge what I don't know rather than pretending to certainty.",
        "I give others the benefit of the doubt before assuming bad intent.",
        "I keep commitments even when breaking them would be convenient.",
        "I make decisions I'd be comfortable with if they were made fully public.",
        "I stand by my principles even when the group or crowd disagrees.",
        "I act with integrity when no one is watching.",
        "I give credit to others even when taking it myself would benefit me more.",
        "I consider long-term consequences, not just immediate outcomes.",
        "I apologize and make amends when I cause harm, without minimizing it.",
    ],
    "stoic": [
        "I focus my energy on what is within my control and release what is not.",
        "I can name specific things I am grateful for right now, even during difficulty.",
        "I treat setbacks as opportunities to practice resilience rather than reasons to quit.",
        "I regularly reflect on my own mortality and let it clarify what matters.",
        "I act virtuously regardless of whether it leads to comfort or recognition.",
        "I remain calm and rational in high-stress situations rather than reacting emotionally.",
        "I embrace difficulty as training rather than something to avoid.",
        "I hold my opinions loosely and update them when faced with better reasoning.",
        "I practice temperance — avoiding excess in habits, consumption, or emotion.",
        "I do what I know is right even without external validation or reward.",
        "When facing adversity, I look for meaning rather than escape.",
        "I am not controlled by my appetite for pleasure or fear of discomfort.",
        "I regularly examine whether my life is aligned with my stated philosophy.",
        "I treat other people's interests as genuinely important, not just instrumentally.",
        "I accept things as they are before trying to change them.",
    ],
    "amazon": [
        "My first instinct in any decision is to ask what the customer actually needs.",
        "I treat problems as mine to solve even when they fall outside my formal responsibilities.",
        "I look for ways to simplify processes before adding complexity.",
        "I make high-quality decisions with incomplete information.",
        "I actively seek to learn something meaningful every week.",
        "I give honest feedback even when it's uncomfortable for the recipient.",
        "I push back on mediocre work rather than accepting good enough.",
        "I pursue goals that seem unreasonably ambitious rather than playing it safe.",
        "I make decisions and move rather than waiting for perfect information.",
        "I find ways to accomplish goals with fewer resources than initially planned.",
        "I build trust by doing what I say I will do, consistently.",
        "I get into the details of problems rather than managing at a surface level.",
        "I state my disagreement clearly, then fully commit once a decision is made.",
        "I prioritize outcomes over activity and measure what actually matters.",
        "I consider whether my actions today create long-term systemic consequences.",
    ],
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
