from uuid import UUID

from pydantic import BaseModel


class ConsumerBase(BaseModel):
    name: str


class ConsumerCreate(ConsumerBase):
    pass


class ConsumerRead(ConsumerBase):
    id: int
    user_id: UUID


class ConsumerUpdate(ConsumerBase):
    pass
