from typing import Generic, TypeVar

from app.repositories.base_repository import BaseRepository

RepositoryType = TypeVar("RepositoryType", bound=BaseRepository)


class BaseService(Generic[RepositoryType]):
    def __init__(self, repository: RepositoryType):
        self.repository = repository

    def create(self, obj):
        return self.repository.create(obj)

    def create_many(self, objects):
        return self.repository.create_many(objects)

    def get_by_id(self, obj_id: int):
        return self.repository.get_by_id(obj_id)

    def get_all(self):
        return self.repository.get_all()

    def update(self, obj):
        return self.repository.update(obj)

    def delete(self, obj):
        return self.repository.delete(obj)