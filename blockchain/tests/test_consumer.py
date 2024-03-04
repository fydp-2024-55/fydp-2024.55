import pytest
import time

from brownie import Token, accounts
from brownie.network import gas_price
from brownie.network.gas.strategies import LinearScalingStrategy

from .util import SUBSCRIPTION_PRICE, producer_consumers, consumer_subscriptions


@pytest.fixture
def token_contract():
    gas_strategy = LinearScalingStrategy("60 gwei", "70 gwei", 1.1)
    gas_price(gas_strategy)

    # Deploy the contract
    yield Token.deploy({"from": accounts[0]})


def test_token_purchase(token_contract):
    minter = token_contract.minter()
    test_consumer = accounts[1]
    test_producer = accounts[2]

    # Mint a new token
    token_contract.mint(test_producer, {"from": minter})

    initial_consumer_balance = test_consumer.balance()
    initial_producer_balance = test_producer.balance()

    # Consumer purchase of the token with a subscription length of 3 seconds
    current_time = time.time()
    token_contract.consumerPurchaseMultipleTokens(
        test_consumer,
        [test_producer],
        current_time,
        current_time + 3,
        {"from": test_consumer, "value": SUBSCRIPTION_PRICE},
    )

    # Check that ETH was transacted from the consumer to producer
    assert test_consumer.balance() < initial_consumer_balance
    assert test_producer.balance() > initial_producer_balance

    # Check that the token was added to the list of tokens for `test_consumer`
    subscriptions = consumer_subscriptions(token_contract, test_consumer)
    assert len(subscriptions) == 1 and subscriptions[0]["eth_address"] == test_producer

    # Check that the consumer was added to the list of consumers for `token_id`
    consumers = producer_consumers(token_contract, test_producer)
    assert len(consumers) == 1 and consumers[0] == test_consumer

    # Sleep 5 seconds to pass the expiration period
    time.sleep(5)

    # Check that the token expired

    subscriptions = consumer_subscriptions(token_contract, test_consumer)
    assert len(subscriptions) == 0

    consumers = producer_consumers(token_contract, test_producer)
    assert len(consumers) == 0


def test_token_cancel(token_contract):
    minter = token_contract.minter()
    test_consumer = accounts[1]
    test_producer = accounts[2]

    # Mint a new token
    token_contract.mint(test_producer, {"from": minter})

    # Consumer purchase of the token
    current_time = time.time()
    token_contract.consumerPurchaseMultipleTokens(
        test_consumer,
        [test_producer],
        current_time,
        current_time + 20,
        {"from": test_consumer, "value": SUBSCRIPTION_PRICE},
    )

    # Cancel the token subscription
    token_contract.consumerCancelMultipleTokens(
        test_consumer, [test_producer], {"from": test_consumer}
    )

    # Check that all associations have been removed
    consumers = producer_consumers(token_contract, test_producer)
    subscriptions = consumer_subscriptions(token_contract, test_consumer)
    assert len(consumers) == 0 and len(subscriptions) == 0


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
    current_time = time.time()
    token_contract.consumerPurchaseMultipleTokens(
        test_consumer,
        [test_producer_1, test_producer_2, test_producer_3],
        current_time,
        current_time + 100,
        {"from": test_consumer, "value": SUBSCRIPTION_PRICE * 3},
    )

    # Check that the producer purchase references were all successful
    subscriptions = consumer_subscriptions(token_contract, test_consumer)
    assert len(subscriptions) == 3
    assert (
        subscriptions[0]["eth_address"] == test_producer_1
        and subscriptions[1]["eth_address"] == test_producer_2
        and subscriptions[2]["eth_address"] == test_producer_3
    )
