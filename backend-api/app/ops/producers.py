import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.producers import Producer
from ..schemas.producers import ProducerCreate, ProducerUpdate, ProducerRead
from ..models.users import User


async def get_producer(db: AsyncSession, user: User):
    statement = sa.select(Producer).where(Producer.user_id == user.id)
    result = await db.execute(statement)
    producer = result.scalar_one_or_none()
    if producer is None:
        return None
    return ProducerRead(**producer.__dict__)


async def create_producer(db: AsyncSession, producer: ProducerCreate, user: User):
    statement = sa.insert(Producer).values(**producer.model_dump(), user_id=user.id)
    await db.execute(statement)
    await db.commit()


async def update_producer(db: AsyncSession, producer: ProducerUpdate, user: User):
    statement = (
        sa.update(Producer)
        .values(**producer.model_dump())
        .where(Producer.user_id == user.id)
    )
    await db.execute(statement)
    await db.commit()

async def delete_producer(db: AsyncSession, user: User):
    statement = sa.delete(Producer).where(Producer.user_id == user.id)
    await db.execute(statement)
    await db.commit()