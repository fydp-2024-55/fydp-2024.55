from datetime import date
from uuid import UUID
from pydantic import BaseModel


class ConsumerBase(BaseModel):
    name: str


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
