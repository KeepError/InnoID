import uuid
from datetime import datetime
from domain.modules.access_permission.entities import UserField

from pydantic import BaseModel


class User(BaseModel):
    user_id: uuid.UUID
    email: str


class UserCreate(BaseModel):
    email: str


class UserAppCreate(BaseModel):
    name: str


class UserApp(BaseModel):
    id: uuid.UUID
    name: str


class UserTelegramConnection(BaseModel):
    created: datetime
    telegram_id: str


class UserIdCode(BaseModel):
    code: int


class AddAppAccessPermissions(BaseModel):
    app_id: uuid.UUID
    fields: list[UserField]


class DeleteAppAccessPermissions(BaseModel):
    app_id: uuid.UUID


class AppAccessPermissions(BaseModel):
    app_id: uuid.UUID
    fields: list[UserField]


class App(BaseModel):
    app_id: uuid.UUID
    name: str


class AppAccessPermissionsWithAppDetails(BaseModel):
    app: App
    fields: list[UserField]
