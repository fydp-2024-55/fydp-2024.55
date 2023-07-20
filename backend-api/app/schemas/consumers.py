from pydantic import BaseModel


class ConsumerBase(BaseModel):
    ethereum_address: str


class ConsumerCreate(ConsumerBase):
    pass


class ConsumerRead(ConsumerBase):
    id: int


class ConsumerUpdate(ConsumerBase):
    pass
