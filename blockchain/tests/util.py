SUBSCRIPTION_PRICE = 1


def producer_consumers(token_contract, test_producer) -> list[str]:
    token_contract.removeProducerExpiredSubscriptions(test_producer)
    return token_contract.producerConsumers(test_producer)


def consumer_subscriptions(token_contract, test_consumer) -> list[dict[str, any]]:
    token_contract.removeConsumerExpiredSubscriptions(test_consumer)
    subscriptions = token_contract.consumerSubscriptions(test_consumer)
    return [
        {
            "eth_address": subscription[0],
            "creation_date": subscription[1],
            "expiration_date": subscription[2],
            "active": subscription[3],
        }
        for subscription in subscriptions
    ]
