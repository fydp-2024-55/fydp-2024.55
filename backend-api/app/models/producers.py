import sqlalchemy as sa
from sqlalchemy.orm import relationship

from ..database import Base
from .users import GUID, User


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

    user = relationship(User, back_populates="producer")
    histories = relationship("History", back_populates="producer")
    restricted_categories = relationship(
        "Category",
        "Producer_Restricted_Categories",
        back_populates="restricting_producers",
    )
