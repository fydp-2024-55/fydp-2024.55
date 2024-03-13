from typing import List, Tuple
import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.categories import Category
from ..models.producers import Producer
from ..models.interests import ProducerInterests


async def get_interests(db: AsyncSession, producer: Producer):
    statement = (
        sa.select(Category, ProducerInterests.duration)
        .join(
            ProducerInterests,
            sa.and_(
                ProducerInterests.category_id == Category.id,
                ProducerInterests.producer_id == producer.id,
            ),
        )
        .order_by(sa.desc(ProducerInterests.duration))
    )
    result = await db.execute(statement)
    return result.tuples().all()


async def add_interests(
    db: AsyncSession, producer: Producer, categories: List[Tuple[Category, int]]
):
    interests = [
        {"producer_id": producer.id, "category_id": category.id, "duration": duration}
        for category, duration in categories
    ]
    statement = sa.insert(ProducerInterests).values(interests)
    await db.execute(statement)
    await db.commit()


async def update_interests(
    db: AsyncSession, producer: Producer, categories: List[Tuple[Category, int]]
):
    for category, duration in categories:
        statement = (
            sa.update(ProducerInterests)
            .values(duration=ProducerInterests.duration + duration)
            .where(ProducerInterests.producer_id == producer.id)
            .where(ProducerInterests.category_id == category.id)
        )
        await db.execute(statement)
    await db.commit()


async def remove_interests(
    db: AsyncSession, producer: Producer, categories: List[Category]
):
    statement = (
        sa.delete(ProducerInterests)
        .where(ProducerInterests.producer_id == producer.id)
        .where(
            ProducerInterests.category_id.in_([category.id for category in categories])
        )
    )
    await db.execute(statement)
    await db.commit()
