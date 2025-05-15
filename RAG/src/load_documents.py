import os
from llama_index.core import Document

def load_documents_from_txt(folder_path):
    documents = []
    try:
        for filename in os.listdir(folder_path):
            if filename.endswith(".txt"):
                with open(os.path.join(folder_path, filename), 'r', encoding='utf-8') as f:
                    text = f.read()
                    documents.append(Document(text=text, metadata={"source": filename}))
        return documents
    except Exception as e:
        print(f"Erreur lors du chargement des documents texte : {e}")
        return []