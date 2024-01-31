# Smart Contract

## Environment Setup

1. Build the Docker image: `docker build -t fydp-blockchain .`
2. Run the Docker image as a container: `docker run fydp-blockchain`

## Automated Tests

1. Run the test suites: `brownie test`
2. To test out individual functions defined in the smart contract, use the Brownie console: `brownie console`

## Setting up MetaMask and MyEtherWallet

1. Install the MetaMask browser extension and create a wallet: https://metamask.io/download/
2. Fund the wallet with test ETH using a Sepolia faucet: https://sepoliafaucet.com/
3. Go to https://www.myetherwallet.com/wallet/access > `Browser extension`. The MetaMask wallet should successfuly integrate with MyEtherWallet
