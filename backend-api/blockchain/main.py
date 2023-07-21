from utils.constants import SUBSCRIPTION_PRICE
from utils.config import connect_to_eth_network, deploy_contract
from utils.mint_burn import mint_token, burn_token
from utils.permissions import consumer_producers, producer_consumers
from utils.purchase import get_balance, consumer_purchase_tokens

# Connect to ETH network
web3 = connect_to_eth_network()

# Test accounts
producer_1, producer_2, producer_3 = (
    web3.eth.accounts[1],
    web3.eth.accounts[2],
    web3.eth.accounts[3],
)
consumer_1, consumer_2, consumer_3 = (
    web3.eth.accounts[4],
    web3.eth.accounts[5],
    web3.eth.accounts[6],
)

# Deploy contract
minter = web3.eth.accounts[0]
token_contract = deploy_contract(web3, minter)

# Mint token
mint_token(web3, token_contract, minter, producer_1)

producer_1_balance = get_balance(web3, producer_1)

# Three separate consumers purchase rights to `producer_1`'s data
consumer_purchase_tokens(web3, token_contract, consumer_1, [producer_1], 100)
consumer_purchase_tokens(web3, token_contract, consumer_2, [producer_1], 100)
consumer_purchase_tokens(web3, token_contract, consumer_3, [producer_1], 100)

# Check that the producer's balance was updated
assert get_balance(web3, producer_1) == producer_1_balance + SUBSCRIPTION_PRICE * 3

# Check that the consumer purchases were recorded
consumers = producer_consumers(web3, token_contract, producer_1)
assert len(consumers) == 3
print("Consumers: ", consumers)

producers = consumer_producers(web3, token_contract, consumer_1)
assert len(producers) == 1
print("Producers: ", producers)

# Burn token
burn_token(web3, token_contract, producer_1)

# Check that the consumer purchases were recorded
consumers = producer_consumers(web3, token_contract, producer_1)
assert len(consumers) == 0
