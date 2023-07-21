import os
import subprocess

from dotenv import load_dotenv
from web3 import Web3, HTTPProvider

load_dotenv()
GANACHE_CONNECTION_URL = os.getenv("GANACHE_CONNECTION_URL")

SUBSCRIPTION_PRICE = 1

# Create the node connection
web3 = Web3(HTTPProvider(GANACHE_CONNECTION_URL))
print("Latest Ethereum block number", web3.eth.block_number)

# Verify if the connection is successful
if web3.is_connected():
    print("-" * 50)
    print("Connection Successful")
    print("-" * 50)
else:
    print("Connection Failed")

minter = web3.to_checksum_address(web3.eth.accounts[0])
web3.eth.defaultAccount = web3.eth.accounts[0]

producer_1, producer_2, producer_3 = (
    web3.to_checksum_address(web3.eth.accounts[1]),
    web3.to_checksum_address(web3.eth.accounts[2]),
    web3.to_checksum_address(web3.eth.accounts[3]),
)
consumer_1, consumer_2, consumer_3 = (
    web3.to_checksum_address(web3.eth.accounts[4]),
    web3.to_checksum_address(web3.eth.accounts[5]),
    web3.to_checksum_address(web3.eth.accounts[6]),
)


def producer_consumers(token_contract, test_producer):
    tx_hash = token_contract.functions.removeProducerExpiredSubscriptions(
        test_producer
    ).transact({"from": minter})
    web3.eth.wait_for_transaction_receipt(tx_hash)
    return token_contract.functions.producerConsumers(test_producer).call()


def consumer_producers(token_contract, test_consumer):
    tx_hash = token_contract.functions.removeConsumerExpiredSubscriptions(
        test_consumer
    ).transact({"from": minter})
    web3.eth.wait_for_transaction_receipt(tx_hash)
    return token_contract.functions.consumerProducers(test_consumer).call()


# Deploy smart contract
bytecode = subprocess.getoutput("vyper contracts/Token.vy")
abi = subprocess.getoutput("vyper -f abi contracts/Token.vy")
Token = web3.eth.contract(bytecode=bytecode, abi=abi)
tx_hash = Token.constructor().transact({"from": minter})
tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
token_contract = web3.eth.contract(address=tx_receipt.contractAddress, abi=abi)

# Mint a token for a producer
tx_hash = token_contract.functions.mint(producer_1).transact({"from": minter})
web3.eth.wait_for_transaction_receipt(tx_hash)

producer_1_balance = web3.eth.get_balance(producer_1)

# Three separate consumers purchase rights to `producer_1`'s data
tx_hash = token_contract.functions.consumerPurchaseMultipleTokens(
    consumer_1, [producer_1], 100
).transact(
    {"from": consumer_1, "value": SUBSCRIPTION_PRICE},
)
web3.eth.wait_for_transaction_receipt(tx_hash)
tx_hash = token_contract.functions.consumerPurchaseMultipleTokens(
    consumer_2, [producer_1], 100
).transact(
    {"from": consumer_2, "value": SUBSCRIPTION_PRICE},
)
web3.eth.wait_for_transaction_receipt(tx_hash)
tx_hash = token_contract.functions.consumerPurchaseMultipleTokens(
    consumer_3, [producer_1], 100
).transact(
    {"from": consumer_3, "value": SUBSCRIPTION_PRICE},
)
web3.eth.wait_for_transaction_receipt(tx_hash)

# Check that the producer's balance was updated
assert web3.eth.get_balance(producer_1) == producer_1_balance + SUBSCRIPTION_PRICE * 3

# Check that the consumer purchases were recorded
consumers = producer_consumers(token_contract, producer_1)
assert len(consumers) == 3
print("Consumers: ", consumers)

producers = consumer_producers(token_contract, consumer_1)
assert len(producers) == 1
print("Producers: ", producers)
