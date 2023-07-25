from ..database import Base
import sqlalchemy as sa
from sqlalchemy.orm import relationship


class Location(Base):
    __tablename__ = "Locations"
    id = sa.Column(sa.Integer, primary_key=True, index=True, nullable=False)
    city = sa.Column(sa.String, nullable=False)
    state = sa.Column(sa.String, nullable=False)
    country = sa.Column(sa.String, nullable=False)

    producers = relationship("Producer", back_populates="location")
