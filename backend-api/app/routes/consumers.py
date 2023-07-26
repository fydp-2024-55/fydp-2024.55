from fastapi import APIRouter, status
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..dependencies import get_async_session, get_current_active_user
from ..models.users import User
from ..ops import consumers as ops
from ..schemas.consumers import ConsumerCreate, ConsumerRead, ConsumerUpdate

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_consumer(
    consumer: ConsumerCreate,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    return await ops.create_consumer(db, consumer, user)


@router.get("/me", status_code=status.HTTP_200_OK)
async def read_consumer(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    return await ops.get_consumer(db, user)


@router.patch("/me", status_code=status.HTTP_200_OK)
async def update_consumer(
    consumer: ConsumerUpdate,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    return await ops.update_consumer(db, consumer, user)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_consumer(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    # Delete database instance
    await ops.delete_consumer(db, user)
