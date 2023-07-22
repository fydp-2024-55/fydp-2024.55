from web3 import contract
from config import connect_to_eth_network


def producer_consumers(token_contract: contract.Contract, producer: str) -> list[str]:
    web3 = connect_to_eth_network()

    # Remove expired subscriptions
    tx_hash = token_contract.functions.removeProducerExpiredSubscriptions(
        producer
    ).transact({"from": producer})

    web3.eth.wait_for_transaction_receipt(tx_hash)

    return token_contract.functions.producerConsumers(producer).call()


def consumer_producers(token_contract: contract.Contract, consumer: str) -> list[str]:
    web3 = connect_to_eth_network()

    # Remove expired subscriptions
    tx_hash = token_contract.functions.removeConsumerExpiredSubscriptions(
        consumer
    ).transact({"from": consumer})
    web3.eth.wait_for_transaction_receipt(tx_hash)

    return token_contract.functions.consumerProducers(consumer).call()
