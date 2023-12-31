import sqlalchemy as sa

from ..database import Base


class Location(Base):
    __tablename__ = "Locations"

    id = sa.Column(sa.Integer, primary_key=True, index=True, nullable=False)
    city = sa.Column(sa.String, nullable=False)
    state = sa.Column(sa.String, nullable=False)
    country = sa.Column(sa.String, nullable=False)
