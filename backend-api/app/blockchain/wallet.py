from eth_account import Account
from web3 import types
from config import connect_to_eth_network
from constants import WALLET_ENTROPY


def create_wallet() -> Account:
    acct = Account.create(WALLET_ENTROPY)
    return acct


def get_balance(address: str) -> types.Wei:
    web3 = connect_to_eth_network()
    return web3.eth.get_balance(address)
