import random

from fastapi import APIRouter, status

from ..schemas.consumers import ConsumerCreate, ConsumerRead, ConsumerUpdate

router = APIRouter()

consumer_dict = {"ethereum_address": "somewhareOnTheBlockchain"}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_consumer(consumer: ConsumerCreate):
    return ConsumerRead(id=random.randint(1, 1000), **consumer_dict)


@router.get("/me")
async def read_consumer():
    return ConsumerRead(id=random.randint(1, 1000), **consumer_dict)


@router.patch("/me")
async def update_consumer(consumer: ConsumerUpdate):
    return ConsumerRead(id=random.randint(1, 1000), **consumer_dict)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_consumer():
    return
