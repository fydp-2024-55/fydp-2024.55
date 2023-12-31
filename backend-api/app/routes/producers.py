from fastapi import APIRouter, Request, status
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..blockchain.mint_burn import burn_token, mint_token
from ..dependencies import (get_async_session, get_current_active_user,
                            get_current_producer)
from ..models.producers import Producer
from ..models.users import User
from ..ops import producers as ops
from ..schemas.histories import HistoryCreate
from ..schemas.producers import ProducerCreate, ProducerUpdate

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_producer(
    producer: ProducerCreate,
    request: Request,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    if producer.eth_address:
        mint_token(
            request.app.state.token_contract,
            request.app.state.minter,
            producer.eth_address,
        )

    elif user.eth_address:
        mint_token(
            request.app.state.token_contract,
            request.app.state.minter,
            user.eth_address,
        )

    await ops.create_producer(db, producer, user)
    return await ops.get_producer(db, user)


@router.get("/me", status_code=status.HTTP_200_OK)
async def read_producer(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    return await ops.get_producer(db, user)


@router.patch("/me", status_code=status.HTTP_200_OK)
async def update_producer(
    producer: ProducerUpdate,
    request: Request,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    if producer.eth_address:
        if user.eth_address:
            burn_token(request.app.state.token_contract, user.eth_address)

        mint_token(
            request.app.state.token_contract,
            request.app.state.minter,
            producer.eth_address,
        )

    await ops.update_producer(db, producer, user)
    return await ops.get_producer(db, user)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_producer(
    request: Request,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    if user.eth_address:
        burn_token(request.app.state.token_contract, user.eth_address)

    await ops.delete_producer(db, user)


@router.post("/me/histories", status_code=status.HTTP_201_CREATED)
async def create_histories(
    histories: list[HistoryCreate],
    db: AsyncSession = Depends(get_async_session),
    producer: Producer = Depends(get_current_producer),
):
    await ops.create_histories(db, histories, producer)
    return await ops.get_histories(db, producer)


@router.get("/me/histories", status_code=status.HTTP_200_OK)
async def read_histories(
    db: AsyncSession = Depends(get_async_session),
    producer: Producer = Depends(get_current_producer),
):
    return await ops.get_histories(db, producer)
