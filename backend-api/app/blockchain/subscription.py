from .client import ETHClient


def consumer_subscribe(
    eth_client: ETHClient,
    consumer: str,
    producers: list[str],
    creation_date: int,
    expiration_date: int,
):
    for producer in producers:
        tx_hash = eth_client.token_contract.functions.consumerSubscribe(
            producer, creation_date, expiration_date
        ).transact(
            {
                "from": consumer,
                # "nonce": eth_client.w3.eth.get_transaction_count(consumer),
                "value": eth_client.w3.to_wei(1, "ether"),  # Send 1 ETH
            },
        )
        eth_client.w3.eth.wait_for_transaction_receipt(tx_hash)


def consumer_unsubscribe(
    eth_client: ETHClient, consumer: str, producers: list[str]
) -> None:
    for producer in producers:
        tx_hash = eth_client.token_contract.functions.consumerUnsubscribe(
            producer
        ).transact(
            {
                "from": consumer,
                # "nonce": eth_client.w3.eth.get_transaction_count(consumer),
            }
        )
        eth_client.w3.eth.wait_for_transaction_receipt(tx_hash)
