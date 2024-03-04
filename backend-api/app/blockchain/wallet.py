from eth_account.signers.local import LocalAccount
from secrets import token_hex
from web3.middleware import construct_sign_and_send_raw_middleware

from .client import ETHClient


def generate_account(eth_client: ETHClient) -> LocalAccount:
    # Create account from private key
    account = eth_client.w3.eth.account.from_key(token_hex(32))

    # Fund the new account with 100 ETH
    eth_client.w3.eth.send_transaction(
        {
            "from": eth_client.minter,
            "nonce": eth_client.w3.eth.get_transaction_count(eth_client.minter),
            "value": eth_client.w3.to_wei(100, "ether"),
            "to": account.address,
        }
    )

    # Add account as auto-signer
    eth_client.w3.middleware_onion.add(construct_sign_and_send_raw_middleware(account))

    return account


# Get balance of ETH address (in ETH)
def get_balance(eth_client: ETHClient, address: str) -> float:
    return eth_client.w3.from_wei(eth_client.w3.eth.get_balance(address), "ether")
