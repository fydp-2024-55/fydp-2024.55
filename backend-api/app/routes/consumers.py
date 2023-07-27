from datetime import datetime
from fastapi import APIRouter, status, Request, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.params import Depends

from ..dependencies import get_current_active_user, get_async_session
from ..models.users import User
from ..models.producers import Producer
from ..schemas.consumers import (
    ConsumerCreate,
    ConsumerUpdate,
    ConsumerSubscriptionsAvailable,
    ConsumerSubscriptionsCreate,
    ConsumerSubscriptionsRead,
)
from ..utils.date import date_to_epoch
from ..blockchain.subscription import consumer_purchase_tokens
from ..blockchain.permissions import consumer_subscriptions
from ..ops import consumers as ops


router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_consumer(
    consumer: ConsumerCreate,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    await ops.create_consumer(db, consumer, user)
    return await ops.get_consumer(db, user)


@router.get("/me", status_code=status.HTTP_200_OK)
async def read_consumer(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    return await ops.get_consumer(db, user)


@router.patch("/me", status_code=status.HTTP_200_OK)
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
):
    await ops.delete_consumer(db, user)


@router.get("/subscriptions/available")
async def read_subscriptions_available(
    min_age: int | None = None,
    max_age: int | None = None,
    gender: list[str] = Query(None),
    ethnicity: list[str] = Query(None),
    country: list[str] = Query(None),
    min_income: int | None = None,
    max_income: int | None = None,
    marital_status: list[str] = Query(None),
    parental_status: list[str] = Query(None),
    session: AsyncSession = Depends(get_async_session),
):
    query = select(User.eth_address)
    query = query.where(Producer.age >= min_age) if min_age else query
    query = query.where(Producer.age <= max_age) if min_age else query
    query = query.where(Producer.gender.in_(gender)) if min_age else query
    query = query.where(Producer.ethnicity.in_(ethnicity)) if min_age else query
    query = query.where(Producer.country.in_(country)) if min_age else query
    query = query.where(Producer.income >= min_income) if min_age else query
    query = query.where(Producer.income <= max_income) if min_age else query
    query = (
        query.where(Producer.marital_status.in_(marital_status)) if min_age else query
    )
    query = (
        query.where(Producer.parental_status.in_(parental_status)) if min_age else query
    )

    eth_addresses = await session.execute(query)

    return ConsumerSubscriptionsAvailable(eth_addresses=eth_addresses)


@router.post("/me/subscriptions", status_code=status.HTTP_201_CREATED)
async def create_consumer_subscriptions(
    body: ConsumerSubscriptionsCreate,
    request: Request,
    user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    # Check for a valid expiration date
    current_date = datetime.now().date()
    expiration_date = body.expiration_date
    if expiration_date <= current_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid expiration date"
        )

    # Perform the token purchases through the smart contract
    consumer_purchase_tokens(
        request.app.state.token_contract,
        user.eth_address,
        body.eth_addresses,
        date_to_epoch(current_date),
        date_to_epoch(expiration_date),
    )

    subscriptions = await consumer_subscriptions(
        request.app.state.token_contract, user.eth_address, session
    )

    return ConsumerSubscriptionsRead(subscriptions=subscriptions)


@router.get("/me/subscriptions", status_code=status.HTTP_200_OK)
async def read_consumer_subscriptions(
    request: Request,
    user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    producer_eth_addresses = await consumer_subscriptions(
        request.app.state.token_contract, user.eth_address, session
    )

    subscriptions = []
    for eth_address in producer_eth_addresses:
        statement = select(User).where(User.eth_address == eth_address)

    return ConsumerSubscriptionsRead(subscriptions=producer_eth_addresses)


@router.patch("/me/subscriptions", status_code=status.HTTP_200_OK)
async def update_consumer_subscriptions(
    request: Request,
    user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    # TODO: Implement later

    subscriptions = consumer_subscriptions(
        request.app.state.token_contract, user.eth_address, session
    )

    return ConsumerSubscriptionsRead(subscriptions=subscriptions)


@router.delete("/me/subscriptions", status_code=status.HTTP_204_NO_CONTENT)
async def delete_consumer_subscriptions(
    request: Request, user: User = Depends(get_current_active_user)
):
    # TODO: Implement later

    return
