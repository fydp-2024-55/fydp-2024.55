from datetime import date

from pydantic import BaseModel


class SubscriptionBase(BaseModel):
    expiration_date: date
    active: bool


class SubscriptionRead(SubscriptionBase):
    id: int
    creation_date: date


class SubscriptionUpdate(SubscriptionBase):
    pass


class UserData(BaseModel):
    gender: str
    ethnicity: str
    date_of_birth: date
    city: str
    state: str
    country: str
    income: int
    marital_status: str
    parental_status: str
