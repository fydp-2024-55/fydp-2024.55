from pydantic import BaseModel


class ConsumerBase(BaseModel):
    pass


class ConsumerCreate(ConsumerBase):
    pass


class ConsumerRead(ConsumerBase):
    id: int
    user_id: int


class ConsumerUpdate(ConsumerBase):
    pass
