import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.histories import History
from ..models.producers import Producer
from ..models.users import User
from ..schemas.histories import HistoryCreate, HistoryRead
from ..schemas.producers import ProducerCreate, ProducerRead, ProducerUpdate


async def get_producer(db: AsyncSession, user: User):
    statement = sa.select(Producer).where(Producer.user_id == user.id)
    result = await db.execute(statement)
    producer = result.scalar_one_or_none()
    if producer is None:
        return None
    return ProducerRead(**producer.__dict__, eth_address=user.eth_address)


async def create_producer(db: AsyncSession, producer: ProducerCreate, user: User):
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


async def get_histories(db: AsyncSession, producer: Producer):
    statement = sa.select(History).where(History.producer_id == producer.id)
    result = await db.execute(statement)
    histories = result.scalars().all()
    return [HistoryRead(**history.__dict__) for history in histories]


async def create_histories(
    db: AsyncSession, histories: list[HistoryCreate], producer: Producer
):
    for history in histories:
        statement = sa.insert(History).values(
            producer_id=producer.id,
            url=history.url,
            title=history.title,
            time_spent=history.time_spent,
            visit_time=history.visit_time,
        )
        await db.execute(statement)
    await db.commit()
