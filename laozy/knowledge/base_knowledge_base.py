from typing import Optional, Dict, List
from pydantic import BaseModel


class Embeddings:
    def embed(self, s: str) -> List[float]:
        pass


class Knowledge(BaseModel):
    id: Optional[str] = None
    content: str
    metadata: Optional[Dict] = None
    distance: Optional[float] = None
    embeddings: Optional[List[float]] = None


class KnowledgeBase:
    async def create(self, collection: str, embeddings: Embeddings = None):
        pass

    async def save(self, collection: str, knowledges: List[Knowledge], embeddings: Embeddings = None):
        pass

    async def retrieve(self, collection: str, content: Optional[str] = None, metadata: Optional[Dict] = None, topk=10, embeddings: Embeddings = None):
        pass

    async def delete(self, collection: str, id: str):
        pass

    async def drop(self, collection: str):
        pass
