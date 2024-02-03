import sqlalchemy as sa

from sqlalchemy.ext.asyncio import AsyncSession

from ..models.users import User
from ..schemas.wallet import WalletBase


async def update_user_wallet(db: AsyncSession, wallet: WalletBase, user: User):
    statement = (
        sa.update(User).where(User.id == user.id).values(eth_address=wallet.eth_address)
    )
    await db.execute(statement)
    await db.commit()
