from web3 import contract
from config import connect_to_eth_network
from constants import SUBSCRIPTION_PRICE


def consumer_purchase_tokens(
    token_contract: contract.Contract,
    consumer: str,
    producers: list[str],
    subscriptionLength: int,
):
    web3 = connect_to_eth_network()

    tx_hash = token_contract.functions.consumerPurchaseMultipleTokens(
        consumer, producers, subscriptionLength
    ).transact(
        {"from": consumer, "value": SUBSCRIPTION_PRICE},
    )
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_receipt
