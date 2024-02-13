from fastapi import APIRouter, status, HTTPException, Request
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..blockchain.mint_burn import burn_token, mint_token
from ..blockchain.wallet import (
    get_account_from_private_key,
    generate_account,
)
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


@router.post("/me/wallet", status_code=status.HTTP_200_OK, response_model=UserRead)
async def create_user_wallet(
    request: Request,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    if user.eth_address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has a wallet",
        )

    account = generate_account(request.app.state.eth_client, user.email)
    await ops.update_user_eth_address(db, account.address, user)
    return await ops.get_user(db, user)


@router.patch("/me/wallet", status_code=status.HTTP_200_OK, response_model=UserRead)
async def update_user_wallet(
    wallet: WalletBase,
    request: Request,
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_active_user),
):
    if wallet.eth_address == user.eth_address:
        raise HTTPException(
            status_code=status.HTTP_304_NOT_MODIFIED,
            detail="Ethereum address matches the current wallet address",
        )

    if wallet.private_key is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Private key is required to update wallet",
        )

    try:
        account = get_account_from_private_key(
            request.app.state.eth_client, wallet.private_key
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err.args[0],
        )

    if account.address == user.eth_address:
        raise HTTPException(
            status_code=status.HTTP_304_NOT_MODIFIED,
            detail="Ethereum address matches the current wallet address",
        )

    if wallet.eth_address and wallet.eth_address != account.address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Private key does not match the provided Ethereum address",
        )

    # If the user is a producer, burn their old token and mint a new token
    if user.producer:
        burn_token(request.app.state.eth_client, user.eth_address)
        mint_token(request.app.state.eth_client, account.address)

    await ops.update_user_eth_address(db, account.address, user)
    return await ops.get_user(db, user)
