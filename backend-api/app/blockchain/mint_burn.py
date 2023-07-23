from web3 import contract, types

from .config import connect_to_eth_network


# Mint a token for a producer
def mint_token(
    token_contract: contract.Contract, minter: str, producer: str
) -> types.TxReceipt:
    web3 = connect_to_eth_network()

    tx_hash = token_contract.functions.mint(producer).transact({"from": minter})
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_receipt


# Burn a token
def burn_token(token_contract: contract.Contract, producer: str) -> types.TxReceipt:
    web3 = connect_to_eth_network()

    tx_hash = token_contract.functions.burn(producer).transact({"from": producer})
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_receipt
