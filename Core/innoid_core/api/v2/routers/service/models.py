import uuid
from datetime import datetime

from pydantic import BaseModel


class User(BaseModel):
    user_id: uuid.UUID
    email: str


class App(BaseModel):
    app_id: uuid.UUID
    name: str


class UserId(BaseModel):
    user_id: uuid.UUID
    context: dict = None


class UserCreate(BaseModel):
    email: str


class UserIdCode(BaseModel):
    code: int


class UserTelegramConnection(BaseModel):
    created: datetime
    user_id: uuid.UUID
    telegram_id: str
    telegram_username: str | None


class UserTelegramConnectionCreate(BaseModel):
    user_id: uuid.UUID
    telegram_id: str
    telegram_username: str | None
