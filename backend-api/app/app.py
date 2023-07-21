from fastapi import FastAPI

from .routes import auth, consumers, histories, producers, subscriptions, users

app = FastAPI()

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
