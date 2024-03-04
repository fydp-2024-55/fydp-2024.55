import pytest
import time

from brownie import Token, accounts
from brownie.network import gas_price
from brownie.network.gas.strategies import LinearScalingStrategy

from .util import SUBSCRIPTION_PRICE, producer_consumers


@pytest.fixture
def token_contract():
    gas_strategy = LinearScalingStrategy("60 gwei", "70 gwei", 1.1)
    gas_price(gas_strategy)

    yield Token.deploy({"from": accounts[0]})


def test_initial_state(token_contract):
    # Check if the constructor of the contract is set up properly
    assert token_contract.minter() == accounts[0]
    assert token_contract.tokenCount() == 0


def test_mint_burn(token_contract):
    minter = token_contract.minter()
    test_producer = accounts[1]
    token_count = token_contract.tokenCount()

    # Mint a token and associate it with a producer
    token_contract.mint(test_producer, {"from": minter})
    assert token_contract.tokenCount() == token_count + 1
    assert token_contract.producerTokenId.call(test_producer) == token_count + 1

    # Burn a token and check that it is no longer associated with a producer
    token_contract.burn(test_producer, {"from": test_producer})
    assert token_contract.tokenCount() == token_count
    assert token_contract.producerTokenId.call(test_producer) == 0


def test_producers_list(token_contract):
    minter = token_contract.minter()
    test_producer = accounts[1]
    test_consumer_1 = accounts[2]
    test_consumer_2 = accounts[3]
    test_consumer_3 = accounts[4]

    # Mint a new token for the producer
    token_contract.mint(test_producer, {"from": minter})

    initial_consumer_1_balance = test_consumer_1.balance()
    initial_consumer_2_balance = test_consumer_2.balance()
    initial_consumer_3_balance = test_consumer_3.balance()
    initial_producer_balance = test_producer.balance()

    # Consumer purchase of the token

    current_time = time.time()
    token_contract.consumerPurchaseMultipleTokens(
        test_consumer_1,
        [test_producer],
        current_time,
        current_time + 100,
        {"from": test_consumer_1, "value": SUBSCRIPTION_PRICE},
    )
    token_contract.consumerPurchaseMultipleTokens(
        test_consumer_2,
        [test_producer],
        current_time,
        current_time + 100,
        {"from": test_consumer_2, "value": SUBSCRIPTION_PRICE},
    )
    token_contract.consumerPurchaseMultipleTokens(
        test_consumer_3,
        [test_producer],
        current_time,
        current_time + 100,
        {"from": test_consumer_3, "value": SUBSCRIPTION_PRICE},
    )

    # Check that ETH was transacted from the consumers to producer
    assert (
        test_consumer_1.balance() < initial_consumer_1_balance
        and test_consumer_2.balance() < initial_consumer_2_balance
        and test_consumer_3.balance() < initial_consumer_3_balance
    )
    assert test_producer.balance() > initial_producer_balance

    # Check that the producer purchase references were all successful
    consumers = producer_consumers(token_contract, test_producer)
    assert len(consumers) == 3
    assert (
        consumers[0] == test_consumer_1
        and consumers[1] == test_consumer_2
        and consumers[2] == test_consumer_3
    )
