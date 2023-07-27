import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.producers import Producer
from ..models.users import User
from ..schemas.producers import ProducerCreate, ProducerRead, ProducerUpdate


async def get_producer(db: AsyncSession, user: User):
    statement = sa.select(Producer).where(Producer.user_id == user.id)
    result = await db.execute(statement)
    producer = result.scalar_one_or_none()
    if producer is None:
        return None
    return ProducerRead(**producer.__dict__, eth_address=user.eth_address)


async def create_producer(db: AsyncSession, producer: ProducerCreate, user: User):
    if producer.eth_address:
        statement = (
            sa.update(User)
            .values(eth_address=producer.eth_address)
            .where(User.id == user.id)
        )
        await db.execute(statement)

    statement = sa.insert(Producer).values(
        user_id=user.id,
        name=producer.name,
        country=producer.country,
        date_of_birth=producer.date_of_birth,
        gender=producer.gender,
        ethnicity=producer.ethnicity,
        income=producer.income,
        marital_status=producer.marital_status,
        parental_status=producer.parental_status,
    )
    await db.execute(statement)
    await db.commit()


async def update_producer(db: AsyncSession, producer: ProducerUpdate, user: User):
    if producer.eth_address:
        statement = (
            sa.update(User)
            .values(eth_address=producer.eth_address)
            .where(User.id == user.id)
        )
    await db.execute(statement)

    statement = (
        sa.update(Producer)
        .values(
            name=producer.name,
            country=producer.country,
            date_of_birth=producer.date_of_birth,
            gender=producer.gender,
            ethnicity=producer.ethnicity,
            income=producer.income,
            marital_status=producer.marital_status,
            parental_status=producer.parental_status,
        )
        .where(Producer.user_id == user.id)
    )
    await db.execute(statement)
    await db.commit()


async def delete_producer(db: AsyncSession, user: User):
    statement = sa.delete(Producer).where(Producer.user_id == user.id)
    await db.execute(statement)
    await db.commit()
