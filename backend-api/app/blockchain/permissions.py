from web3 import contract

from .config import connect_to_eth_network
from ..utils.date import epoch_to_date


def producer_consumers(token_contract: contract.Contract, producer: str) -> list[str]:
    web3 = connect_to_eth_network()

    # Remove expired subscriptions
    tx_hash = token_contract.functions.removeProducerExpiredSubscriptions(
        producer
    ).transact({"from": producer})

    web3.eth.wait_for_transaction_receipt(tx_hash)

    return token_contract.functions.producerConsumers(producer).call()


def consumer_subscriptions(
    token_contract: contract.Contract, consumer: str
) -> list[dict[str, any]]:
    web3 = connect_to_eth_network()

    # Remove expired subscriptions
    tx_hash = token_contract.functions.removeConsumerExpiredSubscriptions(
        consumer
    ).transact({"from": consumer})
    web3.eth.wait_for_transaction_receipt(tx_hash)

    subscriptions = token_contract.functions.consumerSubscriptions(consumer).call()

    return [
        {
            "producer_eth_address": subscription[0],
            "creation_date": epoch_to_date(subscription[1]),
            "expiration_date": epoch_to_date(subscription[2]),
            "active": subscription[3],
        }
        for subscription in subscriptions
    ]
