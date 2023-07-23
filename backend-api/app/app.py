from fastapi import FastAPI

from .routes import auth, consumers, histories, producers, subscriptions, users
from .blockchain.config import get_minter, deploy_contract

app = FastAPI()

# Store state on the app instance to use across routes
minter = get_minter()
token_contract = deploy_contract(minter)
app.state.minter = minter
app.state.token_contract = token_contract

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
    prefix="/producer",
    tags=["producer"],
)


app.include_router(
    consumers.router,
    prefix="/consumer",
    tags=["consumer"],
)

app.include_router(
    histories.router,
    prefix="/histories",
    tags=["histories"],
)


app.include_router(
    subscriptions.router,
    prefix="/subscriptions",
    tags=["subscriptions"],
)
