from typing import Dict, List
import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession

from ..ops.interests import add_interests, get_interests, update_interests

from ..ops.categories import (
    add_restricted_categories,
    get_categories,
    get_restricted_categories,
    remove_restricted_categories,
)


from ..extension.categorize import get_interest_category

from ..models.producers import Producer
from ..models.users import User
from ..schemas.producers import (
    ProducerCreate,
    ProducerRead,
    ProducerUpdate,
    ProducerFilter,
    VisitedSite,
)


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


async def get_producer_countries(db: AsyncSession):
    statement = sa.select(Producer.country).distinct()
    result = await db.execute(statement)
    countries = result.scalars().all()
    return [country for country in countries]


async def get_producers_by_filter(db: AsyncSession, filter: ProducerFilter):
    statement = sa.select(Producer)

    # TODO: Uncomment these once migrated to PostgreSQL
    # if filter.min_age:
    #     statement = statement.where(
    #         sa.func.age(Producer.date_of_birth) >= filter.min_age
    #     )
    # if filter.max_age:
    #     statement = statement.where(
    #         sa.func.age(Producer.date_of_birth) <= filter.max_age
    #     )
    if filter.min_income:
        statement = statement.where(Producer.income >= filter.min_income)
    if filter.max_income:
        statement = statement.where(Producer.income <= filter.max_income)
    if filter.genders:
        statement = statement.where(Producer.gender.in_(filter.genders))
    if filter.ethnicities:
        statement = statement.where(Producer.ethnicity.in_(filter.ethnicities))
    if filter.countries:
        statement = statement.where(Producer.country.in_(filter.countries))
    if filter.marital_statuses:
        statement = statement.where(
            Producer.marital_status.in_(filter.marital_statuses)
        )
    if filter.parental_statuses:
        statement = statement.where(
            Producer.parental_status.in_(filter.parental_statuses)
        )

    producers = await db.execute(statement)
    return [ProducerRead(**producer.__dict__) for producer in producers.scalars().all()]


async def get_permissions(db: AsyncSession, producer: Producer):
    categories = set(await get_categories(db))
    restricted_categories = set(await get_restricted_categories(db, producer))

    return [
        (category, category not in restricted_categories) for category in categories
    ]


async def update_permissions(
    db: AsyncSession, producer: Producer, permissions: Dict[str, bool]
):
    old_permissions = await get_permissions(db, producer)

    restricted_categories = []
    unrestricted_categories = []

    for category, enabled in old_permissions:
        title = str(category.title).lower()
        if title not in permissions:
            continue

        if enabled and not permissions[title]:
            restricted_categories.append(category)
        elif not enabled and permissions[title]:
            unrestricted_categories.append(category)

    if restricted_categories:
        await add_restricted_categories(db, producer, restricted_categories)
    if unrestricted_categories:
        await remove_restricted_categories(db, producer, unrestricted_categories)


async def process_visited_sites(
    db: AsyncSession, producer: Producer, visited_sites: List[VisitedSite]
):
    old_interests = {
        category.title: (category, duration)
        for category, duration in await get_interests(db, producer)
    }
    permissions = {
        category.title: (category, enabled)
        for category, enabled in await get_permissions(db, producer)
    }
    enabled_categories = {key for key, (_, enabled) in permissions.items() if enabled}

    created_interests = []
    updated_interests = []

    for site in visited_sites:
        interest, duration = (
            get_interest_category(site.url, enabled_categories),
            site.duration,
        )
        if interest is None:
            continue

        category, _ = permissions[interest]

        if interest not in old_interests:
            created_interests.append((category, duration))
        else:
            updated_interests.append((category, duration))

    if created_interests:
        await add_interests(db, producer, created_interests)
    else:
        await update_interests(db, producer, updated_interests)
