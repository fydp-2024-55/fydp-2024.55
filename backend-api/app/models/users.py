from fastapi_users.db import SQLAlchemyBaseUserTableUUID

from ..database import Base
import sqlalchemy as sa


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "Users"

    id = sa.Column(sa.Integer, primary_key=True, index=True)
    email = sa.Column(sa.String, unique=True, index=True)
    hashed_password = sa.Column(sa.String)
    is_active = sa.Column(sa.Boolean, default=True)