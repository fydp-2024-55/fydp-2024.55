SUBSCRIPTION_PRICE = 1

def producer_consumers(token_contract, test_producer):
    token_contract.removeProducerExpiredSubscriptions(test_producer)
    return token_contract.producerConsumers(test_producer)

def consumer_producers(token_contract, test_consumer):
    token_contract.removeConsumerExpiredSubscriptions(test_consumer)
    return token_contract.consumerProducers(test_consumer)
