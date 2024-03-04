from typing import Dict, List
from fastapi import APIRouter, Body, Request, status, HTTPException, Query
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
    FilterOptions,
    ProducerSearchResults,
    VisitedSite,
    GENDERS,
    ETHNICITIES,
    MARITAL_STATUSES,
    PARENTAL_STATUSES,
)
from ..utils.producers import validate_producer_dto

router = APIRouter()


@router.get(
    "/",
    status_code=status.HTTP_200_OK,
    response_model=ProducerSearchResults,
)
async def read_producer_search_results(
    genders: list[str] = Query(None),
    ethnicities: list[str] = Query(None),
    countries: list[str] = Query(None),
    marital_statuses: list[str] = Query(None),
    parental_statuses: list[str] = Query(None),
    min_age: int | None = None,
    max_age: int | None = None,
    min_income: int | None = None,
    max_income: int | None = None,
    db: AsyncSession = Depends(get_async_session),
):
    # Validate the filter options
    if genders:
        for gender in genders:
            if gender not in GENDERS:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid gender provided",
                )
    if ethnicities:
        for ethnicity in ethnicities:
            if ethnicity not in ETHNICITIES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid ethnicity provided",
                )
    if marital_statuses:
        for marital_status in marital_statuses:
            if marital_status not in MARITAL_STATUSES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid marital status provided",
                )
    if parental_statuses:
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

    counts = await ops.get_producers_by_filter(db, filter)
    return ProducerSearchResults(**counts)


@router.get(
    "/filter-options",
    status_code=status.HTTP_200_OK,
    response_model=FilterOptions,
)
async def get_producer_filter_options(
    db: AsyncSession = Depends(get_async_session),
):
    countries = await ops.get_producer_countries(db)
    return FilterOptions(
        genders=GENDERS,
        ethnicities=ETHNICITIES,
        marital_statuses=MARITAL_STATUSES,
        parental_statuses=PARENTAL_STATUSES,
        countries=countries,
    )


@router.get(
    "/eth-address/{eth_address}",
    status_code=status.HTTP_200_OK,
    response_model=ProducerRead,
)
async def read_producer_by_eth_address(
    eth_address: str,
    db: AsyncSession = Depends(get_async_session),
):
    producer = await ops.get_producer_by_eth_address(db, eth_address)
    if not producer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producer not found",
        )

    return ProducerRead(**producer.__dict__)


@router.post("/me", status_code=status.HTTP_201_CREATED, response_model=ProducerRead)
async def create_producer(
    producer: ProducerCreate,
    request: Request,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    if await ops.get_producer(db, user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a producer",
        )

    if not user.eth_address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not have a wallet",
        )

    validate_producer_dto(producer)

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
    validate_producer_dto(producer)

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


@router.get(
    "/me/interests",
    status_code=status.HTTP_200_OK,
    response_model=Dict[str, int],
)
async def read_interests(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    producer = await ops.get_producer(db, user)
    interests = await ops.get_interests(db, producer)
    return {str(category.title).lower(): duration for category, duration in interests}


@router.post(
    "/me/interests",
    status_code=status.HTTP_201_CREATED,
    response_model=Dict[str, int],
)
async def upload_interests(
    visited_sites: List[VisitedSite],
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    producer = await ops.get_producer(db, user)
    await ops.process_visited_sites(db, producer, visited_sites)
    return await read_interests(db, user)


@router.get(
    "/me/permissions",
    status_code=status.HTTP_200_OK,
    response_model=Dict[str, bool],
)
async def read_permissions(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    producer = await ops.get_producer(db, user)
    permissions = await ops.get_permissions(db, producer)
    return {str(category.title).lower(): enabled for category, enabled in permissions}


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
    producer = await ops.get_producer(db, user)
    await ops.update_permissions(db, producer, permissions)
    return await read_permissions(db, user)
