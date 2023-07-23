from datetime import date

from pydantic import BaseModel


class ProducerBase(BaseModel):
    name: str
    email: str
    gender: str
    ethnicity: str
    date_of_birth: date
    city: str
    state: str
    country: str
    income: int
    marital_status: str
    parental_status: str


class ProducerCreate(ProducerBase):
    eth_address: str


class ProducerRead(ProducerBase):
    id: int
    eth_address: str


class ProducerUpdate(ProducerBase):
    pass
