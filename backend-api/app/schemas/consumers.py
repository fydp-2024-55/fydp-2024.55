from pydantic import BaseModel


class ConsumerCreate(BaseModel):
    eth_address: str
    email: str


class ConsumerRead(BaseModel):
    id: int
    eth_address: str
    email: str


class ConsumerUpdate(BaseModel):
    email: str
