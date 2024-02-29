from typing import Dict
import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.categories import Category, ProducerRestictedCategories

from ..models.producers import Producer
from ..models.users import User
from ..schemas.producers import ProducerCreate, ProducerUpdate


async def get_producer(db: AsyncSession, user: User):
    statement = sa.select(Producer).where(Producer.user_id == user.id)
    result = await db.execute(statement)
    return result.scalar()


async def create_producer(db: AsyncSession, producer: ProducerCreate, user: User):
    statement = sa.insert(Producer).values(
        user_id=user.id,
        country=producer.country,
        date_of_birth=producer.date_of_birth,
        gender=producer.gender,
        ethnicity=producer.ethnicity,
        income=producer.income,
        marital_status=producer.marital_status,
        parental_status=producer.parental_status,
    )
    await db.execute(statement)
    await db.commit()


async def update_producer(db: AsyncSession, producer: ProducerUpdate, user: User):
    statement = (
        sa.update(Producer)
        .values(
            country=producer.country,
            date_of_birth=producer.date_of_birth,
            gender=producer.gender,
            ethnicity=producer.ethnicity,
            income=producer.income,
            marital_status=producer.marital_status,
            parental_status=producer.parental_status,
        )
        .where(Producer.user_id == user.id)
    )
    await db.execute(statement)
    await db.commit()


async def delete_producer(db: AsyncSession, user: User):
    statement = sa.delete(Producer).where(Producer.user_id == user.id)
    await db.execute(statement)
    await db.commit()


async def get_permissions(db: AsyncSession, user: User):
    statement = (
        sa.select(Category, Producer)
        .join(
            ProducerRestictedCategories,
            Category.id == ProducerRestictedCategories.category_id,
            isouter=True,
        )
        .join(
            Producer,
            Producer.id == ProducerRestictedCategories.producer_id
            and Producer.user_id == user.id,
            isouter=True,
        )
    )
    results = await db.execute(statement)
    return [(category, producer is not None) for category, producer in results.tuples()]


async def update_permissions(
    db: AsyncSession, user: User, permissions: Dict[str, bool]
):
    producer = await get_producer(db, user)
    old_permissions = await get_permissions(db, user)

    for category, enabled in old_permissions:
        if category.title not in permissions or enabled == permissions[category.title]:
            continue

        if permissions[category.title]:
            statement = sa.insert(ProducerRestictedCategories).values(
                producer_id=producer.id, category_id=category.id
            )
        else:
            statement = sa.delete(ProducerRestictedCategories).where(
                ProducerRestictedCategories.producer_id == producer.id
                and ProducerRestictedCategories.category_id == category.id
            )

        await db.execute(statement)
        await db.commit()
