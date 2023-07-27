import sqlalchemy as sa

from web3 import contract
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.users import User
from .config import connect_to_eth_network
from ..utils.date import epoch_to_date
from ..ops.consumers import get_consumer


async def producer_subscriptions(
    token_contract: contract.Contract, producer: str, db: AsyncSession
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
        res = await db.execute(sa.select(User).where(User.eth_address == eth_address))
        user = res.scalar_one_or_none()
        if user is None:
            continue

        consumer = await get_consumer(db, user)

        result.append(
            {
                "eth_address": eth_address,
                "name": consumer.name,
                "email": user.email,
            }
        )

    return result


def consumer_subscriptions(
    token_contract: contract.Contract,
    consumer: str,
) -> list[dict[str, any]]:
    web3 = connect_to_eth_network()

    # Remove expired subscriptions
    tx_hash = token_contract.functions.removeConsumerExpiredSubscriptions(
        consumer
    ).transact({"from": consumer})
    web3.eth.wait_for_transaction_receipt(tx_hash)

    subscriptions: list[
        tuple[str, int, int, bool]
    ] = token_contract.functions.consumerSubscriptions(consumer).call()

    return [
        {
            "eth_address": eth_address,
            "creation_date": epoch_to_date(creation_epoch),
            "expiration_date": epoch_to_date(expiration_epoch),
        }
        for eth_address, creation_epoch, expiration_epoch, _ in subscriptions
    ]
