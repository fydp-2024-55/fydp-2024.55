from pydantic import BaseModel


class WalletBase(BaseModel):
    eth_address: str


class WalletCreateResponse(WalletBase):
    key: str


class WalletBalanceRead(WalletBase):
    balance: float
