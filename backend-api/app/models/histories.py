import sqlalchemy as sa
from sqlalchemy.orm import relationship

from ..database import Base
from .producers import Producer


class History(Base):
    __tablename__ = "Histories"

    id = sa.Column(sa.Integer, primary_key=True, index=True, nullable=False)
    title = sa.Column(sa.String, nullable=False)
    visit_time = sa.Column(sa.DateTime, nullable=False)
    time_spent = sa.Column(sa.Integer, nullable=False)
    url = sa.Column(sa.String, nullable=False)
    producer_id = sa.Column(sa.Integer, sa.ForeignKey("Producers.id"), nullable=False)

    producer = relationship(Producer, back_populates="histories")
    categories = relationship(
        "Category", "History_Categories", back_populates="histories"
    )
