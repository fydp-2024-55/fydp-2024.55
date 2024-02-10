from fastapi import APIRouter, status, Request
from fastapi.params import Depends

from ..blockchain.wallet import generate_account
from ..dependencies import get_current_active_user
from ..models.users import User
from ..schemas.wallet import WalletBase


router = APIRouter()


@router.post("/", status_code=status.HTTP_200_OK, response_model=WalletBase)
async def create_wallet(
    request: Request,
    user: User = Depends(get_current_active_user),
):
    account = generate_account(request.app.state.eth_client, user.email)
    return WalletBase(eth_address=account.address, private_key=account.key.hex())
