from eth_account.signers.local import LocalAccount
from secrets import token_hex
from web3.middleware import construct_sign_and_send_raw_middleware

from .client import ETHClient


def send_transaction(
    eth_client: ETHClient, from_address: str, to_address: str, value: float
) -> str:
    return eth_client.w3.eth.send_transaction(
        {
            "from": from_address,
            "nonce": eth_client.w3.eth.get_transaction_count(from_address),
            "to": to_address,
            "value": eth_client.w3.to_wei(value, "ether"),
        }
    )


# Get balance of ETH address (in ETH)
def get_balance(eth_client: ETHClient, address: str) -> float:
    return eth_client.w3.from_wei(eth_client.w3.eth.get_balance(address), "ether")


def reset_account_balance(eth_client: ETHClient, address: str):
    sender, receiver = eth_client.minter, address
    balance = get_balance(eth_client, address)
    if balance > 100:
        receiver, sender = sender, receiver
    send_transaction(eth_client, sender, receiver, abs(100 - balance))


def generate_account(eth_client: ETHClient) -> LocalAccount:
    # Create account from private key
    account = eth_client.w3.eth.account.from_key(token_hex(32))

    # Set the account balance to 100 ETH
    reset_account_balance(eth_client, account.address)

    # Add account as auto-signer
    eth_client.w3.middleware_onion.add(construct_sign_and_send_raw_middleware(account))

    return account


def address_exists(eth_client: ETHClient, address: str) -> bool:
    return address in eth_client.w3.eth.accounts


def valid_private_key(private_key: str) -> bool:
    # Check if private key is not zero
    if private_key == 0:
        return False

    # Convert the private key to an integer
    private_key_int = int(private_key, 16)

    # Define the order of the curve
    order_of_curve = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141

    # Check if private key is less than the order of the curve
    if private_key_int >= order_of_curve:
        return False

    return True
