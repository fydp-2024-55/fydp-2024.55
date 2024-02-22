import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.locations import Location
from ..schemas.locations import LocationCreate


async def create_location(db: AsyncSession, location: LocationCreate):
    statement = (
        sa.insert(Location)
        .values(city=location.city, state=location.state, country=location.country)
        .returning(Location.id)
    )
    result = await db.execute(statement)
    location_id = result.scalars().first()
    await db.commit()
    return location_id


async def location_exists(db: AsyncSession, location: LocationCreate):
    statement = sa.select(Location).where(
        sa.and_(
            Location.city == location.city,
            Location.state == location.state,
            Location.country == location.country,
        )
    )
    result = await db.execute(statement)
    location = result.scalar_one_or_none()
    return location is not None


async def get_countries(db: AsyncSession):
    statement = sa.select(Location.country).distinct()
    countries = await db.execute(statement)
    return countries.scalars().all()
