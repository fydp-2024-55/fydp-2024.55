from fastapi import APIRouter, status, HTTPException, Request
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

# from ..blockchain.mint_burn import burn_token, mint_token
from ..blockchain.wallet import (
    generate_account,
    get_balance,
)
from ..dependencies import (
    fastapi_users,
    get_async_session,
    get_current_active_user,
)
from ..models.users import User
from ..ops import users as ops
from ..ops.producers import get_producer
from ..schemas.users import UserRead, UserUpdate
from ..schemas.wallet import WalletRead, WalletUpdate

router = APIRouter()

router.include_router(
    fastapi_users.get_users_router(
        user_schema=UserRead, user_update_schema=UserUpdate, requires_verification=False
    ),
)


@router.get("/me/wallet", status_code=status.HTTP_200_OK, response_model=WalletRead)
async def read_user_wallet(
    request: Request,
    user: User = Depends(get_current_active_user),
):
    if not user.eth_address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not have a wallet",
        )

    try:
        balance = get_balance(request.app.state.eth_client, user.eth_address)
        return WalletRead(eth_address=user.eth_address, balance=balance)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve the wallet balance",
        )


@router.post("/me/wallet", status_code=status.HTTP_200_OK, response_model=WalletRead)
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

    try:
        account = generate_account(request.app.state.eth_client)
        await ops.update_user_eth_address(db, account.address, user)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create a wallet",
        )

    return await read_user_wallet(request, user)


# @router.patch("/me/wallet", status_code=status.HTTP_200_OK, response_model=WalletRead)
# async def update_user_wallet(
#     wallet: WalletUpdate,
#     request: Request,
#     db: AsyncSession = Depends(get_async_session),
#     user: User = Depends(get_current_active_user),
# ):
#     if wallet.eth_address == user.eth_address:
#         raise HTTPException(
#             status_code=status.HTTP_304_NOT_MODIFIED,
#             detail="Ethereum address matches the current wallet address",
#         )

#     if wallet.private_key is None:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Private key is required to update wallet",
#         )

#     try:
#         address = get_address_from_private_key(
#             request.app.state.eth_client, wallet.private_key
#         )
#     except Exception as err:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=err.args[0],
#         )

#     if address == user.eth_address:
#         raise HTTPException(
#             status_code=status.HTTP_304_NOT_MODIFIED,
#             detail="Ethereum address matches the current wallet address",
#         )

#     if wallet.eth_address and wallet.eth_address != address:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Private key does not match the provided Ethereum address",
#         )

#     # If the user is a producer, burn their old token and mint a new token
#     if await get_producer(db, user):
#         try:
#             burn_token(request.app.state.eth_client, user.eth_address)
#             mint_token(request.app.state.eth_client, address)
#         except Exception:
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail="Failed to re-mint the token",
#             )

#     await ops.update_user_eth_address(db, address, user)

#     return await read_user_wallet(request, user)


@router.get(
    "/eth-address/{eth_address}",
    status_code=status.HTTP_200_OK,
    response_model=UserRead,
)
async def read_user_by_eth_address(
    eth_address: str,
    db: AsyncSession = Depends(get_async_session),
):
    user = await ops.get_user_by_eth_address(db, eth_address)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return UserRead(**user.__dict__)
