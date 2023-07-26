from datetime import date
from pydantic import BaseModel


class ConsumerBase(BaseModel):
    pass


class ConsumerCreate(ConsumerBase):
    pass


class ConsumerRead(ConsumerBase):
    id: int
    user_id: int


class ConsumerUpdate(ConsumerBase):
    pass


class ConsumerSubscriptionsAvailable(BaseModel):
    eth_addresses: list[str]


class ConsumerSubscriptionsCreate(BaseModel):
    eth_addresses: list[str]


class ConsumerSubscriptionItem(BaseModel):
    eth_address: str
    name: str
    email: str
    creation_date: date
    expiration_date: date


class ConsumerSubscriptionsRead(BaseModel):
    subscriptions: list[ConsumerSubscriptionItem]
