import sqlalchemy as sa
from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy.orm import relationship

from ..database import Base


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "Users"

    eth_address = sa.Column(sa.String, nullable=False)
