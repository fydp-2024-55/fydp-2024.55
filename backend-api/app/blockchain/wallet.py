from eth_account import Account
from web3 import middleware

from .client import ETHClient


def generate_account(
    eth_client: ETHClient,
    idx: int,
) -> str:
    if idx == 0:
        raise Exception("Cannot assign wallet with idx 0")

    if idx >= 10:
        raise Exception("Insufficient wallets available")

    return eth_client.w3.eth.accounts[idx]


# Get balance of ETH address (in Wei)
def get_balance(eth_client: ETHClient, address: str) -> int:
    return eth_client.w3.eth.get_balance(address)


def get_account_from_private_key(eth_client: ETHClient, private_key: str) -> Account:
    if not private_key.startswith("0x"):
        raise Exception("Invalid private key")

    account = eth_client.w3.eth.account.from_key(private_key)
    if not account:
        return None

    eth_client.w3.middleware_onion.add(
        middleware.construct_sign_and_send_raw_middleware(account)
    )

    return account
