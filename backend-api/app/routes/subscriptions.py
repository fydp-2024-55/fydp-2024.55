from datetime import datetime
from fastapi import APIRouter, status, Request, HTTPException, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..dependencies import get_current_active_user, get_async_session
from ..models.users import User
from ..models.producers import Producer
from ..schemas.subscriptions import (
    SubscriptionsCreate,
    SubscriptionsRead,
    SubscriptionsUpdate,
    SubscriptionsAvailable,
)
from ..utils.date import date_to_epoch
from ..blockchain.subscription import consumer_purchase_tokens
from ..blockchain.permissions import consumer_subscriptions

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_subscriptions(
    subscriptions: SubscriptionsCreate,
    request: Request,
    consumer: User = Depends(get_current_active_user),
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
        subscriptions.producer_eth_addresses,
        date_to_epoch(current_date),
        date_to_epoch(expiration_date),
    )

    subscriptions = consumer_subscriptions(
        request.app.state.token_contract, consumer.eth_address
    )

    return SubscriptionsRead(subscriptions=subscriptions)


@router.get("/me", status_code=status.HTTP_200_OK)
async def read_subscriptions(
    request: Request,
    consumer: User = Depends(get_current_active_user),
):
    subscriptions = consumer_subscriptions(
        request.app.state.token_contract, consumer.eth_address
    )

    return SubscriptionsRead(subscriptions=subscriptions)


@router.patch("/me", status_code=status.HTTP_200_OK)
async def update_subscriptions(
    request: Request, consumer: User = Depends(get_current_active_user)
):
    # TODO: Implement later

    subscriptions = consumer_subscriptions(
        request.app.state.token_contract, consumer.eth_address
    )

    return SubscriptionsRead(subscriptions=subscriptions)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subscriptions():
    # TODO: Implement later

    return


@router.get("/available")
async def read_subscriptions_available(
    min_age: int | None = None,
    max_age: int | None = None,
    gender: list[str] | None = None,
    ethnicity: list[str] | None = None,
    country: list[str] | None = None,
    min_income: int | None = None,
    max_income: int | None = None,
    marital_status: list[str] | None = None,
    parental_status: list[str] | None = None,
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

    return SubscriptionsAvailable(eth_addresses=eth_addresses)
