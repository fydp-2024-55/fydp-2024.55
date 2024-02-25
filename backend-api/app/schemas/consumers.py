from uuid import UUID

from pydantic import BaseModel


class ConsumerBase(BaseModel):
    pass


class ConsumerCreate(ConsumerBase):
    pass


class ConsumerRead(ConsumerBase):
    pass
