# import time
from datetime import datetime, timedelta

from .client import ETHClient
from .mint_burn import mint_token, burn_token
from .permissions import producer_consumers, consumer_subscriptions
from .subscription import consumer_subscribe
from .wallet import get_balance, generate_account
from ..utils.date import date_to_epoch

# Connect to ETH network
eth_client = ETHClient()

# Test accounts
producer_1 = generate_account(eth_client)
producer_2 = generate_account(eth_client)
producer_3 = generate_account(eth_client)
print(
    "Producer 1: ",
    producer_1.address,
    "\nProducer 2: ",
    producer_2.address,
    "\nProducer 3: ",
    producer_3.address,
)
consumer_1, consumer_2, consumer_3 = (
    generate_account(eth_client),
    generate_account(eth_client),
    generate_account(eth_client),
)
print(
    "Consumer 1: ",
    consumer_1.address,
    "\nConsumer 2: ",
    consumer_2.address,
    "\nConsumer 3: ",
    consumer_3.address,
)

# Mint token
mint_token(eth_client, producer_1.address)
mint_token(eth_client, producer_2.address)
mint_token(eth_client, producer_3.address)

producer_1_initial_balance = get_balance(eth_client, producer_1.address)
producer_2_initial_balance = get_balance(eth_client, producer_2.address)
producer_3_initial_balance = get_balance(eth_client, producer_3.address)

print("Producer 1 initial balance: ", producer_1_initial_balance)
print("Producer 2 initial balance: ", producer_2_initial_balance)
print("Producer 3 initial balance: ", producer_3_initial_balance)

consumer_1_initial_balance = get_balance(eth_client, consumer_1.address)
consumer_2_initial_balance = get_balance(eth_client, consumer_2.address)
consumer_3_initial_balance = get_balance(eth_client, consumer_3.address)

print("Consumer 1 initial balance: ", consumer_1_initial_balance)
print("Consumer 2 initial balance: ", consumer_2_initial_balance)
print("Consumer 3 initial balance: ", consumer_3_initial_balance)

# Three separate consumers purchase rights to `producer_1`'s data
current_date = datetime.now().date()
tomorrow = current_date + timedelta(days=1)
consumer_subscribe(
    eth_client,
    consumer_1.address,
    [producer_1.address, producer_2.address, producer_3.address],
    date_to_epoch(current_date),
    date_to_epoch(tomorrow),
)
consumer_subscribe(
    eth_client,
    consumer_2.address,
    [producer_1.address, producer_2.address, producer_3.address],
    date_to_epoch(current_date),
    date_to_epoch(tomorrow),
)
consumer_subscribe(
    eth_client,
    consumer_3.address,
    [producer_1.address, producer_2.address, producer_3.address],
    date_to_epoch(current_date),
    date_to_epoch(tomorrow),
)

# Check that the producer and consumers balances were updated
assert get_balance(eth_client, producer_1.address) > producer_1_initial_balance
assert get_balance(eth_client, producer_2.address) > producer_2_initial_balance
assert get_balance(eth_client, producer_3.address) > producer_3_initial_balance
assert get_balance(eth_client, consumer_1.address) < consumer_1_initial_balance
assert get_balance(eth_client, consumer_2.address) < consumer_2_initial_balance
assert get_balance(eth_client, consumer_3.address) < consumer_3_initial_balance


# Check that the consumer purchases were recorded
consumers = producer_consumers(eth_client, producer_1.address)
assert len(consumers) == 3
print("Consumers: ", consumers)

subscriptions = consumer_subscriptions(eth_client, consumer_1.address)
assert len(subscriptions) == 3
print("Subscriptions: ", subscriptions)

# Burn token
try:
    burn_token(eth_client, producer_1.address)
    burn_token(eth_client, producer_2.address)
    burn_token(eth_client, producer_3.address)
except Exception:
    print("Failed to burn token")

# Check that the consumer purchases were recorded
consumers = producer_consumers(eth_client, producer_1.address)
assert len(consumers) == 0

# new_wallet = generate_account(eth_client, 1)

# account = get_address_from_private_key(eth_client, new_wallet.key.hex())
# assert account != None
