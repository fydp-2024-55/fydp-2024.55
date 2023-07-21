import pytest

from brownie import Token, accounts

EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000"


@pytest.fixture
def token_contract():
    # Deploy the contract
    return accounts[0].deploy(Token)


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
    assert (
        token_contract.producerTokenId.call(test_producer, {"from": minter})
        == token_count + 1
    )

    # Burn a token and check that it is no longer associated with a producer
    token_contract.burn(test_producer, {"from": test_producer})
    assert token_contract.tokenCount() == token_count
    assert token_contract.producerTokenId.call(test_producer, {"from": minter}) == 0


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
    token_contract.consumerPurchaseMultipleTokens(
        test_consumer_1, [test_producer], 100, {"from": test_consumer_1, "value": 10}
    )
    token_contract.consumerPurchaseMultipleTokens(
        test_consumer_2, [test_producer], 100, {"from": test_consumer_2, "value": 10}
    )
    token_contract.consumerPurchaseMultipleTokens(
        test_consumer_3, [test_producer], 100, {"from": test_consumer_3, "value": 10}
    )

    # Check that ETH was transacted from the consumers to producer
    assert (
        test_consumer_1.balance() == initial_consumer_1_balance - 10
        and test_consumer_2.balance() == initial_consumer_2_balance - 10
        and test_consumer_3.balance() == initial_consumer_3_balance - 10
    )
    assert test_producer.balance() == initial_producer_balance + 10 * 3

    # Check that the producer purchase references were all successful
    consumers = token_contract.producerConsumers.call(
        test_producer, {"from": test_producer}
    )
    assert len(consumers) == 3
    assert (
        consumers[0] == test_consumer_1
        and consumers[1] == test_consumer_2
        and consumers[2] == test_consumer_3
    )
