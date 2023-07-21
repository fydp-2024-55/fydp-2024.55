from web3 import Web3, contract


def producer_consumers(
    web3: Web3, token_contract: contract.Contract, producer: str
) -> list[str]:
    # Remove expired subscriptions
    tx_hash = token_contract.functions.removeProducerExpiredSubscriptions(
        producer
    ).transact({"from": producer})
    web3.eth.wait_for_transaction_receipt(tx_hash)

    return token_contract.functions.producerConsumers(producer).call()


def consumer_producers(
    web3: Web3, token_contract: contract.Contract, consumer: str
) -> list[str]:
    # Remove expired subscriptions
    tx_hash = token_contract.functions.removeConsumerExpiredSubscriptions(
        consumer
    ).transact({"from": consumer})
    web3.eth.wait_for_transaction_receipt(tx_hash)

    return token_contract.functions.consumerProducers(consumer).call()
