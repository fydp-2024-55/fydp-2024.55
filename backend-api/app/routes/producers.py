from fastapi import APIRouter, status, Request
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.users import User
from ..dependencies import get_current_active_user, get_async_session
from ..schemas.producers import (
    ProducerCreate,
    ProducerUpdate,
    ProducerSubscriptionsRead,
    ProducerWalletBalanceRead,
)
from ..blockchain.mint_burn import mint_token, burn_token
from ..blockchain.permissions import producer_subscriptions
from ..blockchain.wallet import get_balance
from fastapi.params import Depends

from ..ops import producers as ops

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_producer(
    body: ProducerCreate,
    request: Request,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    # Mint token for the producer
    mint_token(
        request.app.state.token_contract, request.app.state.minter, user.eth_address
    )

    await ops.create_producer(db, body, user)
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

    # Delete database instance

    await ops.delete_producer(db, user)


@router.get("/me/subscriptions", status_code=status.HTTP_200_OK)
async def read_producer_subscriptions(
    request: Request,
    producer: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    subscriptions = await producer_subscriptions(
        request.app.state.token_contract, producer.eth_address, session
    )

    return ProducerSubscriptionsRead(subscriptions=subscriptions)


@router.get("/me/wallet", status_code=status.HTTP_200_OK)
async def read_wallet_balance(
    user: User = Depends(get_current_active_user),
):
    balance = get_balance(user.eth_address)

    return ProducerWalletBalanceRead(balance=balance)
