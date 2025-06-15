"""
Vector Store Utility for RAG System
Handles document embeddings and similarity search using ChromaDB
"""

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
import logging
import json
import hashlib
from datetime import datetime
import os

logger = logging.getLogger(__name__)

class VectorStore:
    def __init__(self, persist_directory: str = "./chroma_db", collection_name: str = "eniad_documents"):
        """
        Initialize vector store with ChromaDB
        """
        self.persist_directory = persist_directory
        self.collection_name = collection_name
        self.embedding_model_name = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        
        # Create persist directory if it doesn't exist
        os.makedirs(persist_directory, exist_ok=True)
        
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        # Initialize embedding model
        try:
            self.embedding_model = SentenceTransformer(self.embedding_model_name)
            logger.info(f"✅ Loaded embedding model: {self.embedding_model_name}")
        except Exception as e:
            logger.error(f"❌ Failed to load embedding model: {e}")
            # Fallback to a simpler model
            self.embedding_model_name = "sentence-transformers/all-MiniLM-L6-v2"
            self.embedding_model = SentenceTransformer(self.embedding_model_name)
            logger.info(f"✅ Loaded fallback embedding model: {self.embedding_model_name}")
        
        # Get or create collection
        try:
            self.collection = self.client.get_collection(collection_name)
            logger.info(f"✅ Connected to existing collection: {collection_name}")
        except Exception:
            self.collection = self.client.create_collection(
                name=collection_name,
                metadata={"description": "ENIAD document embeddings for RAG system"}
            )
            logger.info(f"✅ Created new collection: {collection_name}")

    def add_documents(self, documents: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Add documents to the vector store
        documents: List of dicts with 'content', 'metadata', and optional 'id'
        """
        try:
            logger.info(f"📚 Adding {len(documents)} documents to vector store")
            
            # Prepare data for ChromaDB
            ids = []
            embeddings = []
            metadatas = []
            documents_content = []
            
            for i, doc in enumerate(documents):
                content = doc.get('content', '')
                metadata = doc.get('metadata', {})
                doc_id = doc.get('id', self._generate_doc_id(content))
                
                if not content.strip():
                    logger.warning(f"⚠️ Skipping empty document {i}")
                    continue
                
                # Generate embedding
                try:
                    embedding = self.embedding_model.encode(content).tolist()
                    
                    ids.append(doc_id)
                    embeddings.append(embedding)
                    documents_content.append(content)
                    
                    # Add processing metadata
                    metadata.update({
                        'added_timestamp': datetime.now().isoformat(),
                        'content_length': len(content),
                        'word_count': len(content.split()),
                        'embedding_model': self.embedding_model_name
                    })
                    metadatas.append(metadata)
                    
                except Exception as e:
                    logger.error(f"❌ Failed to process document {i}: {e}")
                    continue
            
            if not ids:
                return {
                    'status': 'error',
                    'error': 'No valid documents to add'
                }
            
            # Add to ChromaDB
            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=documents_content
            )
            
            result = {
                'status': 'success',
                'documents_added': len(ids),
                'collection_size': self.collection.count(),
                'embedding_model': self.embedding_model_name
            }
            
            logger.info(f"✅ Added {len(ids)} documents to vector store")
            return result
            
        except Exception as e:
            logger.error(f"❌ Error adding documents to vector store: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    def search_similar(self, query: str, n_results: int = 10, filter_metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Search for similar documents
        """
        try:
            logger.info(f"🔍 Searching for similar documents: '{query[:50]}...'")
            
            # Generate query embedding
            query_embedding = self.embedding_model.encode(query).tolist()
            
            # Prepare search parameters
            search_params = {
                'query_embeddings': [query_embedding],
                'n_results': n_results
            }
            
            # Add metadata filter if provided
            if filter_metadata:
                search_params['where'] = filter_metadata
            
            # Search in ChromaDB
            results = self.collection.query(**search_params)
            
            # Process results
            search_results = []
            if results['documents'] and results['documents'][0]:
                for i in range(len(results['documents'][0])):
                    result_item = {
                        'id': results['ids'][0][i],
                        'content': results['documents'][0][i],
                        'metadata': results['metadatas'][0][i],
                        'distance': results['distances'][0][i] if 'distances' in results else None,
                        'similarity_score': 1 - results['distances'][0][i] if 'distances' in results else None
                    }
                    search_results.append(result_item)
            
            result = {
                'status': 'success',
                'query': query,
                'results': search_results,
                'total_found': len(search_results),
                'collection_size': self.collection.count()
            }
            
            logger.info(f"✅ Found {len(search_results)} similar documents")
            return result
            
        except Exception as e:
            logger.error(f"❌ Error searching vector store: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    def get_document_by_id(self, doc_id: str) -> Dict[str, Any]:
        """Get a specific document by ID"""
        try:
            results = self.collection.get(ids=[doc_id])
            
            if results['documents']:
                return {
                    'status': 'success',
                    'id': doc_id,
                    'content': results['documents'][0],
                    'metadata': results['metadatas'][0] if results['metadatas'] else {}
                }
            else:
                return {
                    'status': 'error',
                    'error': 'Document not found'
                }
                
        except Exception as e:
            logger.error(f"❌ Error getting document {doc_id}: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    def update_document(self, doc_id: str, content: str = None, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Update an existing document"""
        try:
            # Check if document exists
            existing = self.collection.get(ids=[doc_id])
            if not existing['documents']:
                return {
                    'status': 'error',
                    'error': 'Document not found'
                }
            
            # Prepare update data
            update_data = {'ids': [doc_id]}
            
            if content is not None:
                # Generate new embedding
                embedding = self.embedding_model.encode(content).tolist()
                update_data['embeddings'] = [embedding]
                update_data['documents'] = [content]
            
            if metadata is not None:
                # Merge with existing metadata
                existing_metadata = existing['metadatas'][0] if existing['metadatas'] else {}
                updated_metadata = {**existing_metadata, **metadata}
                updated_metadata['updated_timestamp'] = datetime.now().isoformat()
                update_data['metadatas'] = [updated_metadata]
            
            # Update in ChromaDB
            self.collection.update(**update_data)
            
            return {
                'status': 'success',
                'document_id': doc_id,
                'updated_fields': list(update_data.keys())
            }
            
        except Exception as e:
            logger.error(f"❌ Error updating document {doc_id}: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    def delete_document(self, doc_id: str) -> Dict[str, Any]:
        """Delete a document from the vector store"""
        try:
            self.collection.delete(ids=[doc_id])
            
            return {
                'status': 'success',
                'document_id': doc_id,
                'collection_size': self.collection.count()
            }
            
        except Exception as e:
            logger.error(f"❌ Error deleting document {doc_id}: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    def get_collection_stats(self) -> Dict[str, Any]:
        """Get statistics about the collection"""
        try:
            count = self.collection.count()
            
            # Get sample of documents to analyze
            sample_size = min(100, count)
            if sample_size > 0:
                sample = self.collection.peek(limit=sample_size)
                
                # Analyze metadata
                categories = {}
                sources = {}
                languages = {}
                
                for metadata in sample['metadatas']:
                    if metadata:
                        # Count categories
                        category = metadata.get('category', 'unknown')
                        categories[category] = categories.get(category, 0) + 1
                        
                        # Count sources
                        source = metadata.get('source', 'unknown')
                        sources[source] = sources.get(source, 0) + 1
                        
                        # Count languages
                        language = metadata.get('language', 'unknown')
                        languages[language] = languages.get(language, 0) + 1
                
                stats = {
                    'total_documents': count,
                    'embedding_model': self.embedding_model_name,
                    'collection_name': self.collection_name,
                    'categories': categories,
                    'sources': sources,
                    'languages': languages,
                    'sample_size': sample_size
                }
            else:
                stats = {
                    'total_documents': 0,
                    'embedding_model': self.embedding_model_name,
                    'collection_name': self.collection_name
                }
            
            return {
                'status': 'success',
                'stats': stats
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting collection stats: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    def clear_collection(self) -> Dict[str, Any]:
        """Clear all documents from the collection"""
        try:
            # Delete the collection and recreate it
            self.client.delete_collection(self.collection_name)
            self.collection = self.client.create_collection(
                name=self.collection_name,
                metadata={"description": "ENIAD document embeddings for RAG system"}
            )
            
            return {
                'status': 'success',
                'message': 'Collection cleared successfully'
            }
            
        except Exception as e:
            logger.error(f"❌ Error clearing collection: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    def batch_search(self, queries: List[str], n_results: int = 5) -> Dict[str, Any]:
        """Search multiple queries at once"""
        try:
            logger.info(f"🔍 Batch searching {len(queries)} queries")
            
            # Generate embeddings for all queries
            query_embeddings = self.embedding_model.encode(queries).tolist()
            
            # Search in ChromaDB
            results = self.collection.query(
                query_embeddings=query_embeddings,
                n_results=n_results
            )
            
            # Process results for each query
            batch_results = []
            for i, query in enumerate(queries):
                query_results = []
                if results['documents'] and i < len(results['documents']):
                    for j in range(len(results['documents'][i])):
                        result_item = {
                            'id': results['ids'][i][j],
                            'content': results['documents'][i][j],
                            'metadata': results['metadatas'][i][j],
                            'distance': results['distances'][i][j] if 'distances' in results else None,
                            'similarity_score': 1 - results['distances'][i][j] if 'distances' in results else None
                        }
                        query_results.append(result_item)
                
                batch_results.append({
                    'query': query,
                    'results': query_results
                })
            
            return {
                'status': 'success',
                'batch_results': batch_results,
                'total_queries': len(queries)
            }
            
        except Exception as e:
            logger.error(f"❌ Error in batch search: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    def _generate_doc_id(self, content: str) -> str:
        """Generate a unique document ID based on content hash"""
        content_hash = hashlib.md5(content.encode()).hexdigest()
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"doc_{timestamp}_{content_hash[:8]}"

    def health_check(self) -> Dict[str, Any]:
        """Check the health of the vector store"""
        try:
            count = self.collection.count()
            
            # Test embedding generation
            test_embedding = self.embedding_model.encode("test").tolist()
            
            return {
                'status': 'healthy',
                'collection_name': self.collection_name,
                'document_count': count,
                'embedding_model': self.embedding_model_name,
                'embedding_dimension': len(test_embedding),
                'persist_directory': self.persist_directory
            }
            
        except Exception as e:
            logger.error(f"❌ Vector store health check failed: {e}")
            return {
                'status': 'unhealthy',
                'error': str(e)
            }

# Global vector store instance
vector_store = VectorStore()
