from fastapi import APIRouter, status, HTTPException
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..dependencies import get_async_session
from ..ops import locations as ops
from ..schemas.locations import LocationCreate, LocationRead

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=LocationRead)
async def create_location(
    location: LocationCreate,
    db: AsyncSession = Depends(get_async_session),
):
    if ops.location_exists(db, location):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Location already exists",
        )

    return await ops.create_location(db, location)


@router.get("/", status_code=status.HTTP_200_OK, response_model=list[str])
async def read_countries(
    db: AsyncSession = Depends(get_async_session),
):
    return await ops.get_countries(db)
