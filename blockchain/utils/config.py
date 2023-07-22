import os
import subprocess

from dotenv import load_dotenv
from web3 import Web3, HTTPProvider, contract

load_dotenv()
CONNECTION_URL = os.getenv("CONNECTION_URL")


def connect_to_eth_network() -> Web3:
    # Create the node connection
    web3 = Web3(HTTPProvider(CONNECTION_URL))

    # Verify if the connection is successful
    if not web3.is_connected():
        raise Exception("Ethereum network connection failed")

    print("Ethereum network connection successful")
    return web3


def deploy_contract(web3: Web3, minter: str) -> contract.Contract:
    # Compile the contract
    bytecode = subprocess.getoutput(f"vyper {os.getcwd()}/contracts/Token.vy")
    abi = subprocess.getoutput(f"vyper -f abi {os.getcwd()}/contracts/Token.vy")
    Token = web3.eth.contract(bytecode=bytecode, abi=abi)

    # Deploy the contract
    tx_hash = Token.constructor().transact({"from": minter})
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    token_contract = web3.eth.contract(address=tx_receipt.contractAddress, abi=abi)

    return token_contract
