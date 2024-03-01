from datetime import datetime
from typing import List, Dict
from fastapi import APIRouter, Request, Body, status, HTTPException, Query
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..blockchain.mint_burn import burn_token, mint_token
from ..dependencies import (
    get_async_session,
    get_current_active_user,
    get_user_manager,
)
from ..managers import UserManager
from ..models.users import User
from ..ops import producers as ops
from ..schemas.producers import (
    ProducerCreate,
    ProducerRead,
    ProducerUpdate,
    ProducerFilter,
    GENDERS,
    ETHNICITIES,
    MARITAL_STATUSES,
    PARENTAL_STATUSES,
    VisitedSite,
)

router = APIRouter()


@router.get(
    "/",
    status_code=status.HTTP_200_OK,
    response_model=list[ProducerRead],
)
async def read_producers_available(
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
    return await ops.get_producers_by_filter(db, filter)


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
    return await read_producer(db, user)


@router.get("/me", status_code=status.HTTP_200_OK, response_model=ProducerRead)
async def read_producer(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    producer = await ops.get_producer(db, user)
    return ProducerRead(**producer.__dict__)


@router.patch("/me", status_code=status.HTTP_200_OK, response_model=ProducerRead)
async def update_producer(
    producer: ProducerUpdate,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    await ops.update_producer(db, producer, user)
    return await read_producer(db, user)


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
    "/me/interests",
    status_code=status.HTTP_201_CREATED,
    response_model=List[VisitedSite],
)
async def upload_interests(
    visited_sites: List[VisitedSite],
):
    # TODO: Implement interest categorization logic
    return visited_sites


@router.get(
    "/me/permissions",
    status_code=status.HTTP_200_OK,
    response_model=Dict[str, bool],
)
async def read_permissions(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    permissions = await ops.get_permissions(db, user)
    return {category.title.lower(): enabled for category, enabled in permissions}


@router.patch(
    "/me/permissions",
    status_code=status.HTTP_200_OK,
    response_model=Dict[str, bool],
)
async def update_permissions(
    permissions: Dict[str, bool] = Body(),
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    await ops.update_permissions(db, user, permissions)
    return await read_permissions(db, user)
