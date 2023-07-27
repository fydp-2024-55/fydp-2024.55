import sqlalchemy as sa
from sqlalchemy.orm import relationship

from ..database import Base
from .locations import Location
from .users import GUID, User


class Producer(Base):
    __tablename__ = "Producers"

    id = sa.Column(sa.Integer, primary_key=True, index=True, nullable=False)
    user_id = sa.Column(GUID, sa.ForeignKey("Users.id"), index=True, nullable=False)
    name = sa.Column(sa.String, nullable=False)
    country = sa.Column(sa.String)
    date_of_birth = sa.Column(sa.Date)
    gender = sa.Column(sa.CHAR)
    ethnicity = sa.Column(sa.CHAR)
    income = sa.Column(sa.Integer)
    marital_status = sa.Column(sa.CHAR)
    parental_status = sa.Column(sa.CHAR)

    user = relationship(User, back_populates="producer")
    histories = relationship("History", back_populates="producer")
    restricted_categories = relationship(
        "Category",
        "Producer_Restricted_Categories",
        back_populates="restricting_producers",
    )
