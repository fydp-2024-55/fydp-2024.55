from web3 import contract

from .config import connect_to_eth_network
from .constants import SUBSCRIPTION_PRICE


def consumer_purchase_tokens(
    token_contract: contract.Contract,
    consumer: str,
    producers: list[str],
    creation_date: int,
    expiration_date: int,
):
    web3 = connect_to_eth_network()

    tx_hash = token_contract.functions.consumerPurchaseMultipleTokens(
        consumer, producers, creation_date, expiration_date
    ).transact(
        {"from": consumer, "value": SUBSCRIPTION_PRICE},
    )
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_receipt
