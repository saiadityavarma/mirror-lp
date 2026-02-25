import math

from backend.config import CATEGORIES
from backend.database import get_edges, get_questions
from backend.models import GraphData, GraphEdge, GraphNode


def build_graph() -> GraphData:
    questions = get_questions()
    edges = get_edges()

    nodes: list[GraphNode] = []
    graph_edges: list[GraphEdge] = []

    center_x, center_y = 900, 900
    hub_radius = 700
    question_radius = 180

    category_list = list(CATEGORIES.keys())
    category_positions: dict[str, tuple[float, float]] = {}

    # Create category hub nodes arranged in a circle
    for i, category in enumerate(category_list):
        angle = (2 * math.pi * i) / len(category_list) - math.pi / 2
        x = center_x + hub_radius * math.cos(angle)
        y = center_y + hub_radius * math.sin(angle)
        category_positions[category] = (x, y)

        nodes.append(
            GraphNode(
                id=f"cat-{category.lower().replace(' ', '-')}",
                type="category",
                position={"x": x, "y": y},
                data={"label": category, "color": CATEGORIES[category]},
            )
        )

    # Group questions by category
    questions_by_category: dict[str, list] = {cat: [] for cat in category_list}
    for q in questions:
        if q.category in questions_by_category:
            questions_by_category[q.category].append(q)

    # Create question nodes arranged around their category hub
    for category, cat_questions in questions_by_category.items():
        if not cat_questions:
            continue
        hub_x, hub_y = category_positions[category]
        for j, q in enumerate(cat_questions):
            angle = (2 * math.pi * j) / len(cat_questions) - math.pi / 2
            x = hub_x + question_radius * math.cos(angle)
            y = hub_y + question_radius * math.sin(angle)

            label = q.text[:50] + "..." if len(q.text) > 50 else q.text
            nodes.append(
                GraphNode(
                    id=q.id,
                    type="question",
                    position={"x": x, "y": y},
                    data={
                        "label": label,
                        "full_text": q.text,
                        "answer": q.answer,
                        "category": q.category,
                    },
                )
            )

    # Create edges from consistency_edges
    for edge in edges:
        is_consistent = edge["is_consistent"]
        color = "#22c55e" if is_consistent else "#ef4444"
        graph_edges.append(
            GraphEdge(
                id=edge["id"],
                source=edge["source_id"],
                target=edge["target_id"],
                style={"stroke": color, "strokeWidth": 2},
                data={
                    "is_consistent": is_consistent,
                    "explanation": edge["explanation"],
                },
                type="consistency",
            )
        )

    return GraphData(nodes=nodes, edges=graph_edges)
