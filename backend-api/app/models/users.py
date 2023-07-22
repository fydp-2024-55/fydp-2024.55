from fastapi_users.db import SQLAlchemyBaseUserTableUUID

from ..database import Base
import sqlalchemy as sa


class User(SQLAlchemyBaseUserTableUUID, Base):
    pass