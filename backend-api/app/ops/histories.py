import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.producers import Producer

from ..models.histories import History
from ..schemas.histories import HistoryCreate, HistoryRead
from ..models.producers import Producer

async def get_histories(db: AsyncSession, producer: Producer):
    statement = sa.select(History).where(History.producer_id == producer.id)
    result = await db.execute(statement)
    histories = result.scalars().all()
    return[HistoryRead(**history.__dict__) 
           for history in histories]

async def create_histories(db: AsyncSession, histories: list[HistoryCreate], producer: Producer):
    for history in histories:
        statement = sa.insert(History).values(
            producer_id = producer.id,
            url = history.url,
            title = history.title,
            time_spent = history.time_spent,
            visit_time = history.visit_time,
        )
        await db.execute(statement)
    await db.commit()