import time

from .constants import SUBSCRIPTION_PRICE
from .client import ETHClient
from .mint_burn import mint_token, burn_token
from .permissions import producer_consumers, consumer_subscriptions
from .subscription import consumer_purchase_tokens
from .wallet import get_balance, get_account_from_private_key, generate_account

# Connect to ETH network
eth_client = ETHClient()

# Test accounts
producer_1, producer_2, producer_3 = (
    eth_client.w3.eth.accounts[1],
    eth_client.w3.eth.accounts[2],
    eth_client.w3.eth.accounts[3],
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
    eth_client.w3.eth.accounts[4],
    eth_client.w3.eth.accounts[5],
    eth_client.w3.eth.accounts[6],
)
print(
    "Consumer 1: ",
    consumer_1,
    "\nConsumer 2: ",
    consumer_2,
    "\nConsumer 3: ",
    consumer_3,
)

# Mint token
mint_token(eth_client, producer_1)

producer_1_balance = get_balance(eth_client, producer_1)

# Three separate consumers purchase rights to `producer_1`'s data
current_time = int(time.time())
consumer_purchase_tokens(
    eth_client, consumer_1, [producer_1], current_time, current_time + 100
)
consumer_purchase_tokens(
    eth_client, consumer_2, [producer_1], current_time, current_time + 100
)
consumer_purchase_tokens(
    eth_client, consumer_3, [producer_1], current_time, current_time + 100
)

# Check that the producer's balance was updated
assert (
    get_balance(eth_client, producer_1) == producer_1_balance + SUBSCRIPTION_PRICE * 3
)

# Check that the consumer purchases were recorded
consumers = producer_consumers(eth_client, producer_1)
assert len(consumers) == 3
print("Consumers: ", consumers)

subscriptions = consumer_subscriptions(eth_client, consumer_1)
assert len(subscriptions) == 1
print("Subscriptions: ", subscriptions)

# Burn token
burn_token(eth_client, producer_1)

# Check that the consumer purchases were recorded
consumers = producer_consumers(eth_client, producer_1)
assert len(consumers) == 0

new_wallet = generate_account(eth_client)

account = get_account_from_private_key(eth_client, new_wallet.key.hex())
assert account != None
