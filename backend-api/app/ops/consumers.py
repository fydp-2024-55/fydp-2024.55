from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.consumers import Consumer
from ..models.users import User
from ..schemas.consumers import ConsumerCreate, ConsumerUpdate


async def get_consumer(db: AsyncSession, user: User):
    statement = select(Consumer).where(Consumer.user_id == user.id).limit(1)
    result = await db.execute(statement)
    return result.scalar_one()


async def create_consumer(db: AsyncSession, consumer: ConsumerCreate, user: User):
    db_consumer = Consumer(**consumer.model_dump(), user_id=user.id)
    db.add(db_consumer)
    await db.commit()
    await db.refresh(db_consumer)
    return db_consumer


async def update_consumer(db: AsyncSession, consumer: ConsumerUpdate, user: User):
    db_consumer = await get_consumer(db, user)
    statement = (
        update(Consumer)
        .values(**consumer.model_dump())
        .where(Consumer.user_id == user.id)
    )
    await db.execute(statement)
    await db.commit()
    await db.refresh(db_consumer)
    return db_consumer


async def delete_consumer(db: AsyncSession, user: User):
    db_consumer = await get_consumer(db, user)
    await db.delete(db_consumer)
    await db.commit()
    await db.refresh(db_consumer)
