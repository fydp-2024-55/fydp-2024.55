import pytest

@pytest.fixture
def tokens_contract(Tokens, accounts):
    # deploy the contract
    yield Tokens.deploy({'from': accounts[0]})

def test_initial_state(tokens_contract, accounts):
    # Check if the constructor of the contract is set up properly
    assert tokens_contract.minter() == accounts[0]
    assert tokens_contract.tokenCount() == 0

def test_mint_burn(tokens_contract, accounts):
    tokenId = tokens_contract.mint(accounts[1], {'from': accounts[0]})
    assert tokens_contract.producerOf(tokenId) == accounts[1]
    
    tokens_contract.burn(tokenId, {'from': accounts[1]})
    assert tokens_contract.producerOf(tokenId) == 0
