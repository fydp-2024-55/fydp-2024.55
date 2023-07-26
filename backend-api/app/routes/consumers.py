import random

from fastapi import APIRouter, status

from ..schemas.consumers import (
    ConsumerCreate,
    ConsumerRead,
    ConsumerUpdate,
)

router = APIRouter()

consumer_dict = {"eth_address": "somewhareOnTheBlockchain"}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_consumer(consumer: ConsumerCreate):
    # Create database instance, retrieve ID

    return ConsumerRead(id=random.randint(1, 1000), **consumer_dict)


@router.get("/me", status_code=status.HTTP_200_OK)
async def read_consumer():
    # Query database instance

    return ConsumerRead(id=random.randint(1, 1000), **consumer_dict)


@router.patch("/me", status_code=status.HTTP_200_OK)
async def update_consumer(consumer: ConsumerUpdate):
    # Update database instance

    return ConsumerRead(id=random.randint(1, 1000), **consumer_dict)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_consumer():
    # Delete database instance

    return
