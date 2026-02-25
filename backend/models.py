from pydantic import BaseModel


class QuestionCreate(BaseModel):
    text: str
    answer: str
    framework_id: str = "agency"


class QuestionResponse(BaseModel):
    id: str
    text: str
    answer: str
    category: str
    created_at: str


class ConsistencyResult(BaseModel):
    source_id: str
    target_id: str
    is_consistent: bool
    explanation: str
    color: str


class GraphNode(BaseModel):
    id: str
    type: str
    position: dict
    data: dict


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    style: dict
    data: dict
    type: str = "consistency"


class GraphData(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]


class CheckRequest(BaseModel):
    question_text: str
    question_answer: str
    compare_text: str
    compare_answer: str


class CheckResponse(BaseModel):
    is_consistent: bool
    explanation: str


CREATE_QUESTIONS_TABLE = """
CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TEXT NOT NULL
);
"""

CREATE_EDGES_TABLE = """
CREATE TABLE IF NOT EXISTS consistency_edges (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    is_consistent BOOLEAN NOT NULL,
    explanation TEXT NOT NULL,
    FOREIGN KEY (source_id) REFERENCES questions(id),
    FOREIGN KEY (target_id) REFERENCES questions(id)
);
"""
