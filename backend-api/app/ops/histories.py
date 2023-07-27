from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.producers import Producer

from ..models.histories import History
from ..schemas.histories import HistoryCreate, HistoryRead

async def get_history(db: AsyncSession, history: HistoryRead):
    return await db.get(History, history.id)

async def list_history(db: AsyncSession, producer: Producer):
    historyList = select(History).where(History.producer_id == producer.id)

async def create_history(db: AsyncSession, history: HistoryCreate, producer: Producer):
    db_history = History(**history.model_dump(), producer_id = producer.id)
    db.add(db_history)
    await db.commit()
    await db.refresh(db_history)
    return db_history
