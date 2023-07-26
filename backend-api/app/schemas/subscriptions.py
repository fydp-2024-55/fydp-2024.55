from datetime import date

from pydantic import BaseModel


class SubscriptionsBase(BaseModel):
    eth_addresses: list[str]


class SubscriptionsCreate(SubscriptionsBase):
    expiration_date: date


class SubscriptionItem(BaseModel):
    eth_address: str
    creation_date: date
    expiration_date: date
    active: bool


class SubscriptionsRead(BaseModel):
    subscriptions: list[SubscriptionItem]


class SubscriptionsUpdate(SubscriptionsBase):
    pass


class SubscriptionsAvailable(SubscriptionsBase):
    pass
