from fastapi_users.db import SQLAlchemyBaseUserTableUUID

from ..database import Base
import sqlalchemy as sa


class Producer(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "Producers"
    id = sa.Column(sa.Integer, primary_key=True, index=True, nullable=False)
    eth_address = sa.Column(sa.String, unique=True,index=True,nullable=False)
    name = sa.Column(sa.String, nullable=False)
    email = sa.Column(sa.String, nullable=False)
    date_of_birth = sa.Column(sa.Date, nullable=False)
    gender = sa.Column(sa.CHAR, nullable=False)
    ethnicity = sa.Column(sa.CHAR, nullable=False)
    income = sa.Column(sa.Integer, nullable=False)
    marital_status = sa.Column(sa.CHAR, nullable=False)
    parental_status = sa.Column(sa.CHAR, nullable=False)
    