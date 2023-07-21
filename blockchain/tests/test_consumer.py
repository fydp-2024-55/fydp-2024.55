import pytest
import time

from brownie import Token, accounts

SUBSCRIPTION_PRICE = 1

@pytest.fixture
def token_contract():
    # Deploy the contract
    return accounts[0].deploy(Token)


def test_token_purchase(token_contract):
    minter = token_contract.minter()
    test_consumer = accounts[1]
    test_producer = accounts[2]

    # Mint a new token
    token_contract.mint(test_producer, {"from": minter})

    initial_consumer_balance = test_consumer.balance()
    initial_producer_balance = test_producer.balance()

    # Consumer purchase of the token with a subscription length of 5 seconds
    token_contract.consumerPurchaseMultipleTokens(
        test_consumer, [test_producer], 5, {"from": test_consumer, "value": SUBSCRIPTION_PRICE}
    )

    # Check that ETH was transacted from the consumer to producer
    assert test_consumer.balance() == initial_consumer_balance - SUBSCRIPTION_PRICE
    assert test_producer.balance() == initial_producer_balance + SUBSCRIPTION_PRICE

    # Check that the token was added to the list of tokens for `test_consumer`
    producers_tx = token_contract.consumerProducers(test_consumer)
    producers = producers_tx.return_value
    assert len(producers) == 1 and producers[0] == test_producer

    # Check that the consumer was added to the list of consumers for `token_id`
    consumers_tx = token_contract.producerConsumers(test_producer)
    consumers = consumers_tx.return_value
    assert len(consumers) == 1 and consumers[0] == test_consumer

    # Sleep 7 seconds to pass the expiration period
    time.sleep(7)

    # Check that the token expired

    producers_tx = token_contract.consumerProducers(test_consumer)
    producers = producers_tx.return_value
    assert len(producers) == 0

    consumers_tx = token_contract.producerConsumers(test_producer)
    consumers = consumers_tx.return_value
    assert len(consumers) == 0


def test_token_cancel(token_contract):
    minter = token_contract.minter()
    test_consumer = accounts[1]
    test_producer = accounts[2]

    # Mint a new token
    token_contract.mint(test_producer, {"from": minter})

    # Consumer purchase of the token
    token_contract.consumerPurchaseMultipleTokens(
        test_consumer, [test_producer], 20, {"from": test_consumer, "value": SUBSCRIPTION_PRICE}
    )

    # Cancel the token subscription
    token_contract.consumerCancelMultipleTokens(
        test_consumer, [test_producer], {"from": test_consumer}
    )
    # Check that all associations have been removed
    consumers_tx = token_contract.producerConsumers(test_producer)
    consumers = consumers_tx.return_value
    producers_tx = token_contract.consumerProducers(test_consumer)
    producers = producers_tx.return_value
    assert len(consumers) == 0 and len(producers) == 0


def test_tokens_list(token_contract):
    minter = token_contract.minter()
    test_consumer = accounts[1]
    test_producer_1 = accounts[2]
    test_producer_2 = accounts[3]
    test_producer_3 = accounts[4]

    # Mint new tokens for each producer
    token_contract.mint(test_producer_1, {"from": minter})
    token_contract.mint(test_producer_2, {"from": minter})
    token_contract.mint(test_producer_3, {"from": minter})

    # Consumer purchase of the tokens
    token_contract.consumerPurchaseMultipleTokens(
        test_consumer,
        [test_producer_1, test_producer_2, test_producer_3],
        100,
        {"from": test_consumer, "value": SUBSCRIPTION_PRICE * 3},
    )

    # Check that the producer purchase references were all successful
    producers = token_contract.consumerProducers.call(
        test_consumer, {"from": test_consumer}
    )
    assert len(producers) == 3
    assert (
        producers[0] == test_producer_1
        and producers[1] == test_producer_2
        and producers[2] == test_producer_3
    )
