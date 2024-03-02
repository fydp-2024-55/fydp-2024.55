from datetime import date, datetime
from enum import Enum
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


class Genders(Enum):
    Male = "Male"
    Female = "Female"
    Other = "Other"


GENDERS = [gender.value for gender in Genders]


class Ethnicities(Enum):
    American_Indian_or_Alaskan_Native = "American Indian or Alaskan Native"
    Asian_Pacific_Islander = "Asian/Pacific Islander"
    Black_or_African_American = "Black or African American"
    Hispanic = "Hispanic"
    White_Caucasian = "White/Caucasian"
    Other = "Other"


ETHNICITIES = [ethnicity.value for ethnicity in Ethnicities]


class MaritalStatuses(Enum):
    Single = "Single"
    Married = "Married"
    Divorced = "Divorced"
    Widowed = "Widowed"


MARITAL_STATUSES = [marital_status.value for marital_status in MaritalStatuses]


class ParentalStatuses(Enum):
    Parent = "Parent"
    Not_Parent = "Not Parent"


PARENTAL_STATUSES = [parental_status.value for parental_status in ParentalStatuses]


class FilterOptions(BaseModel):
    genders: list[str] | None
    ethnicities: list[str] | None
    countries: list[str] | None
    marital_statuses: list[str] | None
    parental_statuses: list[str] | None


class ProducerFilter(FilterOptions):
    min_age: int | None
    max_age: int | None
    min_income: int | None
    max_income: int | None


class ProducerSearchResults(BaseModel):
    totalResults: int
    genders: dict[str, int]
    ethnicities: dict[str, int]
    countries: dict[str, int]
    maritalStatuses: dict[str, int]
    parentalStatuses: dict[str, int]
    incomes: dict[str, int]
    ages: dict[str, int]


class VisitedSite(BaseModel):
    url: str  # The url of the visited site
    visited_time: datetime  # The time the site was visited
    duration: int  # How long the site was visited for (in seconds)
