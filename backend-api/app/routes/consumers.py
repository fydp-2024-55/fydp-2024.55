import random

from datetime import datetime
from fastapi import APIRouter, status, Request, HTTPException, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..dependencies import get_current_active_user, get_async_session
from ..models.users import User
from ..models.producers import Producer
from ..schemas.consumers import (
    ConsumerCreate,
    ConsumerRead,
    ConsumerUpdate,
    ConsumerSubscriptionsAvailable,
    ConsumerSubscriptionsCreate,
    ConsumerSubscriptionsRead,
)
from ..utils.date import date_to_epoch
from ..blockchain.subscription import consumer_purchase_tokens
from ..blockchain.permissions import consumer_subscriptions

router = APIRouter()

consumer_dict = {"eth_address": "somewhareOnTheBlockchain"}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_consumer(body: ConsumerCreate):
    # Create database instance, retrieve ID

    return ConsumerRead(id=random.randint(1, 1000), **consumer_dict)


@router.get("/me", status_code=status.HTTP_200_OK)
async def read_consumer():
    # Query database instance

    return ConsumerRead(id=random.randint(1, 1000), **consumer_dict)


@router.patch("/me", status_code=status.HTTP_200_OK)
async def update_consumer(body: ConsumerUpdate):
    # Update database instance

    return ConsumerRead(id=random.randint(1, 1000), **consumer_dict)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_consumer():
    # Delete database instance

    return


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
    query = select(Producer.eth_address)
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
    consumer: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_async_session),
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
        request.app.state.token_contract,
        consumer.eth_address,
        body.eth_addresses,
        date_to_epoch(current_date),
        date_to_epoch(expiration_date),
    )

    subscriptions = consumer_subscriptions(
        request.app.state.token_contract, consumer.eth_address, session
    )

    return ConsumerSubscriptionsRead(subscriptions=subscriptions)


@router.get("/me/subscriptions", status_code=status.HTTP_200_OK)
async def read_consumer_subscriptions(
    request: Request,
    consumer: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    subscriptions = consumer_subscriptions(
        request.app.state.token_contract, consumer.eth_address, session
    )

    return ConsumerSubscriptionsRead(subscriptions=subscriptions)


@router.patch("/me/subscriptions", status_code=status.HTTP_200_OK)
async def update_consumer_subscriptions(
    request: Request,
    consumer: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    # TODO: Implement later

    subscriptions = consumer_subscriptions(
        request.app.state.token_contract, consumer.eth_address, session
    )

    return ConsumerSubscriptionsRead(subscriptions=subscriptions)


@router.delete("/me/subscriptions", status_code=status.HTTP_204_NO_CONTENT)
async def delete_consumer_subscriptions(
    request: Request, consumer: User = Depends(get_current_active_user)
):
    # TODO: Implement later

    return
