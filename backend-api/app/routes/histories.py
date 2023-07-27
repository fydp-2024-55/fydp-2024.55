from fastapi import APIRouter, status
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..ops import histories as ops
from ..ops.producers import get_producer

from ..dependencies import (
    get_async_session,
    get_current_producer,
    get_current_active_user,
)
from ..schemas.histories import HistoryCreate, HistoryRead
from ..models.producers import Producer
from ..models.users import User

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_histories(
    histories: list[HistoryCreate],
    db: AsyncSession = Depends(get_async_session),
    producer: Producer = Depends(get_current_producer),
):
    await ops.create_histories(db, histories, producer)
    return await ops.get_histories(db, producer)


@router.get("/")
async def read_histories(
    db: AsyncSession = Depends(get_async_session),
    producer: Producer = Depends(get_current_producer),
):
    return await ops.get_histories(db, producer)
