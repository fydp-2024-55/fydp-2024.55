from datetime import datetime
from fastapi import APIRouter, status, Request, HTTPException, Query
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
from ..ops.producers import get_producers_by_filter, get_producer_countries
from ..schemas.consumers import ConsumerCreate, ConsumerRead, ConsumerUpdate
from ..schemas.producers import (
    ProducerRead,
    FilterOptions,
    ProducerFilter,
    GENDERS,
    ETHNICITIES,
    MARITAL_STATUSES,
    PARENTAL_STATUSES,
)
from ..schemas.subscriptions import (
    SubscriptionCreate,
    SubscriptionRead,
)
from ..utils.date import date_to_epoch
from ..schemas.consumers import ConsumerCreate, ConsumerRead

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
    response_model=SubscriptionRead,
)
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

    try:
        # Perform the token purchases through the smart contract
        consumer_purchase_tokens(
            request.app.state.eth_client,
            user.eth_address,
            subscriptions.producer_eth_addresses,
            date_to_epoch(current_date),
            date_to_epoch(expiration_date),
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to purchase the tokens",
        )

    try:
        subscriptions = consumer_subscriptions(
            request.app.state.eth_client, user.eth_address
        )
        return SubscriptionRead(subscriptions=subscriptions)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve subscriptions",
        )


@router.get(
    "/me/subscriptions", status_code=status.HTTP_200_OK, response_model=SubscriptionRead
)
async def read_subscriptions(
    request: Request,
    user: User = Depends(get_current_active_user),
):
    try:
        subscriptions = consumer_subscriptions(
            request.app.state.eth_client, user.eth_address
        )
        return SubscriptionRead(subscriptions=subscriptions)
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
        consumer_unsubscribe_tokens(
            request.app.state.eth_client, user.eth_address, producers
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to unsubscribe from producers",
        )


@router.get(
    "/producer-filter-options",
    status_code=status.HTTP_200_OK,
    response_model=FilterOptions,
)
async def get_producer_filter_options(
    db: AsyncSession = Depends(get_async_session),
):
    countries = await get_producer_countries(db)
    return FilterOptions(
        genders=GENDERS.values(),
        ethnicities=ETHNICITIES.values(),
        marital_statuses=MARITAL_STATUSES.values(),
        parental_statuses=PARENTAL_STATUSES.values(),
        countries=countries,
    )


@router.get(
    "/available-subscriptions",
    status_code=status.HTTP_200_OK,
    response_model=list[ProducerRead],
)
async def read_subscriptions_available(
    min_age: int | None = None,
    max_age: int | None = None,
    min_income: int | None = None,
    max_income: int | None = None,
    genders: list[str] = Query([]),
    ethnicities: list[str] = Query([]),
    countries: list[str] = Query([]),
    marital_statuses: list[str] = Query([]),
    parental_statuses: list[str] = Query([]),
    db: AsyncSession = Depends(get_async_session),
):
    # Validate the filter options
    for gender in genders:
        if gender not in GENDERS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid gender provided",
            )
    for ethnicity in ethnicities:
        if ethnicity not in ETHNICITIES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid ethnicity provided",
            )
    for marital_status in marital_statuses:
        if marital_status not in MARITAL_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid marital status provided",
            )
    for parental_status in parental_statuses:
        if parental_status not in PARENTAL_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid parental status provided",
            )

    filter = ProducerFilter(
        genders=genders,
        ethnicities=ethnicities,
        countries=countries,
        marital_statuses=marital_statuses,
        parental_statuses=parental_statuses,
        min_age=min_age,
        max_age=max_age,
        min_income=min_income,
        max_income=max_income,
    )
    return await get_producers_by_filter(db, filter)
