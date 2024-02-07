from .client import ETHClient
from .constants import SUBSCRIPTION_PRICE


def consumer_purchase_tokens(
    eth_client: ETHClient,
    consumer: str,
    producers: list[str],
    creation_date: int,
    expiration_date: int,
):
    tx_hash = eth_client.token_contract.functions.consumerPurchaseMultipleTokens(
        consumer, producers, creation_date, expiration_date
    ).transact(
        {"from": consumer, "value": SUBSCRIPTION_PRICE},
    )
    tx_receipt = eth_client.w3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_receipt
