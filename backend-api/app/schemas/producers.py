from datetime import date
from uuid import UUID

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
    user_id: UUID


class ProducerUpdate(ProducerBase):
    pass


class ProducerSubscriptionItem(BaseModel):
    eth_address: str
    name: str
    email: str


class ProducerSubscriptionsRead(BaseModel):
    subscriptions: list[ProducerSubscriptionItem]


class ProducerWalletBalanceRead(BaseModel):
    balance: float
