import lancedb
import pyarrow as pa
from typing import List, Optional, Dict, Any
from ..VectorDBInterface import VectorDBInterface
from models.VectorSearchResult import VectorSearchResult
from models.db_schemes import RetrievedDocument
import logging
import json
import uuid

logger = logging.getLogger(__name__)

class LanceDBProvider(VectorDBInterface):
    def __init__(self, db_path: str = "./lancedb_data"):
        self.db_path = db_path
        self.db = None
        self.logger = logger
        
    def connect(self):
        """Connect to LanceDB"""
        try:
            self.db = lancedb.connect(self.db_path)
            self.logger.info(f"Connected to LanceDB at {self.db_path}")
            return True
        except Exception as e:
            self.logger.error(f"Failed to connect to LanceDB: {e}")
            return False
    
    def disconnect(self):
        """Disconnect from LanceDB"""
        try:
            if self.db:
                self.db = None
                self.logger.info("Disconnected from LanceDB")
        except Exception as e:
            self.logger.error(f"Error disconnecting from LanceDB: {e}")
    
    def create_collection(self, collection_name: str, embedding_size: int, do_reset: bool = False):
        """Create a collection in LanceDB"""
        try:
            # Reset if requested
            if do_reset and collection_name in self.db.table_names():
                self.delete_collection(collection_name)

            # Check if table already exists
            if collection_name in self.db.table_names():
                self.logger.info(f"Collection {collection_name} already exists")
                return True

            # Create schema for LanceDB table
            schema = pa.schema([
                pa.field("id", pa.string()),
                pa.field("vector", pa.list_(pa.float32(), embedding_size)),
                pa.field("text", pa.string()),
                pa.field("metadata", pa.string())  # JSON string
            ])

            # Create empty table
            self.db.create_table(collection_name, schema=schema)
            self.logger.info(f"Created collection {collection_name} with vector size {embedding_size}")
            return True

        except Exception as e:
            self.logger.error(f"Failed to create collection {collection_name}: {e}")
            return False
    
    def delete_collection(self, collection_name: str):
        """Delete a collection from LanceDB"""
        try:
            if collection_name in self.db.table_names():
                self.db.drop_table(collection_name)
                self.logger.info(f"Deleted collection {collection_name}")
                return True
            else:
                self.logger.warning(f"Collection {collection_name} does not exist")
                return False
        except Exception as e:
            self.logger.error(f"Failed to delete collection {collection_name}: {e}")
            return False
    
    def insert_vectors(self, collection_name: str, vectors: List[List[float]], 
                      texts: List[str], metadatas: List[Dict], ids: List[str]):
        """Insert vectors into LanceDB collection"""
        try:
            if collection_name not in self.db.table_names():
                self.logger.error(f"Collection {collection_name} does not exist")
                return False
            
            table = self.db.open_table(collection_name)
            
            # Prepare data for insertion
            data = []
            for i in range(len(vectors)):
                import json
                data.append({
                    "id": ids[i],
                    "vector": vectors[i],
                    "text": texts[i],
                    "metadata": json.dumps(metadatas[i]) if metadatas[i] else "{}"
                })
            
            # Insert data
            table.add(data)
            self.logger.info(f"Inserted {len(vectors)} vectors into {collection_name}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to insert vectors into {collection_name}: {e}")
            return False
    
    def search_vectors(self, collection_name: str, query_vector: List[float], 
                      limit: int = 10) -> List[VectorSearchResult]:
        """Search for similar vectors in LanceDB collection"""
        try:
            if collection_name not in self.db.table_names():
                self.logger.error(f"Collection {collection_name} does not exist")
                return []
            
            table = self.db.open_table(collection_name)
            
            # Perform vector search
            results = table.search(query_vector).limit(limit).to_list()
            
            # Convert to VectorSearchResult objects
            search_results = []
            for result in results:
                import json
                metadata = json.loads(result.get("metadata", "{}"))
                
                search_result = VectorSearchResult(
                    id=result["id"],
                    text=result["text"],
                    metadata=metadata,
                    score=result.get("_distance", 0.0)  # LanceDB returns distance
                )
                search_results.append(search_result)
            
            self.logger.info(f"Found {len(search_results)} results in {collection_name}")
            return search_results
            
        except Exception as e:
            self.logger.error(f"Failed to search vectors in {collection_name}: {e}")
            return []
    
    def get_collection_info(self, collection_name: str) -> Optional[Dict[str, Any]]:
        """Get information about a collection"""
        try:
            if collection_name not in self.db.table_names():
                return None
            
            table = self.db.open_table(collection_name)
            count = table.count_rows()
            
            return {
                "name": collection_name,
                "vectors_count": count,
                "status": "ready"
            }
            
        except Exception as e:
            self.logger.error(f"Failed to get collection info for {collection_name}: {e}")
            return None
    
    def collection_exists(self, collection_name: str) -> bool:
        """Check if a collection exists"""
        try:
            return collection_name in self.db.table_names()
        except Exception as e:
            self.logger.error(f"Failed to check if collection {collection_name} exists: {e}")
            return False
    
    def reset_collection(self, collection_name: str, vector_size: int, distance_method: str = "cosine"):
        """Reset (delete and recreate) a collection"""
        try:
            # Delete if exists
            if self.collection_exists(collection_name):
                self.delete_collection(collection_name)

            # Recreate
            return self.create_collection(collection_name, vector_size, distance_method)

        except Exception as e:
            self.logger.error(f"Failed to reset collection {collection_name}: {e}")
            return False

    # Abstract methods implementation
    def is_collection_existed(self, collection_name: str) -> bool:
        """Check if a collection exists (alias for collection_exists)"""
        return self.collection_exists(collection_name)

    def list_all_collections(self) -> List:
        """List all collections"""
        try:
            return list(self.db.table_names())
        except Exception as e:
            self.logger.error(f"Failed to list collections: {e}")
            return []

    def insert_one(self, collection_name: str, text: str, vector: list,
                   metadata: dict = None, record_id: str = None):
        """Insert a single vector"""
        try:
            if record_id is None:
                record_id = str(uuid.uuid4())

            return self.insert_vectors(
                collection_name=collection_name,
                vectors=[vector],
                texts=[text],
                metadatas=[metadata or {}],
                ids=[record_id]
            )
        except Exception as e:
            self.logger.error(f"Failed to insert one vector: {e}")
            return False

    def insert_many(self, collection_name: str, texts: list,
                    vectors: list, metadata: list = None,
                    record_ids: list = None, batch_size: int = 50):
        """Insert multiple vectors"""
        try:
            if record_ids is None:
                record_ids = [str(uuid.uuid4()) for _ in range(len(texts))]

            if metadata is None:
                metadata = [{} for _ in range(len(texts))]

            # Process in batches
            for i in range(0, len(vectors), batch_size):
                batch_vectors = vectors[i:i+batch_size]
                batch_texts = texts[i:i+batch_size]
                batch_metadata = metadata[i:i+batch_size]
                batch_ids = record_ids[i:i+batch_size]

                success = self.insert_vectors(
                    collection_name=collection_name,
                    vectors=batch_vectors,
                    texts=batch_texts,
                    metadatas=batch_metadata,
                    ids=batch_ids
                )

                if not success:
                    return False

            return True
        except Exception as e:
            self.logger.error(f"Failed to insert many vectors: {e}")
            return False

    def search_by_vector(self, collection_name: str, vector: list, limit: int) -> List[RetrievedDocument]:
        """Search for similar vectors and return RetrievedDocument objects"""
        try:
            if collection_name not in self.db.table_names():
                self.logger.error(f"Collection {collection_name} does not exist")
                return []

            table = self.db.open_table(collection_name)

            # Perform vector search
            results = table.search(vector).limit(limit).to_list()

            # Convert to RetrievedDocument objects
            retrieved_docs = []
            for result in results:
                metadata = json.loads(result.get("metadata", "{}"))

                retrieved_doc = RetrievedDocument(
                    id=result["id"],
                    text=result["text"],
                    metadata=metadata,
                    score=1.0 - result.get("_distance", 0.0)  # Convert distance to similarity score
                )
                retrieved_docs.append(retrieved_doc)

            self.logger.info(f"Found {len(retrieved_docs)} results in {collection_name}")
            return retrieved_docs

        except Exception as e:
            self.logger.error(f"Failed to search vectors in {collection_name}: {e}")
            return []
