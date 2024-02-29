import sqlalchemy as sa
from sqlalchemy.orm import relationship

from ..database import Base
from .consumers import Consumer
from .producers import Producer


class ProducerRestictedCategories(Base):
    __tablename__ = "Producer_Restricted_Categories"

    id = sa.Column(sa.Integer, primary_key=True, nullable=False)
    producer_id = sa.Column(sa.Integer, sa.ForeignKey("Producers.id"), nullable=False)
    category_id = sa.Column(sa.Integer, sa.ForeignKey("Categories.id"), nullable=False)


class ConsumerCategories(Base):
    __tablename__ = "Consumer_Categories"

    id = sa.Column(sa.Integer, primary_key=True, nullable=False)
    consumer_id = sa.Column(sa.Integer, sa.ForeignKey("Consumers.id"), nullable=False)
    category_id = sa.Column(sa.Integer, sa.ForeignKey("Categories.id"), nullable=False)


class Category(Base):
    __tablename__ = "Categories"
    id = sa.Column(sa.Integer, primary_key=True, nullable=False)
    title = sa.Column(sa.String, unique=True, nullable=False)

    restricting_producers = relationship(
        Producer,
        "Producer_Restricted_Categories",
        back_populates="restricted_categories",
    )
    consumers = relationship(
        Consumer, "Consumer_Categories", back_populates="categories"
    )
