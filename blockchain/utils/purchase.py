from web3 import Web3, contract, types
from .constants import SUBSCRIPTION_PRICE


def get_balance(web3: Web3, address: str) -> types.Wei:
    return web3.eth.get_balance(address)


def consumer_purchase_tokens(
    web3: Web3,
    token_contract: contract.Contract,
    consumer: str,
    producers: list[str],
    subscriptionLength: int,
):
    tx_hash = token_contract.functions.consumerPurchaseMultipleTokens(
        consumer, producers, subscriptionLength
    ).transact(
        {"from": consumer, "value": SUBSCRIPTION_PRICE},
    )
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_receipt
