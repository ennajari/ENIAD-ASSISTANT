"""
RAG Agent (Retrieval-Augmented Generation)
Specialized agent for combining retrieval and generation using vector search and Gemini AI
"""

from crewai import Agent
from langchain.tools import Tool
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime
from utils.vector_store import vector_store
from utils.gemini_service import gemini_service

logger = logging.getLogger(__name__)

class RAGAgent:
    def __init__(self):
        self.vector_store = vector_store
        self.gemini_service = gemini_service
        
        # RAG configuration
        self.config = {
            'max_retrieved_docs': 10,
            'similarity_threshold': 0.3,
            'max_context_length': 4000,
            'response_max_length': 1000
        }
        
        # Initialize the CrewAI agent
        self.agent = Agent(
            role='RAG Specialist',
            goal='Provide accurate, context-aware responses by combining document retrieval with AI generation',
            backstory="""You are an expert in Retrieval-Augmented Generation (RAG) systems. You can search through 
            document collections, retrieve relevant information, and generate comprehensive answers that combine 
            retrieved knowledge with AI reasoning. You specialize in academic and institutional content.""",
            verbose=True,
            allow_delegation=False,
            tools=self._create_tools()
        )

    def _create_tools(self) -> List[Tool]:
        """Create tools for the RAG agent"""
        return [
            Tool(
                name="rag_query",
                description="Answer queries using retrieval-augmented generation",
                func=self.rag_query
            ),
            Tool(
                name="retrieve_documents",
                description="Retrieve relevant documents for a query",
                func=self.retrieve_documents
            ),
            Tool(
                name="generate_with_context",
                description="Generate response using retrieved context",
                func=self.generate_with_context
            ),
            Tool(
                name="update_knowledge_base",
                description="Update the knowledge base with new documents",
                func=self.update_knowledge_base
            ),
            Tool(
                name="search_and_summarize",
                description="Search documents and provide summaries",
                func=self.search_and_summarize
            )
        ]

    async def rag_query(self, query: str, language: str = "fr", max_docs: int = 5, include_sources: bool = True) -> Dict[str, Any]:
        """
        Main RAG query function - retrieve relevant documents and generate response
        """
        try:
            logger.info(f"🤖 RAG Query: '{query[:100]}...' (language: {language})")
            
            # Step 1: Retrieve relevant documents
            retrieval_result = await self.retrieve_documents(query, max_docs)
            
            if retrieval_result['status'] != 'success' or not retrieval_result['documents']:
                return {
                    'status': 'error',
                    'error': 'No relevant documents found',
                    'query': query,
                    'language': language
                }
            
            # Step 2: Generate response with context
            generation_result = await self.generate_with_context(
                query=query,
                context_documents=retrieval_result['documents'],
                language=language
            )
            
            if generation_result['status'] != 'success':
                return {
                    'status': 'error',
                    'error': 'Failed to generate response',
                    'query': query,
                    'retrieval_result': retrieval_result
                }
            
            # Step 3: Combine results
            rag_response = {
                'status': 'success',
                'query': query,
                'language': language,
                'answer': generation_result['response'],
                'confidence': generation_result.get('confidence', 0.8),
                'retrieved_docs_count': len(retrieval_result['documents']),
                'sources': [],
                'metadata': {
                    'retrieval_time': retrieval_result.get('processing_time', 0),
                    'generation_time': generation_result.get('processing_time', 0),
                    'total_context_length': sum(len(doc['content']) for doc in retrieval_result['documents']),
                    'timestamp': datetime.now().isoformat()
                }
            }
            
            # Add sources if requested
            if include_sources:
                for doc in retrieval_result['documents']:
                    source_info = {
                        'id': doc['id'],
                        'title': doc['metadata'].get('title', 'Untitled'),
                        'source': doc['metadata'].get('source', 'Unknown'),
                        'similarity_score': doc.get('similarity_score', 0),
                        'excerpt': doc['content'][:200] + "..." if len(doc['content']) > 200 else doc['content']
                    }
                    rag_response['sources'].append(source_info)
            
            logger.info(f"✅ RAG Query completed: {len(rag_response['answer'])} chars response")
            return rag_response
            
        except Exception as e:
            logger.error(f"❌ RAG query failed: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'query': query
            }

    async def retrieve_documents(self, query: str, max_docs: int = None, filter_metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Retrieve relevant documents from vector store"""
        try:
            logger.info(f"📚 Retrieving documents for query: '{query[:50]}...'")
            
            max_docs = max_docs or self.config['max_retrieved_docs']
            
            # Search vector store
            search_result = self.vector_store.search_similar(
                query=query,
                n_results=max_docs,
                filter_metadata=filter_metadata
            )
            
            if search_result['status'] != 'success':
                return {
                    'status': 'error',
                    'error': search_result.get('error', 'Search failed')
                }
            
            # Filter by similarity threshold
            relevant_docs = []
            for doc in search_result['results']:
                similarity_score = doc.get('similarity_score', 0)
                if similarity_score >= self.config['similarity_threshold']:
                    relevant_docs.append(doc)
            
            result = {
                'status': 'success',
                'query': query,
                'documents': relevant_docs,
                'total_found': len(relevant_docs),
                'similarity_threshold': self.config['similarity_threshold'],
                'processing_time': 0  # Could add timing
            }
            
            logger.info(f"✅ Retrieved {len(relevant_docs)} relevant documents")
            return result
            
        except Exception as e:
            logger.error(f"❌ Document retrieval failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def generate_with_context(self, query: str, context_documents: List[Dict[str, Any]], language: str = "fr") -> Dict[str, Any]:
        """Generate response using retrieved context"""
        try:
            logger.info(f"✍️ Generating response with {len(context_documents)} context documents")
            
            # Prepare context from retrieved documents
            context_text = self._prepare_context(context_documents)
            
            if not context_text.strip():
                return {
                    'status': 'error',
                    'error': 'No valid context available'
                }
            
            # Create prompt for Gemini
            prompt = self._create_rag_prompt(query, context_text, language)
            
            # Generate response using Gemini
            try:
                response = self.gemini_service._generate_text(prompt)
                
                if not response:
                    return {
                        'status': 'error',
                        'error': 'Failed to generate response from Gemini'
                    }
                
                # Clean and validate response
                cleaned_response = self._clean_response(response)
                
                result = {
                    'status': 'success',
                    'response': cleaned_response,
                    'context_length': len(context_text),
                    'response_length': len(cleaned_response),
                    'confidence': self._calculate_response_confidence(query, cleaned_response, context_documents),
                    'processing_time': 0  # Could add timing
                }
                
                logger.info(f"✅ Generated response: {len(cleaned_response)} characters")
                return result
                
            except Exception as gemini_error:
                logger.error(f"❌ Gemini generation failed: {gemini_error}")
                return {
                    'status': 'error',
                    'error': f'Generation failed: {str(gemini_error)}'
                }
            
        except Exception as e:
            logger.error(f"❌ Context generation failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def update_knowledge_base(self, documents: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Update the knowledge base with new documents"""
        try:
            logger.info(f"📝 Updating knowledge base with {len(documents)} documents")
            
            # Add documents to vector store
            result = self.vector_store.add_documents(documents)
            
            if result['status'] == 'success':
                logger.info(f"✅ Knowledge base updated: {result['documents_added']} documents added")
                
                # Get updated stats
                stats = self.vector_store.get_collection_stats()
                
                return {
                    'status': 'success',
                    'documents_added': result['documents_added'],
                    'total_documents': result['collection_size'],
                    'collection_stats': stats.get('stats', {}),
                    'timestamp': datetime.now().isoformat()
                }
            else:
                return result
                
        except Exception as e:
            logger.error(f"❌ Knowledge base update failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def search_and_summarize(self, query: str, language: str = "fr", max_docs: int = 5) -> Dict[str, Any]:
        """Search documents and provide summaries"""
        try:
            logger.info(f"📋 Search and summarize: '{query[:50]}...'")
            
            # Retrieve documents
            retrieval_result = await self.retrieve_documents(query, max_docs)
            
            if retrieval_result['status'] != 'success':
                return retrieval_result
            
            documents = retrieval_result['documents']
            if not documents:
                return {
                    'status': 'error',
                    'error': 'No relevant documents found'
                }
            
            # Generate summaries for each document
            summaries = []
            for doc in documents:
                try:
                    summary = self.gemini_service.summarize_content(doc['content'], 150)
                    summaries.append({
                        'id': doc['id'],
                        'title': doc['metadata'].get('title', 'Untitled'),
                        'source': doc['metadata'].get('source', 'Unknown'),
                        'summary': summary,
                        'similarity_score': doc.get('similarity_score', 0),
                        'content_length': len(doc['content'])
                    })
                except Exception as summary_error:
                    logger.warning(f"⚠️ Failed to summarize document {doc['id']}: {summary_error}")
                    summaries.append({
                        'id': doc['id'],
                        'title': doc['metadata'].get('title', 'Untitled'),
                        'source': doc['metadata'].get('source', 'Unknown'),
                        'summary': doc['content'][:150] + "...",
                        'similarity_score': doc.get('similarity_score', 0),
                        'content_length': len(doc['content'])
                    })
            
            # Generate overall summary
            try:
                combined_content = "\n\n".join([doc['content'] for doc in documents[:3]])  # Use top 3 docs
                overall_summary = self.gemini_service.summarize_content(combined_content, 300)
            except Exception:
                overall_summary = f"Résumé de {len(documents)} documents trouvés pour la requête: {query}"
            
            result = {
                'status': 'success',
                'query': query,
                'language': language,
                'overall_summary': overall_summary,
                'document_summaries': summaries,
                'total_documents': len(summaries),
                'timestamp': datetime.now().isoformat()
            }
            
            logger.info(f"✅ Search and summarize completed: {len(summaries)} document summaries")
            return result
            
        except Exception as e:
            logger.error(f"❌ Search and summarize failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    def _prepare_context(self, documents: List[Dict[str, Any]]) -> str:
        """Prepare context text from retrieved documents"""
        context_parts = []
        total_length = 0
        
        for doc in documents:
            content = doc.get('content', '').strip()
            if not content:
                continue
            
            # Add document with source information
            source = doc.get('metadata', {}).get('source', 'Unknown')
            doc_context = f"[Source: {source}]\n{content}\n"
            
            # Check if adding this document would exceed max context length
            if total_length + len(doc_context) > self.config['max_context_length']:
                # Truncate the document to fit
                remaining_space = self.config['max_context_length'] - total_length
                if remaining_space > 100:  # Only add if there's meaningful space
                    truncated_content = content[:remaining_space-50] + "..."
                    doc_context = f"[Source: {source}]\n{truncated_content}\n"
                    context_parts.append(doc_context)
                break
            
            context_parts.append(doc_context)
            total_length += len(doc_context)
        
        return "\n".join(context_parts)

    def _create_rag_prompt(self, query: str, context: str, language: str) -> str:
        """Create RAG prompt for Gemini"""
        if language == "ar":
            prompt = f"""بناءً على المعلومات المتوفرة أدناه، أجب على السؤال التالي بدقة وشمولية.

السياق المتاح:
{context}

السؤال: {query}

تعليمات:
1. استخدم فقط المعلومات المتوفرة في السياق
2. إذا لم تكن المعلومات كافية، اذكر ذلك بوضوح
3. قدم إجابة مفصلة ومفيدة
4. اذكر المصادر عند الإمكان

الإجابة:"""
        else:
            prompt = f"""Basé sur les informations disponibles ci-dessous, répondez à la question suivante de manière précise et complète.

Contexte disponible:
{context}

Question: {query}

Instructions:
1. Utilisez uniquement les informations disponibles dans le contexte
2. Si les informations ne sont pas suffisantes, mentionnez-le clairement
3. Fournissez une réponse détaillée et utile
4. Citez les sources quand c'est possible

Réponse:"""
        
        return prompt

    def _clean_response(self, response: str) -> str:
        """Clean and format the generated response"""
        if not response:
            return ""
        
        # Remove excessive whitespace
        import re
        response = re.sub(r'\s+', ' ', response)
        response = re.sub(r'\n\s*\n', '\n\n', response)
        
        # Limit response length
        if len(response) > self.config['response_max_length']:
            response = response[:self.config['response_max_length']] + "..."
        
        return response.strip()

    def _calculate_response_confidence(self, query: str, response: str, context_documents: List[Dict[str, Any]]) -> float:
        """Calculate confidence score for the response"""
        try:
            # Simple confidence calculation based on:
            # 1. Number of relevant documents
            # 2. Average similarity scores
            # 3. Response length vs query complexity
            
            if not context_documents:
                return 0.1
            
            # Factor 1: Number of documents (more = higher confidence)
            doc_factor = min(len(context_documents) / 5, 1.0) * 0.3
            
            # Factor 2: Average similarity scores
            similarities = [doc.get('similarity_score', 0) for doc in context_documents]
            avg_similarity = sum(similarities) / len(similarities) if similarities else 0
            similarity_factor = avg_similarity * 0.4
            
            # Factor 3: Response completeness
            response_factor = min(len(response) / 200, 1.0) * 0.3
            
            confidence = doc_factor + similarity_factor + response_factor
            return min(confidence, 1.0)
            
        except Exception:
            return 0.5  # Default confidence

    async def get_knowledge_base_stats(self) -> Dict[str, Any]:
        """Get statistics about the knowledge base"""
        try:
            stats_result = self.vector_store.get_collection_stats()
            health_result = self.vector_store.health_check()
            
            return {
                'status': 'success',
                'collection_stats': stats_result.get('stats', {}),
                'health_status': health_result,
                'rag_config': self.config,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting knowledge base stats: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def get_status(self) -> Dict[str, Any]:
        """Get agent status"""
        try:
            # Check vector store health
            health = self.vector_store.health_check()
            
            return {
                "agent_name": "RAGAgent",
                "status": "active",
                "vector_store_status": health.get('status', 'unknown'),
                "document_count": health.get('document_count', 0),
                "embedding_model": health.get('embedding_model', 'unknown'),
                "config": self.config,
                "tools_available": len(self.agent.tools) if hasattr(self.agent, 'tools') else 5
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting RAG agent status: {e}")
            return {
                "agent_name": "RAGAgent",
                "status": "error",
                "error": str(e)
            }
