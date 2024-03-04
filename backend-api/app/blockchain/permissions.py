from .client import ETHClient
from ..utils.date import epoch_to_date


def producer_consumers(eth_client: ETHClient, producer: str) -> list[str]:
    # Remove expired subscriptions
    tx_hash = eth_client.token_contract.functions.removeProducerExpiredSubscriptions(
        producer
    ).transact(
        {
            "from": producer,
        }
    )

    eth_client.w3.eth.wait_for_transaction_receipt(tx_hash)

    return eth_client.token_contract.functions.producerConsumers(producer).call()


def consumer_subscriptions(
    eth_client: ETHClient, consumer: str
) -> list[dict[str, any]]:
    # Remove expired subscriptions
    # tx_hash = eth_client.token_contract.functions.removeConsumerExpiredSubscriptions(
    #     consumer
    # ).transact(
    #     {
    #         "from": consumer,
    #         "nonce": eth_client.w3.eth.get_transaction_count(consumer),
    #     }
    # )
    # eth_client.w3.eth.wait_for_transaction_receipt(tx_hash)

    subscriptions = eth_client.token_contract.functions.consumerSubscriptions(
        consumer
    ).call()

    return [
        {
            "eth_address": subscription[0],
            "creation_date": epoch_to_date(subscription[1]),
            "expiration_date": epoch_to_date(subscription[2]),
            "active": subscription[3],
        }
        for subscription in subscriptions
    ]
