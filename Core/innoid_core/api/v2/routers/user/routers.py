from typing import Annotated

from fastapi import APIRouter, Depends

from api.v2.dependencies.auth import AuthContext, AuthContextProvider
from domain.modules.access_permission.usecases import AccessPermissionUseCase
from domain.modules.user.errors import UserNotFoundError
from domain.modules.user.usecases import UserUseCase
from domain.modules.user_connection.telegram.errors import ConnectionNotFoundError
from domain.modules.user_connection.telegram.usecases import TelegramConnectionUseCase
from use_cases import get_user_use_case, get_telegram_connection_use_case, get_access_permission_use_case
from . import errors as api_errors
from . import models as api_models

users_router = APIRouter(prefix="/users", tags=["users"])


@users_router.get("/telegram/{telegram_id}")
def get_user_by_telegram_id(
        telegram_id: str,
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider())],
        user_use_case: Annotated[UserUseCase, Depends(get_user_use_case)],
        telegram_connection_use_case: Annotated[TelegramConnectionUseCase, Depends(get_telegram_connection_use_case)],
        access_permission_use_case: Annotated[AccessPermissionUseCase, Depends(get_access_permission_use_case)]
):
    app = auth_context.app
    try:
        telegram_connection = telegram_connection_use_case.get_by_telegram_id(telegram_id=telegram_id)
    except ConnectionNotFoundError:
        raise api_errors.UserNotFoundApiError()
    try:
        user = user_use_case.get_by_id(user_id=telegram_connection.user_id)
    except UserNotFoundError:
        raise api_errors.UserNotFoundApiError()
    include_fields: set[str] = set()
    if app:
        include_fields.update(
            user_field.value
            for user_field in access_permission_use_case.get_user_permissions_for_app(
                user_id=user.user_id, app_id=app.app_id
            )
        )
    return api_models.User(user_id=user.user_id, email=user.email).model_dump(include=include_fields)
