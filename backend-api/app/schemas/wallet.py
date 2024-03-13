from pydantic import BaseModel


class WalletBase(BaseModel):
    eth_address: str


class WalletRead(WalletBase):
    balance: float


class WalletUpdate(WalletBase):
    private_key: str
