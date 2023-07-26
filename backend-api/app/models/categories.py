import sqlalchemy as sa
from sqlalchemy.orm import relationship

from ..database import Base
from .consumers import Consumer
from .histories import History
from .producers import Producer


class ProducerRestictedCategories(Base):
    __tablename__ = "Producer_Restricted_Categories"

    id = sa.Column(sa.Integer, primary_key=True, nullable=False)
    producer_id = (
        sa.Column(sa.Integer, sa.ForeignKey("Producers.id"), nullable=False),
    )
    category_id = (
        sa.Column(sa.Integer, sa.ForeignKey("Categories.id"), nullable=False),
    )


class ConsumerCategories(Base):
    __tablename__ = "Consumer_Categories"

    id = sa.Column(sa.Integer, primary_key=True, nullable=False)
    consumer_id = (
        sa.Column(sa.Integer, sa.ForeignKey("Consumers.id"), nullable=False),
    )
    category_id = (
        sa.Column(sa.Integer, sa.ForeignKey("Categories.id"), nullable=False),
    )


class HistoryCategories(Base):
    __tablename__ = "History_Categories"

    id = sa.Column(sa.Integer, primary_key=True, nullable=False)
    consumer_id = (
        sa.Column(sa.Integer, sa.ForeignKey("Histories.id"), nullable=False),
    )
    category_id = (
        sa.Column(sa.Integer, sa.ForeignKey("Categories.id"), nullable=False),
    )


class Category(Base):
    __tablename__ = "Categories"
    id = sa.Column(sa.Integer, primary_key=True, nullable=False)
    title = sa.Column(sa.String, unique=True, nullable=False)

    restricting_producers = relationship(
        Producer,
        ProducerRestictedCategories,
        back_populates="restricted_categories",
    )
    consumers = relationship(Consumer, ConsumerCategories, back_populates="categories")
    histories = relationship(History, HistoryCategories, back_populates="categories")
