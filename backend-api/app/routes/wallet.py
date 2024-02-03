from fastapi import APIRouter, status, Request

from ..blockchain.wallet import generate_account
from ..schemas.wallet import WalletBase

router = APIRouter()


@router.post("/", status_code=status.HTTP_200_OK)
async def create_wallet(
    request: Request,
):
    account = generate_account(request.app.state.eth_client)
    return WalletBase(eth_address=account.address, private_key=account.key.hex())
