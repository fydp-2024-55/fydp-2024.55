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
    tx = token_contract.mint(test_producer, {'from': minter})
    token_id = tx.return_value
    
    # Consumer purchase of the token with a subscription length of 5 seconds
    token_contract.consumerPurchaseToken(token_id, test_consumer, 5, {'from': test_consumer})
    
    # Check that the token was added to the list of tokens for `test_consumer`
    tokens_tx = token_contract.consumerTokens(test_consumer)
    tokens = tokens_tx.return_value
    assert len(tokens) == 1 and tokens[0] == token_id
    
    # Check that the consumer was added to the list of consumers for `token_id`
    consumers_tx = token_contract.tokenConsumers(token_id)
    consumers = consumers_tx.return_value
    assert len(consumers) == 1 and consumers[0] == test_consumer
    
    # Sleep 7 seconds to pass the expiration period
    time.sleep(7)
    
    # Check that the token expired
    
    tokens_tx = token_contract.consumerTokens(test_consumer)
    tokens = tokens_tx.return_value
    assert len(tokens) == 0
    
    consumers_tx = token_contract.tokenConsumers(token_id)
    consumers = consumers_tx.return_value
    assert len(consumers) == 0

def test_token_cancel(token_contract):
    minter = token_contract.minter()
    test_producer = accounts[1]
    test_consumer = accounts[2]
    
    # Mint a new token
    tx = token_contract.mint(test_producer, {'from': minter})
    token_id = tx.return_value
    
    # Consumer purchase of the token
    token_contract.consumerPurchaseToken(token_id, test_consumer, 20, {'from': test_consumer})
    
    # Cancel the token subscription
    token_contract.consumerCancelToken(token_id, test_consumer, {'from': test_consumer})
    consumers_tx = token_contract.tokenConsumers(token_id)
    consumers = consumers_tx.return_value
    tokens_tx = token_contract.consumerTokens(test_consumer)
    tokens = tokens_tx.return_value
    assert len(consumers) == 0 and len(tokens) == 0
