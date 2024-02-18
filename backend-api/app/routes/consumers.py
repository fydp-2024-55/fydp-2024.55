import random
from datetime import datetime
from fastapi import APIRouter, status, Request, HTTPException
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..blockchain.permissions import consumer_subscriptions
from ..blockchain.subscription import (
    consumer_purchase_tokens,
    consumer_unsubscribe_tokens,
)
from ..dependencies import get_async_session, get_current_active_user, get_user_manager
from ..managers import UserManager
from ..models.users import User
from ..ops import consumers as ops
from ..schemas.consumers import ConsumerCreate, ConsumerRead, ConsumerUpdate
from ..schemas.subscriptions import (
    SubscriptionCreate,
    SubscriptionRead,
)
from ..utils.date import date_to_epoch

router = APIRouter()


@router.post("/me", status_code=status.HTTP_201_CREATED, response_model=ConsumerRead)
async def create_consumer(
    consumer: ConsumerCreate,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    await ops.create_consumer(db, consumer, user)
    return await ops.get_consumer(db, user)


@router.get("/me", status_code=status.HTTP_200_OK, response_model=ConsumerRead)
async def read_consumer(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    return await ops.get_consumer(db, user)


@router.patch("/me", status_code=status.HTTP_200_OK, response_model=ConsumerRead)
async def update_consumer(
    consumer: ConsumerUpdate,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    await ops.update_consumer(db, consumer, user)
    return await ops.get_consumer(db, user)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_consumer(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    await ops.delete_consumer(db, user)
    await user_manager.delete(user)


@router.post("/me/subscriptions", status_code=status.HTTP_201_CREATED)
async def create_subscriptions(
    subscriptions: SubscriptionCreate,
    request: Request,
    user: User = Depends(get_current_active_user),
):
    # Check for a valid expiration date
    current_date = datetime.now().date()
    expiration_date = subscriptions.expiration_date
    if expiration_date <= current_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid expiration date"
        )

    # Perform the token purchases through the smart contract
    consumer_purchase_tokens(
        request.app.state.eth_client,
        user.eth_address,
        subscriptions.producer_eth_addresses,
        date_to_epoch(current_date),
        date_to_epoch(expiration_date),
    )

    subscriptions = consumer_subscriptions(
        request.app.state.eth_client, user.eth_address
    )

    return SubscriptionRead(subscriptions=subscriptions)


@router.get("/me/subscriptions", status_code=status.HTTP_200_OK)
async def read_subscriptions(
    request: Request,
    user: User = Depends(get_current_active_user),
):
    subscriptions = consumer_subscriptions(
        request.app.state.eth_client, user.eth_address
    )

    return SubscriptionRead(subscriptions=subscriptions)


@router.patch("/me/subscriptions", status_code=status.HTTP_200_OK)
async def update_subscriptions(
    request: Request,
    user: User = Depends(get_current_active_user),
):
    # TODO: Implement later

    subscriptions = consumer_subscriptions(
        request.app.state.eth_client, user.eth_address
    )

    return SubscriptionRead(subscriptions=subscriptions)


@router.delete("/me/subscriptions", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subscriptions(
    producers: list[str],
    request: Request,
    user: User = Depends(get_current_active_user),
):
    consumer_unsubscribe_tokens(
        request.app.state.eth_client, user.eth_address, producers
    )

    subscriptions = consumer_subscriptions(
        request.app.state.eth_client, user.eth_address
    )

    return subscriptions


@router.get("/subscriptions/available")
async def read_subscriptions_available():
    return [str(random.randint(1, 1000)) for _ in range(5)]
