from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.consumers import Consumer
from ..schemas.consumers import ConsumerCreate, ConsumerUpdate
from ..models.users import User


async def get_consumer(db: AsyncSession, consumer_id: int):
    return await db.get(Consumer, consumer_id)


async def create_consumer(db: AsyncSession, consumer: ConsumerCreate, user: User):
    db_consumer = Consumer(**consumer.model_dump(), user_id=user.id)
    db.add(db_consumer)
    await db.commit()
    await db.refresh(db_consumer)
    return db_consumer


async def update_consumer(db: AsyncSession, consumer_id: int, consumer: ConsumerUpdate):
    db_consumer = await db.get(Consumer, consumer_id)
    statement = update(Consumer).where(Consumer.id == consumer.id).values(**consumer.model_dump())
    await db.execute(statement)
    await db.commit()
    await db.refresh(db_consumer)
    return db_consumer


async def delete_consumer(db: AsyncSession, consumer_id: int):
    statement = select(Consumer).where(Consumer.id == consumer_id)
    db_consumer = await db.execute(statement)
    db.delete(db_consumer)
    await db.commit()
    return db_consumer