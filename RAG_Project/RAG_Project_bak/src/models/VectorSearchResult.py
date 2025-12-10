from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class VectorSearchResult(BaseModel):
    """
    Modèle pour les résultats de recherche vectorielle
    """
    id: str
    score: float
    content: str
    metadata: Optional[Dict[str, Any]] = None
    document_id: Optional[str] = None
    chunk_id: Optional[str] = None
    
    class Config:
        arbitrary_types_allowed = True

class VectorSearchResponse(BaseModel):
    """
    Réponse complète pour une recherche vectorielle
    """
    results: List[VectorSearchResult]
    total_results: int
    query: str
    processing_time: Optional[float] = None
    
    class Config:
        arbitrary_types_allowed = True
