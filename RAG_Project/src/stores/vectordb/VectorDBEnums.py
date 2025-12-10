from enum import Enum

class VectorDBEnums(Enum):
    QDRANT = "QDRANT"
    LANCEDB = "LANCEDB"

class DistanceMethodEnums(Enum):
    COSINE = "cosine"
    DOT = "dot"
