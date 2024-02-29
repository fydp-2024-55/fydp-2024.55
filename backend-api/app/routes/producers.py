from datetime import datetime
from typing import List
from fastapi import APIRouter, Request, status, HTTPException
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..blockchain.mint_burn import burn_token, mint_token
from ..blockchain.permissions import producer_consumers
from ..dependencies import (
    get_async_session,
    get_current_active_user,
    get_current_producer,
    get_user_manager,
)
from ..managers import UserManager
from ..models.producers import Producer
from ..models.users import User
from ..ops import producers as ops
from ..schemas.histories import HistoryCreate, HistoryRead
from ..schemas.producers import (
    ProducerCreate,
    ProducerRead,
    ProducerUpdate,
    GENDERS,
    ETHNICITIES,
    MARITAL_STATUSES,
    PARENTAL_STATUSES,
)

router = APIRouter()


@router.post("/me", status_code=status.HTTP_201_CREATED, response_model=ProducerRead)
async def create_producer(
    producer: ProducerCreate,
    request: Request,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    if not user.eth_address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not have a wallet",
        )

    if producer.gender and producer.gender not in GENDERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid gender provided",
        )
    if producer.ethnicity and producer.ethnicity not in ETHNICITIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ethnicity provided",
        )
    if producer.date_of_birth > datetime.now().date():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date of birth provided",
        )
    if producer.marital_status and producer.marital_status not in MARITAL_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid marital status provided",
        )
    if producer.parental_status and producer.parental_status not in PARENTAL_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid parental status provided",
        )

    try:
        # Mint token for the producer
        mint_token(
            request.app.state.eth_client,
            user.eth_address,
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mint the token",
        )

    await ops.create_producer(db, producer, user)
    return await ops.get_producer(db, user)


@router.get("/me", status_code=status.HTTP_200_OK, response_model=ProducerRead)
async def read_producer(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    return await ops.get_producer(db, user)


@router.patch("/me", status_code=status.HTTP_200_OK, response_model=ProducerRead)
async def update_producer(
    producer: ProducerUpdate,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    await ops.update_producer(db, producer, user)
    return await ops.get_producer(db, user)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_producer(
    request: Request,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    if user.eth_address:
        try:
            # Burn the producer's token
            burn_token(request.app.state.eth_client, user.eth_address)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to burn the token",
            )

    await ops.delete_producer(db, user)
    await user_manager.delete(user)


@router.post(
    "/me/histories",
    status_code=status.HTTP_201_CREATED,
    response_model=List[HistoryRead],
)
async def create_histories(
    histories: list[HistoryCreate],
    db: AsyncSession = Depends(get_async_session),
    producer: Producer = Depends(get_current_producer),
):
    await ops.create_histories(db, histories, producer)
    return await ops.get_histories(db, producer)


@router.get(
    "/me/histories", status_code=status.HTTP_200_OK, response_model=List[HistoryRead]
)
async def read_histories(
    db: AsyncSession = Depends(get_async_session),
    producer: Producer = Depends(get_current_producer),
):
    return await ops.get_histories(db, producer)


@router.get(
    "/me/subscriptions", status_code=status.HTTP_200_OK, response_model=list[str]
)
async def read_subscriptions(
    request: Request,
    user: User = Depends(get_current_active_user),
):
    subscriptions = producer_consumers(request.app.state.eth_client, user.eth_address)
    return subscriptions
