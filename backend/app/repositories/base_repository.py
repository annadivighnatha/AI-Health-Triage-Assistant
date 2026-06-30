from typing import Generic, Optional, Type, TypeVar

from sqlalchemy.orm import Session

from app.database.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(
        self,
        model: Type[ModelType],
        db: Session,
    ):
        self.model = model
        self.db = db

    def create(self, obj: ModelType) -> ModelType:
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def create_many(
        self,
        objects: list[ModelType],
    ) -> list[ModelType]:
        self.db.add_all(objects)
        self.db.commit()

        for obj in objects:
            self.db.refresh(obj)

        return objects

    def get_by_id(
        self,
        obj_id: int,
    ) -> Optional[ModelType]:
        return (
            self.db.query(self.model)
            .filter(self.model.id == obj_id)
            .first()
        )

    def get_all(self) -> list[ModelType]:
        return self.db.query(self.model).all()

    def update(
        self,
        obj: ModelType,
    ) -> ModelType:
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def delete(
        self,
        obj: ModelType,
    ) -> None:
        self.db.delete(obj)
        self.db.commit()