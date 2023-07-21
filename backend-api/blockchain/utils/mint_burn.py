from web3 import Web3, contract, types


# Mint a token for a producer
def mint_token(
    web3: Web3, token_contract: contract.Contract, minter: str, producer: str
) -> types.TxReceipt:
    tx_hash = token_contract.functions.mint(producer).transact({"from": minter})
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_receipt


# Burn a token
def burn_token(
    web3: Web3, token_contract: contract.Contract, producer: str
) -> types.TxReceipt:
    tx_hash = token_contract.functions.burn(producer).transact({"from": producer})
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_receipt
