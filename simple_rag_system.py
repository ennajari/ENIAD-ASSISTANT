#!/usr/bin/env python3
"""
Simple RAG System for ENIAD
Processes PDF documents and provides search functionality
"""

import os
import sys
import json
import chromadb
from pathlib import Path
import fitz  # PyMuPDF
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict, Any
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
DATA_FOLDER = "RAG/data"
CHROMA_DB_PATH = "./chroma_storage"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
COLLECTION_NAME = "eniad_documents"

class SearchRequest(BaseModel):
    text: str
    limit: int = 5

class SearchResult(BaseModel):
    content: str
    metadata: Dict[str, Any]
    score: float

class SimpleRAGSystem:
    def __init__(self):
        self.embedding_model = None
        self.chroma_client = None
        self.collection = None
        self.documents = []
        
    def initialize(self):
        """Initialize the RAG system"""
        logger.info("🚀 Initializing Simple RAG System...")
        
        # Initialize embedding model
        logger.info("📥 Loading embedding model...")
        self.embedding_model = SentenceTransformer(EMBEDDING_MODEL)
        
        # Initialize ChromaDB
        logger.info("🗄️ Initializing ChromaDB...")
        self.chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
        
        # Get or create collection
        try:
            self.collection = self.chroma_client.get_collection(name=COLLECTION_NAME)
            logger.info(f"📚 Found existing collection: {COLLECTION_NAME}")
        except:
            self.collection = self.chroma_client.create_collection(name=COLLECTION_NAME)
            logger.info(f"📚 Created new collection: {COLLECTION_NAME}")
        
        logger.info("✅ RAG System initialized successfully")
    
    def extract_text_from_pdf(self, pdf_path: str) -> List[Dict[str, Any]]:
        """Extract text from PDF file"""
        logger.info(f"📄 Processing PDF: {os.path.basename(pdf_path)}")
        
        chunks = []
        try:
            doc = fitz.open(pdf_path)
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text = page.get_text()
                
                if text.strip():
                    # Split into smaller chunks
                    sentences = text.split('.')
                    current_chunk = ""
                    
                    for sentence in sentences:
                        if len(current_chunk + sentence) < 500:  # Chunk size limit
                            current_chunk += sentence + "."
                        else:
                            if current_chunk.strip():
                                chunks.append({
                                    "content": current_chunk.strip(),
                                    "metadata": {
                                        "source": os.path.basename(pdf_path),
                                        "page": page_num + 1,
                                        "type": "pdf"
                                    }
                                })
                            current_chunk = sentence + "."
                    
                    # Add remaining chunk
                    if current_chunk.strip():
                        chunks.append({
                            "content": current_chunk.strip(),
                            "metadata": {
                                "source": os.path.basename(pdf_path),
                                "page": page_num + 1,
                                "type": "pdf"
                            }
                        })
            
            doc.close()
            logger.info(f"✅ Extracted {len(chunks)} chunks from {os.path.basename(pdf_path)}")
            
        except Exception as e:
            logger.error(f"❌ Error processing {pdf_path}: {str(e)}")
        
        return chunks
    
    def process_documents(self):
        """Process all PDF documents in the data folder"""
        logger.info("📚 Processing documents...")
        
        data_path = Path(DATA_FOLDER)
        if not data_path.exists():
            logger.warning(f"⚠️ Data folder not found: {DATA_FOLDER}")
            return
        
        pdf_files = list(data_path.glob("*.pdf"))
        if not pdf_files:
            logger.warning(f"⚠️ No PDF files found in {DATA_FOLDER}")
            return
        
        logger.info(f"📄 Found {len(pdf_files)} PDF files")
        
        all_chunks = []
        for pdf_file in pdf_files:
            chunks = self.extract_text_from_pdf(str(pdf_file))
            all_chunks.extend(chunks)
        
        if all_chunks:
            self.index_documents(all_chunks)
        
        logger.info(f"✅ Processed {len(all_chunks)} document chunks")
    
    def index_documents(self, chunks: List[Dict[str, Any]]):
        """Index documents in ChromaDB"""
        logger.info(f"🔍 Indexing {len(chunks)} chunks...")
        
        # Prepare data for ChromaDB
        documents = []
        metadatas = []
        ids = []
        
        for i, chunk in enumerate(chunks):
            documents.append(chunk["content"])
            metadatas.append(chunk["metadata"])
            ids.append(f"doc_{i}")
        
        # Add to collection
        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        logger.info("✅ Documents indexed successfully")
    
    def search(self, query: str, limit: int = 5) -> List[SearchResult]:
        """Search for relevant documents"""
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=limit
            )
            
            search_results = []
            if results['documents'] and results['documents'][0]:
                for i, doc in enumerate(results['documents'][0]):
                    search_results.append(SearchResult(
                        content=doc,
                        metadata=results['metadatas'][0][i] if results['metadatas'] else {},
                        score=1.0 - results['distances'][0][i] if results['distances'] else 0.8
                    ))
            
            logger.info(f"🔍 Found {len(search_results)} results for query: '{query}'")
            return search_results
            
        except Exception as e:
            logger.error(f"❌ Search error: {str(e)}")
            return []

# Initialize RAG system
rag_system = SimpleRAGSystem()

# FastAPI app
app = FastAPI(title="Simple RAG System", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    rag_system.initialize()
    rag_system.process_documents()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "system": "Simple RAG System"}

@app.post("/api/v1/nlp/index/search/eniad-assistant")
async def search_documents(request: SearchRequest):
    """Search endpoint compatible with the enhanced API server"""
    try:
        results = rag_system.search(request.text, request.limit)
        
        # Format results to match expected structure
        formatted_results = []
        for result in results:
            formatted_results.append({
                "content": result.content,
                "metadata": result.metadata,
                "score": result.score
            })
        
        return {
            "signal": "VECTORDB_SEARCH_SUCCESS",
            "results": formatted_results
        }
        
    except Exception as e:
        logger.error(f"❌ Search endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/nlp/index/info/eniad-assistant")
async def get_collection_info():
    """Get collection information"""
    try:
        count = rag_system.collection.count()
        return {
            "signal": "VECTORDB_COLLECTION_RETRIEVED",
            "collection_info": {
                "name": COLLECTION_NAME,
                "count": count,
                "embedding_model": EMBEDDING_MODEL
            }
        }
    except Exception as e:
        logger.error(f"❌ Collection info error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Starting Simple RAG System...")
    print("📚 This will process PDF files from RAG/data folder")
    print("🔍 API will be available at http://localhost:8000")
    print("📖 Docs available at http://localhost:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
