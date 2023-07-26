import sqlalchemy as sa
from sqlalchemy.orm import relationship

from ..database import Base
from .locations import Location
from .users import User


class Producer(Base):
    __tablename__ = "Producers"

    id = sa.Column(sa.Integer, primary_key=True, index=True, nullable=False)
    user_id = sa.Column(
        sa.Integer, sa.ForeignKey("Users.id"), index=True, nullable=False
    )
    name = sa.Column(sa.String, nullable=False)
    location_id = sa.Column(sa.Integer, sa.ForeignKey("Locations.id"), nullable=False)
    date_of_birth = sa.Column(sa.Date, nullable=False)
    gender = sa.Column(sa.CHAR, nullable=False)
    ethnicity = sa.Column(sa.CHAR, nullable=False)
    income = sa.Column(sa.Integer, nullable=False)
    marital_status = sa.Column(sa.CHAR, nullable=False)
    parental_status = sa.Column(sa.CHAR, nullable=False)

    user = relationship(User, back_populates="producer")
    location = relationship(Location, back_populates="producers")
