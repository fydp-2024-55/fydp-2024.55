import sqlalchemy as sa

from ..database import Base
from fastapi_users_db_sqlalchemy.generics import GUID


class Consumer(Base):
    __tablename__ = "Consumers"

    id = sa.Column(sa.Integer, primary_key=True, index=True, nullable=False)
    user_id = sa.Column(
        GUID, sa.ForeignKey("Users.id"), index=True, unique=True, nullable=False
    )
