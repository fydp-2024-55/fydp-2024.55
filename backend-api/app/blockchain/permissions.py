from web3 import contract
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..models.consumers import Consumer
from ..models.producers import Producer
from .config import connect_to_eth_network
from ..utils.date import epoch_to_date


async def producer_subscriptions(
    token_contract: contract.Contract, producer: str, session: AsyncSession
) -> list[str]:
    web3 = connect_to_eth_network()

    # Remove expired subscriptions
    tx_hash = token_contract.functions.removeProducerExpiredSubscriptions(
        producer
    ).transact({"from": producer})
    web3.eth.wait_for_transaction_receipt(tx_hash)

    result = []
    consumers = token_contract.functions.producerConsumers(producer).call()
    for eth_address in consumers:
        db_consumer = await session.execute(
            select(Consumer).where(eth_address=eth_address)
        )
        if db_consumer is None:
            continue

        result.append(
            {
                "eth_address": eth_address,
                "name": db_consumer.name,
                "email": db_consumer.email,
            }
        )

    return result


async def consumer_subscriptions(
    token_contract: contract.Contract,
    consumer: str,
    session: AsyncSession,
) -> list[dict[str, any]]:
    web3 = connect_to_eth_network()

    # Remove expired subscriptions
    tx_hash = token_contract.functions.removeConsumerExpiredSubscriptions(
        consumer
    ).transact({"from": consumer})
    web3.eth.wait_for_transaction_receipt(tx_hash)

    result = []
    subscriptions = token_contract.functions.consumerSubscriptions(consumer).call()
    for subscription in subscriptions:
        eth_address = subscription[0]

        db_producer = await session.execute(
            select(Producer).where(Producer.eth_address == eth_address)
        )
        if db_producer is None:
            continue

        result.append(
            {
                "eth_address": eth_address,
                "name": db_producer.name,
                "email": db_producer.email,
                "creation_date": epoch_to_date(subscription[1]),
                "expiration_date": epoch_to_date(subscription[2]),
            }
        )

    return result
