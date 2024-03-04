from datetime import date

from pydantic import BaseModel


class SubscriptionBase(BaseModel):
    eth_addresses: list[str]


class SubscriptionCreate(SubscriptionBase):
    expiration_date: date


class SubscriptionDelete(SubscriptionBase):
    pass


class SubscriptionItem(BaseModel):
    eth_address: str
    creation_date: date
    expiration_date: date
    active: bool
