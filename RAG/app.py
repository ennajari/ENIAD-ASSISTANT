import os
from dotenv import load_dotenv
from src.create_index import create_index
from src.query_engine import get_query_engine

def main():
    load_dotenv()
    index = create_index()
    if not index:
        print("Erreur : impossible de créer l'index. Vérifiez vos documents.")
        return

    query_engine = get_query_engine(index)

    while True:
        query = input("Posez votre question (ou tapez 'exit' pour quitter) : ")
        if query.lower() == 'exit':
            break
        response = query_engine.query(query)
        print(f"\nRéponse : {response}\n")

if __name__ == "__main__":
    main()