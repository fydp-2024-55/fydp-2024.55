import sqlalchemy as sa

from ..database import Base


class ProducerInterests(Base):
    __tablename__ = "Producer_Interests"

    id = sa.Column(sa.Integer, primary_key=True, nullable=False)
    duration = sa.Column(sa.Integer, nullable=False, default=0)
    producer_id = sa.Column(sa.Integer, sa.ForeignKey("Producers.id"), nullable=False)
    category_id = sa.Column(sa.Integer, sa.ForeignKey("Categories.id"), nullable=False)
