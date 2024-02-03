from eth_account import Account
from web3 import types, middleware

from .client import ETHClient
from .constants import WALLET_ENTROPY


def generate_account(eth_client: ETHClient, entropy: str = WALLET_ENTROPY) -> Account:
    return eth_client.w3.eth.account.create(entropy)


def get_balance(eth_client: ETHClient, address: str) -> types.Wei:
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
