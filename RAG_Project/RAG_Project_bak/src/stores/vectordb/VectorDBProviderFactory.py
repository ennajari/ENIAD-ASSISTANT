from .providers import QdrantDBProvider
from .providers.LanceDBProvider import LanceDBProvider
from .VectorDBEnums import VectorDBEnums
from controllers.BaseController import BaseController

class VectorDBProviderFactory:
    def __init__(self, config):
        self.config = config
        self.base_controller = BaseController()

    def create(self, provider: str):
        if provider == VectorDBEnums.QDRANT.value:
            # Si c'est une URL HTTP, l'utiliser directement
            if self.config.VECTOR_DB_PATH.startswith("http"):
                db_path = self.config.VECTOR_DB_PATH
            else:
                db_path = self.base_controller.get_database_path(db_name=self.config.VECTOR_DB_PATH)

            return QdrantDBProvider(
                db_path=db_path,
                distance_method=self.config.VECTOR_DB_DISTANCE_METHOD,
            )

        if provider == VectorDBEnums.LANCEDB.value:
            db_path = self.base_controller.get_database_path(db_name=self.config.VECTOR_DB_PATH)

            return LanceDBProvider(
                db_path=db_path
            )

        return None
