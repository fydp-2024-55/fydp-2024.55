import random

from fastapi import APIRouter, status

from ..schemas.producers import ProducerCreate, ProducerRead, ProducerUpdate

router = APIRouter()

producer_dict = {
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
async def create_producer(producer: ProducerCreate):
    return ProducerRead(id=random.randint(1, 1000), **producer_dict)


@router.get("/me")
async def read_producer():
    return ProducerRead(id=1000, **producer_dict)


@router.patch("/me")
async def update_producer(producer: ProducerUpdate):
    return ProducerRead(id=random.randint(1, 1000), **producer_dict)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_producer():
    return
