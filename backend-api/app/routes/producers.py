from fastapi import APIRouter, status, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.users import User
from ..dependencies import get_current_active_user, get_async_session
from ..schemas.producers import (
    ProducerCreate,
    ProducerRead,
    ProducerUpdate,
    ProducerSubscriptionsRead,
    ProducerWalletBalanceRead,
)
from ..blockchain.mint_burn import mint_token, burn_token
from ..blockchain.permissions import producer_subscriptions
from ..blockchain.wallet import get_balance

router = APIRouter()

producer_dict = {
    "id": 100,
    "eth_address": "0x1234567890123456789012345678901234567890",
    "name": "Dre",
    "gender": "M",
    "ethnicity": "B",
    "date_of_birth": "2023-07-20",
    "city": "Santa Clara",
    "state": "CA",
    "country": "US",
    "income": 450000,
    "marital_status": "not single anymore",
    "parental_status": "parents and step parents",
}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_producer(
    body: ProducerCreate,
    request: Request,
    producer: User = Depends(get_current_active_user),
):
    # Mint token for the producer
    mint_token(
        request.app.state.token_contract, request.app.state.minter, producer.eth_address
    )

    # Create database instance, retrieve ID

    return ProducerRead(**producer_dict)


@router.get("/me", status_code=status.HTTP_200_OK)
async def read_producer():
    # Query database instance

    return ProducerRead(**producer_dict)


@router.patch("/me", status_code=status.HTTP_200_OK)
async def update_producer(body: ProducerUpdate):
    # Update database instance

    return ProducerRead(**producer_dict)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_producer(request: Request):
    # Retrieve eth_address associated with the producer
    eth_address = "0x1234567890123456789012345678901234567890"

    # Burn the producer's token
    burn_token(request.app.state.token_contract, eth_address)

    # Delete database instance

    return


@router.get("/me/subscriptions", status_code=status.HTTP_200_OK)
async def read_producer_subscriptions(
    request: Request,
    producer: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    subscriptions = producer_subscriptions(
        request.app.state.token_contract, producer.eth_address, session
    )

    return ProducerSubscriptionsRead(subscriptions=subscriptions)


@router.get("/me/wallet", status_code=status.HTTP_200_OK)
async def read_wallet_balance(
    user: User = Depends(get_current_active_user),
):
    balance = get_balance(user.eth_address)

    return ProducerWalletBalanceRead(balance=balance)
