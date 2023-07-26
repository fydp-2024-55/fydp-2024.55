import uuid

from fastapi_users import schemas


class UserRead(schemas.BaseUser[uuid.UUID]):
    eth_address: str


class UserCreate(schemas.BaseUserCreate):
    eth_address: str


class UserUpdate(schemas.BaseUserUpdate):
    eth_address: str
