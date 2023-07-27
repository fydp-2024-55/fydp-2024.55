import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.consumers import Consumer
from ..models.users import User
from ..schemas.consumers import ConsumerCreate, ConsumerRead, ConsumerUpdate


async def get_consumer(db: AsyncSession, user: User):
    statement = sa.select(Consumer).where(Consumer.user_id == user.id)
    result = await db.execute(statement)
    consumer = result.scalar_one_or_none()
    if consumer is None:
        return None
    return ConsumerRead(**consumer.__dict__, eth_address=user.eth_address)


async def create_consumer(db: AsyncSession, consumer: ConsumerCreate, user: User):
    if consumer.eth_address:
        statement = (
            sa.update(User)
            .values(eth_address=consumer.eth_address)
            .where(User.id == user.id)
        )
        await db.execute(statement)

    statement = sa.insert(Consumer).values(
        user_id=user.id,
        name=consumer.name,
    )
    await db.execute(statement)
    await db.commit()


async def update_consumer(db: AsyncSession, consumer: ConsumerUpdate, user: User):
    if consumer.eth_address:
        statement = (
            sa.update(User)
            .values(eth_address=consumer.eth_address)
            .where(User.id == user.id)
        )
        await db.execute(statement)

    statement = (
        sa.update(Consumer)
        .values(
            name=consumer.name,
        )
        .where(Consumer.user_id == user.id)
    )
    await db.execute(statement)
    await db.commit()


async def delete_consumer(db: AsyncSession, user: User):
    statement = sa.delete(Consumer).where(Consumer.user_id == user.id)
    await db.execute(statement)
    await db.commit()
