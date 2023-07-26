from fastapi import APIRouter, status, HTTPException
from fastapi.params import Depends

from ..dependencies import get_current_active_user
from ..models.users import User
from ..schemas.wallets import (
    WalletCreateResponse,
    WalletBalanceRead,
)
from ..blockchain.wallet import create_eth_wallet, get_balance

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_wallet():
    acct = create_eth_wallet()

    return WalletCreateResponse(eth_address=acct.address, key=acct.key.hex())


@router.get("/me/balance", status_code=status.HTTP_200_OK)
async def get_balance(user: User = Depends(get_current_active_user)):
    db_user = User.query.filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    balance = get_balance(db_user.eth_address)

    return WalletBalanceRead(eth_address=db_user.eth_address, balance=balance)
