import sqlalchemy as sa

from sqlalchemy.ext.asyncio import AsyncSession

from ..models.users import User


async def update_user_eth_address(db: AsyncSession, eth_address: str, user: User):
    statement = (
        sa.update(User).where(User.id == user.id).values(eth_address=eth_address)
    )
    await db.execute(statement)
    await db.commit()


async def get_user(db: AsyncSession, user: User):
    statement = sa.select(User).where(User.id == user.id)
    result = await db.execute(statement)
    user = result.scalar_one_or_none()
    if user is None:
        return None
    return user


async def delete_user(db: AsyncSession, user: User):
    statement = sa.delete(User).where(User.id == user.id)
    await db.execute(statement)
    await db.commit()
