from datetime import date

from pydantic import BaseModel


class SubscriptionItem(BaseModel):
    producer_eth_address: str
    creation_date: date
    expiration_date: date
    active: bool


class SubscriptionCreate(BaseModel):
    producer_eth_addresses: list[str]
    expiration_date: date


class SubscriptionRead(BaseModel):
    subscriptions: list[SubscriptionItem]


class SubscriptionUpdate(BaseModel):
    producer_eth_addresses: list[str]


class SubscriptionDelete(BaseModel):
    producer_eth_addresses: list[str]
