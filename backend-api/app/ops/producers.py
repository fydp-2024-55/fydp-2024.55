from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.producers import Producer
from ..schemas.producers import ProducerCreate, ProducerUpdate
from ..models.users import User


async def get_producer(db: AsyncSession, producer_id: int):
    return await db.get(Producer, producer_id)


async def create_producer(db: AsyncSession, producer: ProducerCreate, user: User):
    db_producer = Producer(**producer.model_dump(), user_id=user.id)
    db.add(db_producer)
    await db.commit()
    await db.refresh(db_producer)
    return db_producer


async def update_producer(db: AsyncSession, producer_id: int, producer: ProducerUpdate):
    db_producer = await db.get(Producer, producer_id)
    statement = update(Producer).where(Producer.id == producer.id).values(**producer.model_dump())
    await db.execute(statement)
    await db.commit()
    await db.refresh(db_producer)
    return db_producer


async def delete_producer(db: AsyncSession, producer_id: int):
    statement = select(Producer).where(Producer.id == producer_id)
    db_producer = await db.execute(statement)
    db.delete(db_producer)
    await db.commit()
    return db_producer