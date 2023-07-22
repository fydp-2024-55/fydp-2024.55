import random

from fastapi import APIRouter, status

from ..schemas.subscriptions import SubscriptionRead, SubscriptionUpdate, UserData
from blockchain.utils.purchase import consumer_purchase_tokens

router = APIRouter()

subscription_dict = {
    "creation_date": "2023-07-20",
    "expiration_date": "2023-07-20",
    "active": True,
}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_subscriptions(subscriptionIds: list[int]):
    return [
        SubscriptionRead(id=random.randint(1, 1000), **subscription_dict)
        for _ in range(len(subscriptionIds))
    ]


@router.get("/")
async def read_subscriptions():
    return [
        SubscriptionRead(id=random.randint(1, 1000), **subscription_dict)
        for _ in range(5)
    ]


@router.patch("/")
async def update_subscriptions(subscriptions: list[SubscriptionUpdate]):
    return [
        SubscriptionRead(
            id=random.randint(1, 1000),
            **subscription_dict,
        )
        for _ in range(len(subscriptions))
    ]


@router.get("/available")
async def read_subscriptions_available():
    return [str(random.randint(1, 1000)) for _ in range(5)]


user_data_dict = {
    "gender": "M",
    "ethnicity": "B",
    "date_of_birth": "2023-07-20",
    "city": "Santa Clara",
    "state": "CA",
    "country": "US",
    "income": 450000,
    "marital_status": "not single anymore",
    "parental_status": "parents and step parents",
}


@router.get("/data")
async def read_subscriptions_users():
    return [UserData(id=random.randint(1, 1000), **user_data_dict) for _ in range(5)]
