from fastapi import APIRouter, status, HTTPException
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..blockchain.wallet import get_account_from_private_key
from ..dependencies import (
    fastapi_users,
    get_async_session,
    get_current_active_user,
)
from ..models.users import User
from ..ops import users as ops
from ..schemas.users import UserRead, UserUpdate
from ..schemas.wallet import WalletBase

router = APIRouter()

router.include_router(
    fastapi_users.get_users_router(
        user_schema=UserRead, user_update_schema=UserUpdate, requires_verification=False
    ),
)


@router.patch("/me/wallet", status_code=status.HTTP_200_OK, response_model=UserRead)
async def update_user_wallet(
    wallet: WalletBase,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    if wallet.private_key is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Private key is required to update wallet",
        )

    account = get_account_from_private_key(wallet.private_key)
    if wallet.eth_address and wallet.eth_address != account.address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Private key does not match the provided Ethereum address",
        )

    wallet.eth_address = account.address
    await ops.update_user_wallet(db, wallet, user)

    return UserRead(**user.__dict__, eth_address=wallet.eth_address)
