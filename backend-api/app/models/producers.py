import sqlalchemy as sa

from ..database import Base
from fastapi_users_db_sqlalchemy.generics import GUID


class Producer(Base):
    __tablename__ = "Producers"

    id = sa.Column(sa.Integer, primary_key=True, index=True, nullable=False)
    user_id = sa.Column(
        GUID, sa.ForeignKey("Users.id"), index=True, unique=True, nullable=False
    )
    country = sa.Column(sa.String, nullable=True)
    date_of_birth = sa.Column(sa.Date, nullable=True)
    gender = sa.Column(sa.CHAR, nullable=True)
    ethnicity = sa.Column(sa.CHAR, nullable=True)
    income = sa.Column(sa.Integer, nullable=True)
    marital_status = sa.Column(sa.CHAR, nullable=True)
    parental_status = sa.Column(sa.CHAR, nullable=True)
