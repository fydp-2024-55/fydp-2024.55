import sqlalchemy as sa

from sqlalchemy.ext.asyncio import AsyncSession

from ..models.users import User


async def update_user_eth_address(db: AsyncSession, eth_address: str, user: User):
    statement = (
        sa.update(User).where(User.id == user.id).values(eth_address=eth_address)
    )
    await db.execute(statement)
    await db.commit()
