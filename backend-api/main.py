import uvicorn

from blockchain.utils.config import connect_to_eth_network

if __name__ == "__main__":
    web3 = connect_to_eth_network()

    uvicorn.run(app="backend-api.app.app:app", host="0.0.0.0", port=8000, reload=True)
