from pydantic import BaseModel


class ConsumerBase(BaseModel):
    eth_address: str


class ConsumerCreate(ConsumerBase):
    pass


class ConsumerRead(ConsumerBase):
    id: int


class ConsumerUpdate(ConsumerBase):
    pass
