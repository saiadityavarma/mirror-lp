from __future__ import annotations

import sqlite3
from datetime import datetime

from backend.config import DATABASE_PATH
from backend.models import (
    CREATE_EDGES_TABLE,
    CREATE_QUESTIONS_TABLE,
    QuestionResponse,
)


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    conn = _get_conn()
    try:
        conn.execute(CREATE_QUESTIONS_TABLE)
        conn.execute(CREATE_EDGES_TABLE)
        # Ensure session_id columns exist on old DBs
        for col_sql in [
            "ALTER TABLE questions ADD COLUMN session_id TEXT NOT NULL DEFAULT 'default'",
            "ALTER TABLE consistency_edges ADD COLUMN session_id TEXT NOT NULL DEFAULT 'default'",
        ]:
            try:
                conn.execute(col_sql)
            except Exception:
                pass  # Column already exists
        conn.commit()
    finally:
        conn.close()


def add_question(
    id: str, text: str, answer: str, category: str, session_id: str = "default"
) -> QuestionResponse:
    created_at = datetime.utcnow().isoformat()
    conn = _get_conn()
    try:
        conn.execute(
            "INSERT INTO questions (id, text, answer, category, created_at, session_id) VALUES (?, ?, ?, ?, ?, ?)",
            (id, text, answer, category, created_at, session_id),
        )
        conn.commit()
    finally:
        conn.close()
    return QuestionResponse(
        id=id, text=text, answer=answer, category=category,
        created_at=created_at, session_id=session_id,
    )


def get_questions(session_id: str = "default") -> list[QuestionResponse]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            "SELECT id, text, answer, category, created_at, session_id FROM questions "
            "WHERE session_id = ? ORDER BY created_at",
            (session_id,),
        ).fetchall()
    finally:
        conn.close()
    return [
        QuestionResponse(
            id=row["id"], text=row["text"], answer=row["answer"],
            category=row["category"], created_at=row["created_at"],
            session_id=row["session_id"],
        )
        for row in rows
    ]


def get_question(id: str) -> QuestionResponse | None:
    conn = _get_conn()
    try:
        row = conn.execute(
            "SELECT id, text, answer, category, created_at, session_id FROM questions WHERE id = ?",
            (id,),
        ).fetchone()
    finally:
        conn.close()
    if row is None:
        return None
    return QuestionResponse(
        id=row["id"], text=row["text"], answer=row["answer"],
        category=row["category"], created_at=row["created_at"],
        session_id=row["session_id"],
    )


def delete_question(id: str) -> bool:
    conn = _get_conn()
    try:
        delete_edges_for_question(id, conn=conn)
        cursor = conn.execute("DELETE FROM questions WHERE id = ?", (id,))
        conn.commit()
        deleted = cursor.rowcount > 0
    finally:
        conn.close()
    return deleted


def add_edge(
    id: str, source_id: str, target_id: str,
    is_consistent: bool, explanation: str, session_id: str = "default"
) -> None:
    conn = _get_conn()
    try:
        conn.execute(
            "INSERT INTO consistency_edges (id, source_id, target_id, is_consistent, explanation, session_id) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (id, source_id, target_id, is_consistent, explanation, session_id),
        )
        conn.commit()
    finally:
        conn.close()


def get_edges(session_id: str = "default") -> list[dict]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            "SELECT id, source_id, target_id, is_consistent, explanation FROM consistency_edges "
            "WHERE session_id = ?",
            (session_id,),
        ).fetchall()
    finally:
        conn.close()
    return [
        {
            "id": row["id"],
            "source_id": row["source_id"],
            "target_id": row["target_id"],
            "is_consistent": bool(row["is_consistent"]),
            "explanation": row["explanation"],
        }
        for row in rows
    ]


def delete_edges_for_question(
    question_id: str, conn: sqlite3.Connection | None = None
) -> None:
    should_close = conn is None
    if conn is None:
        conn = _get_conn()
    try:
        conn.execute(
            "DELETE FROM consistency_edges WHERE source_id = ? OR target_id = ?",
            (question_id, question_id),
        )
        if should_close:
            conn.commit()
    finally:
        if should_close:
            conn.close()
