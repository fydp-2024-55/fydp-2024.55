from pydantic import BaseModel


class WalletBase(BaseModel):
    eth_address: str | None
    private_key: str
