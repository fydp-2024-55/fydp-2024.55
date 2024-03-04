import sqlalchemy as sa
from collections import defaultdict
from datetime import datetime
from typing import Dict, List
from sqlalchemy.ext.asyncio import AsyncSession

from ..extension.categorize import get_interest_category
from ..models.producers import Producer
from ..models.users import User
from ..ops.categories import (
    add_restricted_categories,
    get_categories,
    get_restricted_categories,
    remove_restricted_categories,
)
from ..ops.interests import add_interests, get_interests, update_interests
from ..schemas.producers import (
    ProducerCreate,
    ProducerUpdate,
    ProducerFilter,
    Genders,
    Ethnicities,
    MaritalStatuses,
    ParentalStatuses,
    VisitedSite,
)


async def get_producer(db: AsyncSession, user: User):
    statement = sa.select(Producer).where(Producer.user_id == user.id)
    result = await db.execute(statement)
    return result.scalar()


async def get_producer_by_eth_address(db: AsyncSession, eth_address: str):
    statement = sa.select(Producer).join(User).filter(User.eth_address == eth_address)
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
    query = sa.select(Producer, User.eth_address).outerjoin(
        User, Producer.user_id == User.id
    )

    # TODO: Add filtering for age
    if filter.min_income:
        query = query.where(Producer.income >= filter.min_income)
    if filter.max_income:
        query = query.where(Producer.income <= filter.max_income)
    if filter.genders:
        query = query.where(Producer.gender.in_(filter.genders))
    if filter.ethnicities:
        query = query.where(Producer.ethnicity.in_(filter.ethnicities))
    if filter.countries:
        query = query.where(Producer.country.in_(filter.countries))
    if filter.marital_statuses:
        query = query.where(Producer.marital_status.in_(filter.marital_statuses))
    if filter.parental_statuses:
        query = query.where(Producer.parental_status.in_(filter.parental_statuses))

    # Execute the subquery to retrieve filtered producers
    result = await db.execute(query)
    producers = result.all()

    # Calculate counts based on filtered producers
    counts = {
        "ethAddresses": [],
        "genders": {Genders.Male.value: 0, Genders.Female.value: 0},
        "ethnicities": {
            Ethnicities.American_Indian_or_Alaskan_Native.value: 0,
            Ethnicities.Asian_Pacific_Islander.value: 0,
            Ethnicities.Black_or_African_American.value: 0,
            Ethnicities.Hispanic.value: 0,
            Ethnicities.White_Caucasian.value: 0,
            Ethnicities.Other.value: 0,
        },
        "countries": defaultdict(int),
        "maritalStatuses": {
            MaritalStatuses.Single.value: 0,
            MaritalStatuses.Married.value: 0,
            MaritalStatuses.Divorced.value: 0,
            MaritalStatuses.Widowed.value: 0,
        },
        "parentalStatuses": {
            ParentalStatuses.Parent.value: 0,
            ParentalStatuses.Not_Parent.value: 0,
        },
        "incomes": {
            "under25000": 0,
            "25000to50000": 0,
            "50000to75000": 0,
            "75000to100000": 0,
            "over100000": 0,
        },
        "ages": {
            "under15": 0,
            "15to24": 0,
            "25to34": 0,
            "35to44": 0,
            "45to54": 0,
            "55to64": 0,
            "over64": 0,
        },
    }

    # Iterate through filtered producers to update counts
    for producer, eth_address in producers:
        if not (
            eth_address
            and producer.gender
            and producer.ethnicity
            and producer.country
            and producer.marital_status
            and producer.parental_status
            and producer.income
            and producer.date_of_birth
        ):
            continue

        counts["ethAddresses"].append(eth_address)
        counts["genders"][producer.gender] += 1
        counts["ethnicities"][producer.ethnicity] += 1
        counts["countries"][producer.country] += 1
        counts["maritalStatuses"][producer.marital_status] += 1
        counts["parentalStatuses"][producer.parental_status] += 1

        if producer.income < 25000:
            counts["incomes"]["under25000"] += 1
        elif producer.income < 50000:
            counts["incomes"]["25000to50000"] += 1
        elif producer.income < 75000:
            counts["incomes"]["50000to75000"] += 1
        elif producer.income < 100000:
            counts["incomes"]["75000to100000"] += 1
        else:
            counts["incomes"]["over100000"] += 1

        age = (
            datetime.now()
            - datetime.combine(producer.date_of_birth, datetime.min.time())
        ).days // 365
        if age < 15:
            counts["ages"]["under15"] += 1
        elif age < 25:
            counts["ages"]["15to24"] += 1
        elif age < 35:
            counts["ages"]["25to34"] += 1
        elif age < 45:
            counts["ages"]["35to44"] += 1
        elif age < 55:
            counts["ages"]["45to54"] += 1
        elif age < 65:
            counts["ages"]["55to64"] += 1
        else:
            counts["ages"]["over64"] += 1

    return counts


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
        category.title for category, _ in await get_interests(db, producer)
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
            old_interests.add(interest)
        else:
            updated_interests.append((category, duration))

    if created_interests:
        await add_interests(db, producer, created_interests)
    if updated_interests:
        await update_interests(db, producer, updated_interests)
