import random

from fastapi import APIRouter, status

from ..schemas.histories import HistoryCreate, HistoryRead

router = APIRouter()

history_dict = {
    "url": "https://facebook.com",
    "title": "Facebook",
    "visit_time": "2023-07-20T07:01:56.876Z",
    "time_spent": 100,
}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_histories(histories: list[HistoryCreate]):
    return [
        HistoryRead(id=random.randint(1, 1000), **history.model_dump())
        for history in histories
    ]


@router.get("/")
async def read_histories():
    return [HistoryRead(id=random.randint(1, 1000), **history_dict) for _ in range(5)]
