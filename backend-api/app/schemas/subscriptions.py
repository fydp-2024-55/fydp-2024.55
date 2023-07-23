from datetime import date

from pydantic import BaseModel


class SubscriptionCreate(BaseModel):
    consumer_eth_address: str
    producer_eth_addresses: list[str]
    expiration_date: date


class SubscriptionBody(BaseModel):
    producer_eth_address: str
    creation_date: date
    expiration_date: date
    active: bool


class SubscriptionRead(BaseModel):
    subscriptions: list[SubscriptionBody]


class SubscriptionUpdate(BaseModel):
    producer_eth_addresses: list[str]


# class UserData(BaseModel):
#     gender: str
#     ethnicity: str
#     date_of_birth: date
#     city: str
#     state: str
#     country: str
#     income: int
#     marital_status: str
#     parental_status: str
