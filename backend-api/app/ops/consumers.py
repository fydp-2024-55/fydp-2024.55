import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession

from datetime import date, timedelta
from ..models.producers import Producer
from ..models.consumers import Consumer
from ..models.users import User
from ..schemas.consumers import (
    ConsumerCreate,
    ConsumerRead,
    ConsumerUpdate,
    ProducersQuery,
    ProducersQueryResults,
)


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


# async def query_producers(db: AsyncSession, query: ProducersQuery):
# statement = sa.select(Producer).where()
# earliest_date = date() - timedelta(days = 365 * query.max_age)
# latest_date = date.today() - timedelta(days = 365 * query.min_age)
# statement = statement.where(Producer.date_of_birth >= date query.min_age) if query.min_age else statement
# statement = statement.where(Producer.date_of_birth <= query.max_age) if query.max_age else statement
# statement = statement.where(Producer.gender.in_.ethnicities) if query.ethnicities else statement
