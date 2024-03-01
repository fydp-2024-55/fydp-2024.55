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
    id: int


class ProducerUpdate(ProducerBase):
    pass


GENDERS = ["Male", "Female", "Other"]

ETHNICITIES = [
    "American Indian or Alaskan Native",
    "Asian/Pacific Islander",
    "Black or African American",
    "Hispanic",
    "White/Caucasian",
    "Other",
]

MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"]

PARENTAL_STATUSES = ["Parent", "Not Parent"]


class FilterOptions(BaseModel):
    genders: list[str]
    ethnicities: list[str]
    countries: list[str]
    marital_statuses: list[str]
    parental_statuses: list[str]


class ProducerFilter(FilterOptions):
    min_age: int | None
    max_age: int | None
    min_income: int | None
    max_income: int | None


class VisitedSite(BaseModel):
    url: str  # The url of the visited site
    visited_time: datetime  # The time the site was visited
    duration: int  # How long the site was visited for (in seconds)
