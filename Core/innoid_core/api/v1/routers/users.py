from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from api.v2.dependencies.auth import AuthContext, AuthContextProvider
from domain.modules.access_permission.usecases import AccessPermissionUseCase
from domain.modules.user.errors import UserNotFoundError
from domain.modules.user.usecases import UserUseCase
from domain.modules.user_connection.telegram.errors import ConnectionNotFoundError
from domain.modules.user_connection.telegram.usecases import TelegramConnectionUseCase
from use_cases import get_user_use_case, get_telegram_connection_use_case, get_access_permission_use_case


class UserInfo(BaseModel):
    is_authorized: bool


users_router = APIRouter(prefix="/users", tags=["users"])


@users_router.get("/telegram/{telegram_id}", response_model=UserInfo)
def get_user_by_telegram_id(
        telegram_id: str,
        user_use_case: Annotated[UserUseCase, Depends(get_user_use_case)],
        telegram_connection_use_case: Annotated[TelegramConnectionUseCase, Depends(get_telegram_connection_use_case)]
):
    try:
        telegram_connection = telegram_connection_use_case.get_by_telegram_id(telegram_id=telegram_id)
        user = user_use_case.get_by_id(user_id=telegram_connection.user_id)
        is_authorized = True
    except (ConnectionNotFoundError, UserNotFoundError):
        is_authorized = False
    return UserInfo(is_authorized=is_authorized)
