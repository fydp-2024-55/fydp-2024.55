import os
import subprocess

from dotenv import load_dotenv
from web3 import Web3, HTTPProvider, contract

load_dotenv()
CONNECTION_URL = os.getenv("CONNECTION_URL")
CONTRACT_PATH = "../blockchain/contracts/Token.vy"


class ETHClient:
    def __init__(
        self, connection_url: str = CONNECTION_URL, contract_path: str = CONTRACT_PATH
    ):
        if not connection_url or not contract_path:
            raise Exception("Missing ETHClient constructor arguments")

        # Establish connection with the test ETH network
        self.w3: Web3 = Web3(HTTPProvider(connection_url))
        if not self.w3.is_connected():
            raise Exception("Ethereum network connection failed")

        # Set the token minter
        self.minter: str = self.w3.eth.accounts[0]

        # Compile the contract
        bytecode = subprocess.getoutput(f"vyper {contract_path}")
        abi = subprocess.getoutput(f"vyper -f abi {contract_path}")
        Token = self.w3.eth.contract(bytecode=bytecode, abi=abi)
        # Deploy the contract
        tx_hash = Token.constructor().transact({"from": self.minter})
        tx_receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)

        self.token_contract: contract.Contract = self.w3.eth.contract(
            address=tx_receipt.contractAddress, abi=abi
        )
