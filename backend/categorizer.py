from __future__ import annotations

import numpy as np

from backend.config import CATEGORIES
from backend.embeddings import get_model

PROTOTYPES = {
    "Customer Obsession": [
        "I start by thinking about what the customer needs",
        "I work backwards from the customer experience",
        "I prioritize long-term customer trust over short-term gains",
        "I actively seek out customer feedback and act on it",
    ],
    "Ownership": [
        "I take full responsibility for outcomes beyond my immediate role",
        "I never say that's not my job",
        "I act on behalf of the entire organization not just my team",
        "I think long-term and don't sacrifice future value for quick wins",
    ],
    "Invent and Simplify": [
        "I look for new ways to simplify complex processes",
        "I encourage and drive innovation in my work",
        "I am comfortable being misunderstood when pursuing new ideas",
        "I seek simplicity and find ways to reduce unnecessary complexity",
    ],
    "Are Right, A Lot": [
        "I have strong judgment and good instincts",
        "I actively seek diverse perspectives to challenge my views",
        "I change my mind when presented with better information",
        "I use data and intuition together to make sound decisions",
    ],
    "Learn and Be Curious": [
        "I am always learning and seeking to improve myself",
        "I explore new possibilities and areas outside my comfort zone",
        "I am genuinely curious about how things work",
        "I invest time in developing new skills and knowledge",
    ],
    "Hire and Develop the Best": [
        "I recognize exceptional talent and help them grow",
        "I take mentoring and coaching others seriously",
        "I raise the performance bar with every hire",
        "I invest in developing people around me",
    ],
    "Insist on the Highest Standards": [
        "I hold myself and others to extremely high quality standards",
        "I never accept good enough when better is possible",
        "I continuously raise the bar on quality and performance",
        "I drive my team to deliver the highest quality work",
    ],
    "Think Big": [
        "I create and communicate a bold vision for the future",
        "I think differently and look around corners for new possibilities",
        "I set ambitious goals that inspire and stretch the team",
        "I don't limit myself to incremental improvements",
    ],
    "Bias for Action": [
        "I value speed and take calculated risks rather than waiting",
        "I make decisions quickly with the information available",
        "I believe many decisions are reversible and don't need extensive study",
        "I prefer action over analysis paralysis",
    ],
    "Frugality": [
        "I accomplish more with less and find resourceful solutions",
        "I avoid unnecessary spending and waste",
        "I believe constraints breed creativity and innovation",
        "I look for ways to be more efficient with resources",
    ],
    "Earn Trust": [
        "I listen attentively and speak candidly with respect",
        "I am openly self-critical even when it's uncomfortable",
        "I treat others with respect regardless of their position",
        "I benchmark myself against the best and hold myself accountable",
    ],
    "Dive Deep": [
        "I operate at all levels and stay connected to the details",
        "I audit frequently and question when metrics don't match expectations",
        "I dig into the root cause rather than accepting surface explanations",
        "No task is beneath me when it needs to get done",
    ],
    "Have Backbone; Disagree and Commit": [
        "I respectfully challenge decisions I disagree with",
        "I don't compromise for the sake of social harmony",
        "Once a decision is made I commit fully even if I disagreed",
        "I have the courage to speak up when something doesn't feel right",
    ],
    "Deliver Results": [
        "I focus on the key inputs and deliver them with the right quality",
        "I rise to the occasion and never settle for less",
        "I meet deadlines and deliver on commitments consistently",
        "I don't let setbacks prevent me from achieving results",
    ],
    "Strive to be Earth's Best Employer": [
        "I create a safe and productive work environment for everyone",
        "I lead with empathy and care about team wellbeing",
        "I work to develop people and help them fulfill their potential",
        "I foster an inclusive environment where everyone can thrive",
    ],
    "Success and Scale Bring Broad Responsibility": [
        "I consider the broader impact of my decisions on society",
        "I strive to leave things better than I found them",
        "I think about sustainability and long-term consequences",
        "I use my influence to make a positive difference beyond my role",
    ],
}

_centroids: dict[str, np.ndarray] | None = None


def _compute_centroids() -> dict[str, np.ndarray]:
    global _centroids
    if _centroids is not None:
        return _centroids

    model = get_model()
    _centroids = {}
    for category, sentences in PROTOTYPES.items():
        embeddings = model.encode(sentences)
        _centroids[category] = np.mean(embeddings, axis=0)
    return _centroids


def categorize(text: str, allowed_categories: list[str] | None = None) -> str:
    """
    Categorize text into the best matching principle.

    If allowed_categories is provided, only match against those principles.
    For principles not in PROTOTYPES (e.g. from non-Amazon frameworks), we
    use the principle name itself as a semantic prototype.
    """
    model = get_model()
    embedding = model.encode(text)

    # Determine which categories to compare against
    if allowed_categories:
        targets = allowed_categories
    else:
        centroids = _compute_centroids()
        targets = list(centroids.keys())

    best_category = targets[0]
    best_similarity = -1.0

    # Pre-compute centroids for known categories
    centroids = _compute_centroids()

    for category in targets:
        if category in centroids:
            centroid = centroids[category]
        else:
            # Dynamic prototype: encode the principle name itself
            centroid = model.encode(category)

        similarity = float(
            np.dot(embedding, centroid)
            / (np.linalg.norm(embedding) * np.linalg.norm(centroid))
        )
        if similarity > best_similarity:
            best_similarity = similarity
            best_category = category

    return best_category
