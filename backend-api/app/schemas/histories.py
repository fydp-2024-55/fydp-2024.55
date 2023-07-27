from datetime import datetime

from pydantic import BaseModel


class HistoryBase(BaseModel):
    url: str
    title: str
    visit_time: datetime
    time_spent: int  # number of seconds


class HistoryRead(HistoryBase):
    id: int
    producer_id: int


class HistoryCreate(HistoryBase):
    pass
