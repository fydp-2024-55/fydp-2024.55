import sqlalchemy as sa
from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from fastapi_users_db_sqlalchemy.generics import GUID
from sqlalchemy.orm import relationship

from ..database import Base


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "Users"

    eth_address = sa.Column(sa.String, nullable=False)

    producer = relationship(
        "Producer",
        back_populates="user",
    )
    consumer = relationship(
        "Consumer",
        back_populates="user",
    )
