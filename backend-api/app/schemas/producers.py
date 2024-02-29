from datetime import date, datetime
from pydantic import BaseModel
from uuid import UUID


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


GENDERS = {
    "M": "Male",
    "F": "Female",
    "O": "Other",
}


ETHNICITIES = {
    "N": "American Indian or Alaskan Native",
    "A": "Asian/Pacific Islander",
    "B": "Black or African American",
    "H": "Hispanic",
    "W": "White/Caucasian",
    "O": "Other",
}

MARITAL_STATUSES = {
    "S": "Single",
    "M": "Married",
    "D": "Divorced",
    "W": "Widowed",
}

PARENTAL_STATUSES = {
    "P": "Parent",
    "N": "Not Parent",
}


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
