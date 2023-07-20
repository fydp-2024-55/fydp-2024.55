import pytest
import time

from brownie import Token, accounts

@pytest.fixture
def token_contract():
    # Deploy the contract
    return accounts[0].deploy(Token)

def test_token_purchase(token_contract):
    minter = token_contract.minter()
    test_producer = accounts[1]
    test_consumer = accounts[2]
    
    # Mint a new token
    token_contract.mint(test_producer, {'from': minter})
    
    # Consumer purchase of the token with a subscription length of 5 seconds
    token_contract.consumerPurchaseToken(test_consumer, test_producer, 5, {'from': test_consumer})
    
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
    test_producer = accounts[1]
    test_consumer = accounts[2]
    
    # Mint a new token
    token_contract.mint(test_producer, {'from': minter})
    
    # Consumer purchase of the token
    token_contract.consumerPurchaseToken(test_consumer, test_producer, 20, {'from': test_consumer})
    
    # Cancel the token subscription
    token_contract.consumerCancelToken(test_consumer, test_producer, {'from': test_consumer})
    # Check that all associations have been removed
    consumers_tx = token_contract.producerConsumers(test_producer)
    consumers = consumers_tx.return_value
    producers_tx = token_contract.consumerProducers(test_consumer)
    producers = producers_tx.return_value
    assert len(consumers) == 0 and len(producers) == 0
