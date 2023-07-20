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

### CONSTANTS AND STORAGE VARIABLES ###

# @dev The empty address.
EMPTY_ADDRESS: constant(address) = empty(address)

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

# @dev { consumer: [...producers] }
consumerToProducers: HashMap[address, DynArray[address, MAX_PRODUCERS_PER_CONSUMER]]

# @dev { consumer: { producer: subscriptionEnd } }
consumerToSubscriptions: HashMap[address, HashMap[address, uint256]]

### FUNCTIONS ###

@external
def __init__():
    """
    @dev Contract constructor.
    """
    self.minter = msg.sender
    self.tokenCount = 0

### PRODUCER PERMISSION HELPERS ###

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
    subscriptionEnd: uint256 = (self.consumerToSubscriptions[_consumer])[_producer]

    return subscriptionEnd >= block.timestamp

@internal
def _addConsumerAccess(_consumer: address, _producer: address, _subscriptionLength: uint256):
    """
    @dev Add a consumer to the list of those who purchased access rights for a token, along with the subscription length.
         Throws if `_tokenId` is invalid, `_consumer` is the zero address, or `_subscriptionLength` is invalid.
         Throws if `_tokenId` has no producer.
         Throws if a subsciption record already exists.
    @param _consumer The address of the consumer.
    @param _producer The address of the producer.
    @param _subscriptionLength The length of the purchased subscription.
    """
    assert _consumer != EMPTY_ADDRESS and _producer != EMPTY_ADDRESS and _subscriptionLength > 0
    assert self.producerToTokenId[_producer] != 0
    assert self.consumerToSubscriptions[_consumer][_producer] == 0

    # Consumer-producer relationship
    self.consumerToProducers[_consumer].append(_producer)
    self.producerToConsumers[_producer].append(_consumer)

    # Subscription term
    currentTime: uint256 = block.timestamp
    self.consumerToSubscriptions[_consumer][_producer] = currentTime + _subscriptionLength

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
    assert self.consumerToSubscriptions[_consumer][_producer] != 0

    producers: DynArray[address, MAX_PRODUCERS_PER_CONSUMER] = self.consumerToProducers[_consumer]
    for i in range(MAX_PRODUCERS_PER_CONSUMER):
        if producers[i] == _producer:
            self.consumerToProducers[_consumer][i] = self.consumerToProducers[_consumer][len(self.consumerToProducers[_consumer]) - 1]
            self.consumerToProducers[_consumer].pop()
            break

    consumers: DynArray[address, MAX_CONSUMERS_PER_PRODUCER] = self.producerToConsumers[_producer]
    for i in range(MAX_CONSUMERS_PER_PRODUCER):
        if consumers[i] == _consumer:
            self.producerToConsumers[_producer][i] = self.producerToConsumers[_producer][len(self.producerToConsumers[_producer]) - 1]
            self.producerToConsumers[_producer].pop()
            break

    self.consumerToSubscriptions[_consumer][_producer] = 0

@internal
def _removeConsumerExpiredSubscriptions(_consumer: address):
    """
    @dev Removes a consumer's expired subscriptions.
         Throws if `_consumer` is the zero address.
    @param _consumer The address of the consumer.
    """
    assert _consumer != EMPTY_ADDRESS

    producers: DynArray[address, MAX_PRODUCERS_PER_CONSUMER] = self.consumerToProducers[_consumer]
    for producer in producers:
        if not self._hasConsumerAccessRights(_consumer, producer):
            self._removeConsumerAccess(_consumer, producer)

@internal
def _removeProducerExpiredSubscriptions(_producer: address):
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

@external
def consumerProducers(_consumer: address) -> DynArray[address, MAX_PRODUCERS_PER_CONSUMER]:
    """
    @dev Returns the token IDs purchased by a consumer.
    @param _consumer The address of the consumer.
    @return An array of all the tokens the consumer has purchased access rights to.
    """
    self._removeConsumerExpiredSubscriptions(_consumer)

    return self.consumerToProducers[_consumer]

@external
def producerConsumers(_producer: address) -> DynArray[address, MAX_CONSUMERS_PER_PRODUCER]:
    """
    @dev Returns the consumers who have purchased access rights to a token.
         Throws if `_tokenId` is invalid.
    @param _producer The address of the producer.
    @return An array of all the consumers that have purchased access rights to the token.
    """
    self._removeProducerExpiredSubscriptions(_producer)

    return self.producerToConsumers[_producer]

### CONSUMER ACTIONS ###

@payable
@external
def consumerPurchaseToken(_consumer: address, _producer: address, _subscriptionLength: uint256):
    """
    @dev Consumer purchases access rights to a token for a specified subscription length.
         Throws if `_tokenId` is invalid, `_consumer` is the zero address, or `_subscriptionLength` is invalid.
         Throws if `_tokenId` has no producer.
         Throws if the address interacting with the contract is not `_consumer`.
    @param _consumer The address of the consumer.
    @param _producer The address of the producer.
    @param _subscriptionLength The specified subscription period lenth (in seconds).
    """
    assert _consumer != EMPTY_ADDRESS and _producer != EMPTY_ADDRESS and _subscriptionLength > 0
    tokenId: uint256 = self.producerToTokenId[_producer]
    assert tokenId > 0
    assert msg.sender == _consumer
    
    self._addConsumerAccess(_consumer, _producer, _subscriptionLength)

    log Purchase(tokenId, _consumer, _producer)

@external
def consumerCancelToken(_consumer: address, _producer: address):
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
        log Revoke(tokenId, consumer, _producer)

    self._removeProducerToken(_producer)

    self.tokenCount -= 1
    log Burn(tokenId, _producer)
