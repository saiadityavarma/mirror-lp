from __future__ import annotations

from sentence_transformers import SentenceTransformer
import chromadb

from backend.config import CHROMA_PATH

_model: SentenceTransformer | None = None
_collection: chromadb.Collection | None = None


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def get_collection() -> chromadb.Collection:
    global _collection
    if _collection is None:
        client = chromadb.PersistentClient(path=CHROMA_PATH)
        _collection = client.get_or_create_collection(
            name="questions",
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def add_embedding(id: str, text: str, category: str) -> None:
    model = get_model()
    embedding = model.encode(text).tolist()
    collection = get_collection()
    collection.add(
        ids=[id],
        embeddings=[embedding],
        documents=[text],
        metadatas=[{"category": category}],
    )


def search_similar(text: str, n: int = 5) -> list[tuple[str, str, str, float]]:
    collection = get_collection()
    if collection.count() == 0:
        return []

    model = get_model()
    embedding = model.encode(text).tolist()

    actual_n = min(n, collection.count())
    results = collection.query(
        query_embeddings=[embedding],
        n_results=actual_n,
        include=["documents", "metadatas", "distances"],
    )

    similar = []
    if results["ids"] and results["ids"][0]:
        for i, id in enumerate(results["ids"][0]):
            doc = results["documents"][0][i]
            meta = results["metadatas"][0][i]
            dist = results["distances"][0][i]
            similar.append((id, doc, meta["category"], dist))

    return similar


def delete_embedding(id: str) -> None:
    collection = get_collection()
    try:
        collection.delete(ids=[id])
    except Exception:
        pass
