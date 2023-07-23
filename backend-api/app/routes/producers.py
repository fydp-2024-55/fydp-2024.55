import random

from fastapi import APIRouter, status, Request

from ..schemas.producers import ProducerCreate, ProducerRead, ProducerUpdate
from ..blockchain.mint_burn import mint_token, burn_token

router = APIRouter()

producer_dict = {
    "id": 100,
    "eth_address": "0x1234567890123456789012345678901234567890",
    "email": "dre@gmail.com",
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
async def create_producer(producer: ProducerCreate, request: Request):
    # Mint token for the producer
    mint_token(
        request.app.state.token_contract, request.app.state.minter, producer.eth_address
    )

    # Create database instance, retrieve ID

    return ProducerRead(**producer_dict)


@router.get("/{eth_address}}", status_code=status.HTTP_200_OK)
async def read_producer(eth_address: str):
    # Query database instance

    return ProducerRead(**producer_dict)


@router.patch("/{eth_address}}", status_code=status.HTTP_204_NO_CONTENT)
async def update_producer(eth_address: str, producer: ProducerUpdate):
    # Update database instance

    return None


@router.delete("/{eth_address}}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_producer(eth_address: str, request: Request):
    # Burn the producer's token
    burn_token(request.app.state.token_contract, eth_address)

    # Delete database instance

    return None
