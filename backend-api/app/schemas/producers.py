from datetime import date

from pydantic import BaseModel


class ProducerBase(BaseModel):
    name: str
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
    pass


class ProducerRead(ProducerBase):
    id: int
    user_id: int


class ProducerUpdate(ProducerBase):
    pass
