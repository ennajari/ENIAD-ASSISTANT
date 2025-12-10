// MongoDB initialization script for ENIAD RAG System
print('Starting MongoDB initialization for ENIAD RAG System...');

// Switch to the ENIAD database
db = db.getSiblingDB('eniad_rag_db');

// Create collections
db.createCollection('documents');
db.createCollection('embeddings');
db.createCollection('conversations');
db.createCollection('users');
db.createCollection('analytics');

// Create indexes for better performance
db.documents.createIndex({ "title": "text", "content": "text" });
db.documents.createIndex({ "category": 1 });
db.documents.createIndex({ "language": 1 });
db.documents.createIndex({ "created_at": -1 });
db.documents.createIndex({ "file_hash": 1 }, { unique: true });

db.embeddings.createIndex({ "document_id": 1 });
db.embeddings.createIndex({ "vector_id": 1 }, { unique: true });

db.conversations.createIndex({ "user_id": 1 });
db.conversations.createIndex({ "created_at": -1 });

db.users.createIndex({ "email": 1 }, { unique: true });

// Insert sample documents
db.documents.insertMany([
  {
    title: "ENIAD - École Nationale d'Intelligence Artificielle et Data Science",
    content: "L'ENIAD est une école d'ingénieurs spécialisée dans l'intelligence artificielle et dijetal. Elle propose des formations de haut niveau en IA, machine learning, deep learning, et data science.",
    category: "general",
    language: "fr",
    file_type: "text",
    file_hash: "eniad_general_info_fr",
    created_at: new Date(),
    metadata: {
      source: "official_website",
      relevance: 1.0
    }
  },
  {
    title: "Programmes d'études à l'ENIAD",
    content: "L'ENIAD propose plusieurs programmes: Intelligence Artificielle, Science des Données, Génie Informatique, Robotique et Objets Connectés. Chaque programme inclut des cours théoriques, des travaux pratiques et des projets industriels.",
    category: "programs",
    language: "fr",
    file_type: "text",
    file_hash: "eniad_programs_fr",
    created_at: new Date(),
    metadata: {
      source: "academic_catalog",
      relevance: 0.95
    }
  },
  {
    title: "Admission à l'ENIAD",
    content: "Pour intégrer l'ENIAD, les candidats doivent avoir un baccalauréat scientifique, passer un concours d'entrée et réussir un entretien. Les inscriptions se font en ligne sur le portail de l'UMP.",
    category: "admission",
    language: "fr",
    file_type: "text",
    file_hash: "eniad_admission_fr",
    created_at: new Date(),
    metadata: {
      source: "admission_guide",
      relevance: 0.9
    }
  }
]);

// Create user for RAG system
db.createUser({
  user: "rag_service",
  pwd: "rag_service_password_2024",
  roles: [
    {
      role: "readWrite",
      db: "eniad_rag_db"
    }
  ]
});

print('MongoDB initialization completed successfully!');
print('Database: eniad_rag_db');
print('Collections created: documents, embeddings, conversations, users, analytics');
print('Sample documents inserted: 3');
print('Indexes created for optimal performance');
