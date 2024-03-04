from typing import List
import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.categories import Category, ProducerRestrictedCategories
from ..models.producers import Producer
from ..models.users import User


async def get_categories(db: AsyncSession):
    statement = sa.select(Category)
    result = await db.execute(statement)
    return result.scalars().all()


async def get_restricted_categories(db: AsyncSession, producer: Producer):
    statement = sa.select(Category).join(
        ProducerRestrictedCategories,
        sa.and_(
            ProducerRestrictedCategories.category_id == Category.id,
            ProducerRestrictedCategories.producer_id == producer.id,
        ),
    )
    result = await db.execute(statement)
    return result.scalars().all()


async def add_restricted_categories(
    db: AsyncSession, producer: Producer, categories: List[Category]
):
    restricted_categories = [
        {"producer_id": producer.id, "category_id": category.id}
        for category in categories
    ]
    statement = sa.insert(ProducerRestrictedCategories).values(restricted_categories)
    await db.execute(statement)
    await db.commit()


async def remove_restricted_categories(
    db: AsyncSession, producer: Producer, categories: List[Category]
):
    statement = (
        sa.delete(ProducerRestrictedCategories)
        .where(ProducerRestrictedCategories.producer_id == producer.id)
        .where(
            ProducerRestrictedCategories.category_id.in_(
                [category.id for category in categories]
            )
        )
    )
    await db.execute(statement)
    await db.commit()
