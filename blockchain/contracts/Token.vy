# @dev Implementation of user data tokens, based on the ERC-721 non-fungible token standard.
# @author William Park
# Based on https://github.com/vyperlang/vyper/blob/master/examples/tokens/ERC721.vy

# @version ^0.3.7

### EVENTS ###

# @dev Emits when a token is minted.
# @param tokenId The identifier for the new token.
# @param producer The address of producer the data token is associated with.
event Mint:
    tokenId: uint256
    producer: indexed(address)

# @dev Emits when a token is burned.
# @param tokenId The identifier for the burned token.
# @param producer The address of producer the data token is associated with.
event Burn:
    tokenId: uint256
    producer: indexed(address)

# @dev Emits when a token is purchased by a consumer.
# @param tokenId The identifier for the token.
# @param consumer The address of consumer who purchased the token.
event Purchase:
    tokenId: uint256
    consumer: indexed(address)
    producer: indexed(address)

# @dev Emits when a token subscription is cancelled by a consumer.
# @param tokenId The identifier for the token.
# @param consumer The address of consumer who cancelled their subcription.
event Cancel:
    tokenId: uint256
    consumer: indexed(address)
    producer: indexed(address)

# @dev Emits when a token subscription is revoked for a consumer.
# @param tokenId The identifier for the token.
# @param consumer The address of consumer whose subscription was revoked.
event Revoke:
    tokenId: uint256
    consumer: indexed(address)
    producer: indexed(address)

### STRUCTS ###

struct Subscription:
    producerAddress: address
    creationDate: uint256
    expirationDate: uint256
    active: bool

### CONSTANTS AND STORAGE VARIABLES ###

# @dev The empty address.
EMPTY_ADDRESS: constant(address) = empty(address)

# @dev The price to subscribe to a producer's data (in Ether).
SUBSCRIPTION_PRICE: constant(uint256) = 1

# @dev The maximum number of permitted consumers per producer.
MAX_CONSUMERS_PER_PRODUCER: constant(uint256) = 1024

# @dev The maximum number of permitted producers per consumer.
MAX_PRODUCERS_PER_CONSUMER: constant(uint256) = 1024

# @dev Address of minter, who can mint a token.
minter: public(address)

# @dev The number of total tokens that have been created.
tokenCount: public(uint256)

# @dev { producer: tokenId }
producerToTokenId: HashMap[address, uint256]

# @dev { producer: [...consumers] }
producerToConsumers: HashMap[address, DynArray[address, MAX_CONSUMERS_PER_PRODUCER]]

# @dev { consumer: [...subscriptions] }
consumerToSubscriptionsList: HashMap[address, DynArray[Subscription, MAX_PRODUCERS_PER_CONSUMER]]

# @dev { consumer: { producer: Subscription } }
consumerToSubscriptionsMap: HashMap[address, HashMap[address, Subscription]]

### FUNCTIONS ###

@external
def __init__():
    """
    @dev Contract constructor.
    """
    self.minter = msg.sender
    self.tokenCount = 0

### PRODUCER PERMISSION HELPERS ###

@view
@internal
def _producerTokenId(_producer: address) -> uint256:
    """
    @dev Returns the producer of the token associated with `_tokenId`.
         Throws if `_tokenId` is invalid.
         Throws if the the token has no associated producer.
    @param _producer The address of the producer.
    @return The producer's associated token ID.
    """
    assert _producer != EMPTY_ADDRESS
    tokenId: uint256 = self.producerToTokenId[_producer]

    return tokenId

@internal
def _createProducerToken(_producer: address, _tokenId: uint256):
    """
    @dev Create a token for the specified producer.
         Throws if `_tokenId` is invalid or `_producer` is the zero address.
         Throws if `_producer` already has an associated token.
    @param _producer The address of the producer.
    @param _tokenId The identifier for a token.
    """
    assert _producer != EMPTY_ADDRESS and _tokenId > 0 
    assert self.producerToTokenId[_producer] == 0

    self.producerToTokenId[_producer] = _tokenId

@internal
def _removeProducerToken(_producer: address):
    """
    @dev Remove the association between a producer and its token.
         Throws if `_tokenId` is invalid.
         Throws if `_tokenId` has no producer initially.
    @param _producer The address of the producer.
    """
    assert _producer != EMPTY_ADDRESS
    assert self.producerToTokenId[_producer] != 0

    self.producerToTokenId[_producer] = 0

### CONSUMER PERMISSION HELPERS ###

@internal
def _hasConsumerAccessRights(_consumer: address, _producer: address) -> bool:
    """
    @dev Returns if a consumer's subscription term for a token is still valid.
         Throws if `_tokenId` is invalid or `_consumer` is the zero address.
         Throws if `_consumer` is not subscribed to `_tokenId`.
    @param _consumer The address of the consumer.
    @param _producer The address of the producer.
    @return A boolean representing whether the consumer has access rights to the token.
    """
    assert _consumer != EMPTY_ADDRESS and _producer != EMPTY_ADDRESS
    expirationDate: uint256 = self.consumerToSubscriptionsMap[_consumer][_producer].expirationDate

    return expirationDate != 0 and expirationDate >= block.timestamp

@internal
def _addConsumerAccess(_consumer: address, _producer: address, _creationDate: uint256, _expirationDate: uint256):
    """
    @dev Add a consumer to the list of those who purchased access rights for a token, along with the subscription length.
         Throws if `_tokenId` is invalid, `_consumer` is the zero address, `_creationDate` is invalid.
         Throws if `_tokenId` has no producer.
         Throws if a subscription record already exists.
    @param _consumer The address of the consumer.
    @param _producer The address of the producer.
    @param _creationDate The creation date of the purchased subscription.
    @param _expirationDate The expiration date of the purchased subscription.
    """
    # assert _consumer != EMPTY_ADDRESS and _producer != EMPTY_ADDRESS and _creationDate > 0 and _expirationDate > _creationDate
    # assert self.producerToTokenId[_producer] != 0
    # subscriptionActive: bool = self.consumerToSubscriptionsMap[_consumer][_producer].active
    # assert subscriptionActive == False

    subscription: Subscription = Subscription({producerAddress: _producer, creationDate: _creationDate, expirationDate: _expirationDate, active: True})
    
    # Consumer-producer relationship
    self.producerToConsumers[_producer].append(_consumer)
    self.consumerToSubscriptionsList[_consumer].append(subscription)
    self.consumerToSubscriptionsMap[_consumer][_producer] = subscription

@internal
def _removeConsumerAccess(_consumer: address, _producer: address):
    """
    @dev Remove all associations between a token and a consumer who had previously purchased the token.
         Throws if `_tokenId` is invalid or `_consumer` is the zero address.
         Throws if `_consumer` is not currently a consumer for `_tokenId`
    @param _consumer The address of the consumer.
    @param _producer The address of the producer.
    """
    assert _consumer != EMPTY_ADDRESS and _producer != EMPTY_ADDRESS
    subscription: Subscription = self.consumerToSubscriptionsMap[_consumer][_producer]
    assert subscription.creationDate > 0 and subscription.expirationDate > subscription.creationDate and subscription.active == True

    consumers: DynArray[address, MAX_CONSUMERS_PER_PRODUCER] = self.producerToConsumers[_producer]
    lenConsumers: uint256 = len(consumers)
    for i in range(MAX_CONSUMERS_PER_PRODUCER):
        if consumers[i] == _consumer:
            self.producerToConsumers[_producer][i] = self.producerToConsumers[_producer][len(self.producerToConsumers[_producer]) - 1]
            self.producerToConsumers[_producer].pop()
            break
        if i >= lenConsumers:
            break

    subscriptions: DynArray[Subscription, MAX_PRODUCERS_PER_CONSUMER] = self.consumerToSubscriptionsList[_consumer]
    lenSubscriptions: uint256 = len(subscriptions)
    for i in range(MAX_PRODUCERS_PER_CONSUMER):
        if subscriptions[i].producerAddress == _producer:
            self.consumerToSubscriptionsList[_consumer][i] = self.consumerToSubscriptionsList[_consumer][len(self.consumerToSubscriptionsList[_consumer]) - 1]
            self.consumerToSubscriptionsList[_consumer].pop()
            break
        if i >= lenSubscriptions:
            break

    self.consumerToSubscriptionsMap[_consumer][_producer].active = False

@external
def removeConsumerExpiredSubscriptions(_consumer: address):
    """
    @dev Removes a consumer's expired subscriptions.
         Throws if `_consumer` is the zero address.
    @param _consumer The address of the consumer.
    """
    assert _consumer != EMPTY_ADDRESS

    subscriptions: DynArray[Subscription, MAX_PRODUCERS_PER_CONSUMER] = self.consumerToSubscriptionsList[_consumer]
    for subscription in subscriptions:
        if not self._hasConsumerAccessRights(_consumer, subscription.producerAddress):
            self._removeConsumerAccess(_consumer, subscription.producerAddress)

@external
def removeProducerExpiredSubscriptions(_producer: address):
    """
    @dev Removes a token's expired consumer subscriptions.
         Throws if `_tokenId` is invalid.
    @param _producer The address of the producer.
    """
    assert _producer != EMPTY_ADDRESS

    consumers: DynArray[address, MAX_CONSUMERS_PER_PRODUCER] = self.producerToConsumers[_producer]
    for consumer in consumers:
        if not self._hasConsumerAccessRights(consumer, _producer):
            self._removeConsumerAccess(consumer, _producer)

## PRODUCER TOKENS ###

@view
@external
def producerTokenId(_producer: address) -> uint256:
    """
    @dev Returns the producer of the token associated with `_tokenId`.
         Throws if `_tokenId` is invalid.
         Throws if the the token has no associated producer.
    @param _producer The address of the producer.
    @return The address of the token producer.
    """

    return self._producerTokenId(_producer)

### CONSUMER SUBSCRIPTIONS ###

@view
@external
def consumerSubscriptions(_consumer: address) -> DynArray[Subscription, MAX_PRODUCERS_PER_CONSUMER]:
    """
    @dev Returns the token IDs purchased by a consumer.
    @param _consumer The address of the consumer.
    @return An array of all the tokens the consumer has purchased access rights to.
    """

    return self.consumerToSubscriptionsList[_consumer]

@view
@external
def producerConsumers(_producer: address) -> DynArray[address, MAX_CONSUMERS_PER_PRODUCER]:
    """
    @dev Returns the consumers who have purchased access rights to a token.
         Throws if `_tokenId` is invalid.
    @param _producer The address of the producer.
    @return An array of all the consumers that have purchased access rights to the token.
    """

    return self.producerToConsumers[_producer]

### CONSUMER ACTION HELPERS ###

@payable
@internal
def _consumerPurchaseToken(_consumer: address, _producer: address, _creationDate: uint256, _expirationDate: uint256, _value: uint256):
    """
    @dev Consumer purchases access rights to a token for a specified subscription length.
         Throws if `_tokenId` is invalid, `_consumer` is the zero address, `_creationDate` is invalid, or _expirationDate is invalid.
         Throws if `_tokenId` has no producer.
         Throws if the address interacting with the contract is not `_consumer`.
    @param _consumer The address of the consumer.
    @param _producer The address of the producer.
    @param _creationDate The creation date of the purchased subscription.
    @param _expirationDate The expiration date of the purchased subscription.
    """
    # assert _consumer != EMPTY_ADDRESS and _producer != EMPTY_ADDRESS and _creationDate > 0 and _expirationDate > _creationDate
    # tokenId: uint256 = self.producerToTokenId[_producer]
    # assert tokenId > 0
    # assert msg.sender == _consumer
    # assert _value == SUBSCRIPTION_PRICE

    # Send ETH funds to the producer
    send(_producer, _value)
    
    # self._addConsumerAccess(_consumer, _producer, _creationDate, _expirationDate)

    # log Purchase(tokenId, _consumer, _producer)

@internal
def _consumerCancelToken(_consumer: address, _producer: address):
    """
    @dev Consumer cancels access rights to a token they had previously purchased.
         Throws if `_tokenId` is invalid or `_consumer` is the zero address.
         Throws if `_tokenId` has no producer.
         Throws if the address interacting with the contract is not `_consumer`.
         Throws if `_consumer` does not already have access rights to the token.
    @param _consumer The address of the consumer.
    @param _producer The address of the producer.
    """
    assert _consumer != EMPTY_ADDRESS and _producer != EMPTY_ADDRESS
    tokenId: uint256 = self.producerToTokenId[_producer]
    assert tokenId > 0
    assert msg.sender == _consumer
    assert self._hasConsumerAccessRights(_consumer, _producer)
    
    self._removeConsumerAccess(_consumer, _producer)

    log Cancel(tokenId, _consumer, _producer)

### MASS CONSUMER ACTIONS ###

@payable
@external
def consumerPurchaseMultipleTokens(_consumer: address, _producers: DynArray[address, MAX_PRODUCERS_PER_CONSUMER], _creationDate: uint256, _expirationDate: uint256):
    assert _consumer != EMPTY_ADDRESS
    lenProducers: uint256 = len(_producers)
    assert lenProducers > 0
    assert msg.value == lenProducers * SUBSCRIPTION_PRICE

    for i in range(MAX_PRODUCERS_PER_CONSUMER):
        if i >= lenProducers:
            break
        self._consumerPurchaseToken(_consumer, _producers[i], _creationDate, _expirationDate, msg.value / lenProducers)

@external
def consumerCancelMultipleTokens(_consumer: address, _producers: DynArray[address, MAX_PRODUCERS_PER_CONSUMER]):
    assert _consumer != EMPTY_ADDRESS
    lenProducers: uint256 = len(_producers)
    assert lenProducers > 0

    for i in range(MAX_PRODUCERS_PER_CONSUMER):
        if i >= lenProducers:
            break
        self._consumerCancelToken(_consumer, _producers[i])

### MINT & BURN FUNCTIONS ###

@external
def mint(_producer: address) -> uint256:
    """
    @dev Function to mint tokens
         Throws if `msg.sender` is not the minter.
         Throws if `_producer` is the zero address.
    @param _producer The address that will receive the minted token.
    @return The created token ID.
    """
    assert msg.sender == self.minter
    assert _producer != EMPTY_ADDRESS

    self.tokenCount += 1
    self._createProducerToken(_producer, self.tokenCount)

    log Mint(self.tokenCount, _producer)
    
    return self.tokenCount

# @payable
@external
def burn(_producer: address):
    """
    @dev Burns a specific token.
         Throws if `_tokenId` is invalid.
         Throws if `_tokenId` has no producer.
         Throws if the address interacting with the contract is not the producer of the token.
    @param _producer The address of the producer whose token will be burned.
    """
    assert _producer != EMPTY_ADDRESS
    tokenId: uint256 = self.producerToTokenId[_producer]
    assert tokenId > 0
    assert msg.sender == _producer

    consumers: DynArray[address, MAX_CONSUMERS_PER_PRODUCER] = self.producerToConsumers[_producer]
    for consumer in consumers:
        self._removeConsumerAccess(consumer, _producer)
        # send(_consumer, msg.value)
        log Revoke(tokenId, consumer, _producer)

    self._removeProducerToken(_producer)

    self.tokenCount -= 1
    log Burn(tokenId, _producer)

### SUBSCRIPTION FUNCTIONS ###

@payable
@external
def consumerSubscribe(_producer: address, _creationDate: uint256, _expirationDate: uint256):
    """
    @dev Consumer purchases access rights to a token for a specified subscription length.
         Throws if `_tokenId` is invalid, `_consumer` is the zero address, `_creationDate` is invalid, or _expirationDate is invalid.
         Throws if `_tokenId` has no producer.
         Throws if the address interacting with the contract is not `_consumer`.
    @param _consumer The address of the consumer.
    @param _producer The address of the producer.
    @param _creationDate The creation date of the purchased subscription.
    @param _expirationDate The expiration date of the purchased subscription.
    """
    assert _producer != EMPTY_ADDRESS and _creationDate > 0 and _expirationDate > _creationDate
    tokenId: uint256 = self.producerToTokenId[_producer]
    assert tokenId > 0

    if not self._hasConsumerAccessRights(msg.sender, _producer):
        # Send ETH funds to the producer
        send(_producer, msg.value)
        self._addConsumerAccess(msg.sender, _producer, _creationDate, _expirationDate)

    # log Purchase(tokenId, msg.sender, _producer)


@payable
@external
def consumerUnsubscribe(_producer: address):
    assert _producer != EMPTY_ADDRESS
    tokenId: uint256 = self.producerToTokenId[_producer]
    assert tokenId > 0
    assert self._hasConsumerAccessRights(msg.sender, _producer)
    
    self._removeConsumerAccess(msg.sender, _producer)

    log Cancel(tokenId, msg.sender, _producer)