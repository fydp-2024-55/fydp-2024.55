import time

from .constants import SUBSCRIPTION_PRICE
from .config import connect_to_eth_network, deploy_contract, get_minter
from .mint_burn import mint_token, burn_token
from .permissions import consumer_producers, producer_consumers
from .subscription import consumer_purchase_tokens
from .wallet import get_balance

# Connect to ETH network
web3 = connect_to_eth_network()

# Test accounts
producer_1, producer_2, producer_3 = (
    web3.eth.accounts[1],
    web3.eth.accounts[2],
    web3.eth.accounts[3],
)
print(
    "Producer 1: ",
    producer_1,
    "\nProducer 2: ",
    producer_2,
    "\nProducer 3: ",
    producer_3,
)
consumer_1, consumer_2, consumer_3 = (
    web3.eth.accounts[4],
    web3.eth.accounts[5],
    web3.eth.accounts[6],
)
print(
    "Consumer 1: ",
    consumer_1,
    "\nConsumer 2: ",
    consumer_2,
    "\nConsumer 3: ",
    consumer_3,
)

# Deploy contract
minter = get_minter()
token_contract = deploy_contract(minter)

# Mint token
mint_token(token_contract, minter, producer_1)

producer_1_balance = get_balance(producer_1)

# Three separate consumers purchase rights to `producer_1`'s data
current_time = int(time.time())
consumer_purchase_tokens(
    token_contract, consumer_1, [producer_1], current_time, current_time + 100
)
consumer_purchase_tokens(
    token_contract, consumer_2, [producer_1], current_time, current_time + 100
)
consumer_purchase_tokens(
    token_contract, consumer_3, [producer_1], current_time, current_time + 100
)

# Check that the producer's balance was updated
assert get_balance(producer_1) == producer_1_balance + SUBSCRIPTION_PRICE * 3

# Check that the consumer purchases were recorded
consumers = producer_consumers(token_contract, producer_1)
assert len(consumers) == 3
print("Consumers: ", consumers)

producers = consumer_producers(token_contract, consumer_1)
assert len(producers) == 1
print("Producers: ", producers)

# Burn token
burn_token(token_contract, producer_1)

# Check that the consumer purchases were recorded
consumers = producer_consumers(token_contract, producer_1)
assert len(consumers) == 0
