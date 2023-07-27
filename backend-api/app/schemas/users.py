import uuid

from fastapi_users import schemas


class UserRead(schemas.BaseUser[uuid.UUID]):
    eth_address: str | None


class UserCreate(schemas.BaseUserCreate):
    eth_address: str | None


class UserUpdate(schemas.BaseUserUpdate):
    eth_address: str | None
