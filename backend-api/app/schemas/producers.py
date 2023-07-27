from datetime import date

from pydantic import BaseModel


class ProducerBase(BaseModel):
    name: str
    gender: str | None
    ethnicity: str | None
    date_of_birth: date | None
    country: str | None
    income: int | None
    marital_status: str | None
    parental_status: str | None


class ProducerCreate(ProducerBase):
    pass


class ProducerRead(ProducerBase):
    id: int
    user_id: int


class ProducerUpdate(ProducerBase):
    pass
