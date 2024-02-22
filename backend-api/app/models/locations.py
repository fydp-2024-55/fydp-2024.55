import sqlalchemy as sa

from sqlalchemy.orm import relationship

from ..database import Base
from .users import User


class Location(Base):
    __tablename__ = "Locations"

    id = sa.Column(sa.Integer, primary_key=True, index=True, nullable=False)
    city = sa.Column(sa.String, nullable=False)
    state = sa.Column(sa.String, nullable=False)
    country = sa.Column(sa.String, nullable=False)

    user = relationship(User, back_populates="location")
