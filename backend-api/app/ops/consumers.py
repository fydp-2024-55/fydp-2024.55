import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.consumers import Consumer
from ..models.users import User


async def get_consumer(db: AsyncSession, user: User):
    statement = sa.select(Consumer).where(Consumer.user_id == user.id)
    result = await db.execute(statement)
    return result.scalar()


async def create_consumer(db: AsyncSession, user: User):
    statement = sa.insert(Consumer).values(user_id=user.id)
    await db.execute(statement)
    await db.commit()


async def delete_consumer(db: AsyncSession, user: User):
    statement = sa.delete(Consumer).where(Consumer.user_id == user.id)
    await db.execute(statement)
    await db.commit()
