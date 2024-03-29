from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .blockchain.client import ETHClient
from .routes import auth, consumers, producers, users

app = FastAPI()

# Store the ETH client in the app state
app.state.eth_client = ETHClient()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    auth.router,
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    users.router,
    prefix="/users",
    tags=["users"],
)

app.include_router(
    producers.router,
    prefix="/producers",
    tags=["producers"],
)

app.include_router(
    consumers.router,
    prefix="/consumers",
    tags=["consumers"],
)
