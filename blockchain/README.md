# Smart Contract

## Setting up MetaMask and MyEtherWallet

1. Install the MetaMask browser extension and create a wallet: https://metamask.io/download/
2. Fund the wallet with test ETH using a Sepolia faucet: https://sepoliafaucet.com/
3. Go to https://www.myetherwallet.com/wallet/access > `Browser extension`. The MetaMask wallet should successfuly integrate with MyEtherWallet

## Environment Setup

1. Create a new Python virtual environment: `python -m venv venv`
2. Activate the Python virtual environment: `source venv/bin/activate`
3. Install the required libraries: `pip install -r requirements.txt`

## Automated Tests

1. Install Ganache globally: `npm install -g ganache`
2. Run the test suites: `brownie test`
3. To test out individual functions defined in the smart contract, use the Brownie console: `brownie console`

## Deploying the Smart Contract

### Deploy the Contract to Development Network

1. Deploy the contract to the development network: `brownie run deploy`

### Deploy the Contract to Sepolia Network

1. Deploy the contract to the Sepolia network: `brownie run deploy --network sepolia`

### Deploying the Contract Manually

1. Generate the smart contract bytecode: `vyper Tokens.vy`
2. Generate the smart contract ABI: `vyper -f abi Tokens.vy`
3. Go to https://www.myetherwallet.com/wallet/deploy > `Contract` > `Interact with Contract`
4. Select the `Sepolia Testnet` network
5. Paste the smart contract `Bytecode` and `ABI` that were generated when compiling the contracts into the appropriate fields, and provide a `Contract name`
6. `Sign transaction`
