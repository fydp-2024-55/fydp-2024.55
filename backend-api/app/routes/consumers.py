from datetime import datetime
from fastapi import APIRouter, status, Request, HTTPException
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..blockchain.permissions import consumer_subscriptions
from ..blockchain.subscription import (
    consumer_subscribe,
    consumer_unsubscribe,
)
from ..dependencies import get_async_session, get_current_active_user, get_user_manager
from ..managers import UserManager
from ..models.users import User
from ..ops import consumers as ops
from ..schemas.consumers import ConsumerRead
from ..schemas.subscriptions import SubscriptionCreate, SubscriptionItem
from ..utils.date import date_to_epoch

router = APIRouter()


@router.post("/me", status_code=status.HTTP_201_CREATED, response_model=ConsumerRead)
async def create_consumer(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    if await ops.get_consumer(db, user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User is already a consumer"
        )

    if not user.eth_address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not have a wallet",
        )

    await ops.create_consumer(db, user)
    return await read_consumer(db, user)


@router.get("/me", status_code=status.HTTP_200_OK, response_model=ConsumerRead)
async def read_consumer(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    consumer = await ops.get_consumer(db, user)
    return ConsumerRead(**consumer.__dict__)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_consumer(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    await ops.delete_consumer(db, user)
    await user_manager.delete(user)


@router.post(
    "/me/subscriptions",
    status_code=status.HTTP_201_CREATED,
    response_model=list[SubscriptionItem],
)
async def create_subscriptions(
    subscriptions: SubscriptionCreate,
    request: Request,
    user: User = Depends(get_current_active_user),
):
    # Check for a valid expiration date
    current_date = datetime.now().date()
    if subscriptions.expiration_date <= current_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid expiration date"
        )

    try:
        # Perform the token purchases through the smart contract
        consumer_subscribe(
            request.app.state.eth_client,
            user.eth_address,
            subscriptions.eth_addresses,
            date_to_epoch(current_date),
            date_to_epoch(subscriptions.expiration_date),
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to purchase the tokens",
        )

    return await read_subscriptions(request, user)


@router.get(
    "/me/subscriptions",
    status_code=status.HTTP_200_OK,
    response_model=list[SubscriptionItem],
)
async def read_subscriptions(
    request: Request,
    user: User = Depends(get_current_active_user),
):
    try:
        subscriptions = consumer_subscriptions(
            request.app.state.eth_client, user.eth_address
        )
        response = []
        for subscription in subscriptions:
            response.append(SubscriptionItem(**subscription))
        return response
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve subscriptions",
        )


@router.delete(
    "/me/subscriptions",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def unsubscribe_from_producers(
    producers: list[str],
    request: Request,
    user: User = Depends(get_current_active_user),
):
    try:
        consumer_unsubscribe(request.app.state.eth_client, user.eth_address, producers)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to unsubscribe from producers",
        )
