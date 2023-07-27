from fastapi import APIRouter, Request, status
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..blockchain.mint_burn import burn_token, mint_token
from ..dependencies import get_async_session, get_current_active_user
from ..models.users import User
from ..ops import producers as ops
from ..schemas.producers import ProducerCreate, ProducerRead, ProducerUpdate

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_producer(
    producer: ProducerCreate,
    # request: Request,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    # mint_token(
    #    request.app.state.token_contract, request.app.state.minter, user.eth_address
    # )

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
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    await ops.update_producer(db, producer, user)
    return await ops.get_producer(db, user)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_producer(
    # request: Request,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    # eth_address = user.eth_address

    # burn_token(request.app.state.token_contract, eth_address)

    await ops.delete_producer(db, user)
