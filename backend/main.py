from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend import categorizer, consistency, database, embeddings, graph_builder
from backend.config import CATEGORIES
from backend.models import (
    CheckRequest,
    CheckResponse,
    ConsistencyResult,
    GraphData,
    QuestionCreate,
    QuestionResponse,
)

app = FastAPI(title="ConsistencyGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    database.init_db()


@app.post("/api/questions")
def create_question(body: QuestionCreate) -> dict:
    question_id = str(uuid4())
    category = categorizer.categorize(body.text)

    question = database.add_question(question_id, body.text, body.answer, category)
    embeddings.add_embedding(question_id, body.text, category)

    # Find similar questions and check consistency
    similar = embeddings.search_similar(body.text, n=5)
    consistency_results: list[ConsistencyResult] = []

    for sim_id, sim_text, sim_category, sim_distance in similar:
        if sim_id == question_id:
            continue
        if sim_category != category:
            continue

        existing = database.get_question(sim_id)
        if existing is None:
            continue

        result = consistency.check_consistency(
            body.text, body.answer, existing.text, existing.answer
        )

        edge_id = str(uuid4())
        is_consistent = result["is_consistent"]
        explanation = result["explanation"]

        database.add_edge(edge_id, question_id, sim_id, is_consistent, explanation)

        color = "#22c55e" if is_consistent else "#ef4444"
        consistency_results.append(
            ConsistencyResult(
                source_id=question_id,
                target_id=sim_id,
                is_consistent=is_consistent,
                explanation=explanation,
                color=color,
            )
        )

    return {"question": question, "consistency": consistency_results}


@app.get("/api/questions")
def list_questions() -> list[QuestionResponse]:
    return database.get_questions()


@app.delete("/api/questions/{question_id}")
def delete_question(question_id: str) -> dict:
    deleted = database.delete_question(question_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Question not found")
    embeddings.delete_embedding(question_id)
    return {"deleted": True}


@app.get("/api/graph")
def get_graph() -> GraphData:
    return graph_builder.build_graph()


@app.post("/api/check")
def check_consistency_endpoint(body: CheckRequest) -> CheckResponse:
    result = consistency.check_consistency(
        body.question_text,
        body.question_answer,
        body.compare_text,
        body.compare_answer,
    )
    return CheckResponse(
        is_consistent=result["is_consistent"],
        explanation=result["explanation"],
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
