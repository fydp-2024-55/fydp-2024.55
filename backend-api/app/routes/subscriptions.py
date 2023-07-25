import random

from datetime import datetime
from fastapi import APIRouter, status, Request, HTTPException

from ..schemas.subscriptions import (
    SubscriptionCreate,
    SubscriptionRead,
)
from ..utils.date import date_to_epoch
from ..blockchain.subscription import consumer_purchase_tokens
from ..blockchain.permissions import consumer_subscriptions

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_subscriptions(subscriptions: SubscriptionCreate, request: Request):
    # Check for a valid expiration date
    current_date = datetime.now().date()
    expiration_date = subscriptions.expiration_date
    if expiration_date <= current_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid expiration date"
        )

    # Perform the token purchases through the smart contract
    consumer_purchase_tokens(
        request.app.state.token_contract,
        subscriptions.consumer_eth_address,
        subscriptions.producer_eth_addresses,
        date_to_epoch(current_date),
        date_to_epoch(expiration_date),
    )

    subscriptions = consumer_subscriptions(
        request.app.state.token_contract, subscriptions.consumer_eth_address
    )

    return SubscriptionRead(subscriptions=subscriptions)


@router.get("/{consumer_eth_address}", status_code=status.HTTP_200_OK)
async def read_subscriptions(consumer_eth_address: str, request: Request):
    subscriptions = consumer_subscriptions(
        request.app.state.token_contract, consumer_eth_address
    )

    return SubscriptionRead(subscriptions=subscriptions)


@router.patch("/{consumer_eth_address}", status_code=status.HTTP_200_OK)
async def update_subscriptions(consumer_eth_address: str, request: Request):
    # TODO: Implement later

    subscriptions = consumer_subscriptions(
        request.app.state.token_contract, consumer_eth_address
    )

    return SubscriptionRead(subscriptions=subscriptions)


@router.delete("/{consumer_eth_address}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subscriptions(consumer_eth_address: str):
    # TODO: Implement later

    return


@router.get("/available")
async def read_subscriptions_available():
    return [str(random.randint(1, 1000)) for _ in range(5)]


# user_data_dict = {
#     "gender": "M",
#     "ethnicity": "B",
#     "date_of_birth": "2023-07-20",
#     "city": "Santa Clara",
#     "state": "CA",
#     "country": "US",
#     "income": 450000,
#     "marital_status": "not single anymore",
#     "parental_status": "parents and step parents",
# }


# @router.get("/data")
# async def read_subscriptions_users():
#     return [UserData(id=random.randint(1, 1000), **user_data_dict) for _ in range(5)]
