from web3 import types

from .client import ETHClient


# Mint a token for a producer
def mint_token(
    eth_client: ETHClient,
    producer: str,
) -> types.TxReceipt:
    tx_hash = eth_client.token_contract.functions.mint(producer).transact(
        {"from": eth_client.minter}
    )
    tx_receipt = eth_client.w3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_receipt


# Burn a token
def burn_token(eth_client: ETHClient, producer: str) -> types.TxReceipt:
    tx_hash = eth_client.token_contract.functions.burn(producer).transact(
        {"from": producer}
    )
    tx_receipt = eth_client.w3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_receipt
