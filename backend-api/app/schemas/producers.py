from datetime import date, datetime

from pydantic import BaseModel


class ProducerBase(BaseModel):
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
    pass


class ProducerUpdate(ProducerBase):
    pass


class VisitedSite(BaseModel):
    url: str
    title: str
    visited_time: datetime
    time_spent: int  # in seconds
