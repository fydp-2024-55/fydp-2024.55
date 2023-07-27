from datetime import date
from uuid import UUID
from pydantic import BaseModel


class ConsumerBase(BaseModel):
    name: str
    eth_address: str | None


class ConsumerCreate(ConsumerBase):
    pass


class ConsumerRead(ConsumerBase):
    id: int
    user_id: UUID


class ConsumerUpdate(ConsumerBase):
    pass


class ConsumerSubscriptionsAvailable(BaseModel):
    eth_addresses: list[str]


class ConsumerSubscriptionsCreate(BaseModel):
    eth_addresses: list[str]
    expiration_date: date


class ConsumerSubscriptionItem(BaseModel):
    eth_address: str
    name: str
    email: str
    gender: str
    ethnicity: str
    date_of_birth: date
    country: str
    income: int
    marital_status: str
    parental_status: str
    creation_date: date
    expiration_date: date


class ConsumerSubscriptionsRead(BaseModel):
    subscriptions: list[ConsumerSubscriptionItem]


class ProducersQuery(BaseModel):
    min_age: int | None = None
    max_age: int | None = None
    genders: list[str] = []
    ethnicities: list[str] = []
    countries: list[str] = []
    min_income: int | None = None
    max_income: int | None = None
    marital_statuses: list[str] = []
    parental_statuses: list[str] = []


class ProducersQueryResults(BaseModel):
    eth_addresses: list[str]
    genders: dict[str, int]
    ethnicities: dict[str, int]
    countries: dict[str, int]
    marital_statuses: dict[str, int]
    parental_statuses: dict[str, int]
