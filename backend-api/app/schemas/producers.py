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
    url: str  # The url of the visited site
    visited_time: datetime  # The time the site was visited
    duration: int  # How long the site was visited for (in seconds)
