from datetime import date
from enum import Enum
from pydantic import BaseModel
from uuid import UUID


class LocationBase(BaseModel):
    city: str
    state: str
    country: str


class LocationCreate(LocationBase):
    pass


class LocationRead(LocationBase):
    id: int
