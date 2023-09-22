import uuid
from typing import Annotated

from fastapi import APIRouter, Depends

from api.v2.dependencies.auth import AuthContext, AuthContextProvider
from domain.modules.app.errors import AppNotFoundError
from domain.modules.app.usecases import AppUseCase
from domain.modules.role.entities import Role
from domain.modules.user.errors import UserNotFoundError
from domain.modules.user.usecases import UserUseCase
from domain.modules.user_code_identification.errors import IdentificationNotFoundError
from domain.modules.user_code_identification.usecases import UserCodeIdentificationUseCase
from domain.modules.user_connection.telegram.errors import ConnectionAlreadyExistsError
from domain.modules.user_connection.telegram.usecases import TelegramConnectionUseCase
from use_cases import (
    get_telegram_connection_use_case,
    get_user_code_identification_use_case,
    get_user_use_case,
    get_app_use_case,
)
from . import errors as api_errors
from . import models as api_models

service_router = APIRouter(prefix="/service", tags=["service"])


@service_router.get("/user/{user_id}", response_model=api_models.User)
def get_user_by_id(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.SERVICE))],
        user_use_case: Annotated[UserUseCase, Depends(get_user_use_case)],
        user_id: uuid.UUID,
):
    try:
        user = user_use_case.get_by_id(user_id=user_id)
    except UserNotFoundError:
        raise api_errors.UserNotFoundApiError()
    return api_models.User(
        user_id=user.user_id,
        email=user.email,
    )


@service_router.get("/app/{app_id}", response_model=api_models.App)
def get_app_by_id(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.SERVICE))],
        app_use_case: Annotated[AppUseCase, Depends(get_app_use_case)],
        app_id: uuid.UUID,
):
    try:
        app = app_use_case.get_by_id(app_id=app_id)
    except AppNotFoundError:
        raise api_errors.AppNotFoundApiError()
    return api_models.App(
        app_id=app.app_id,
        name=app.name,
    )


@service_router.post("/user_id/code", response_model=api_models.UserId)
def get_user_id_by_id_code(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.SERVICE))],
        user_code_identification_use_case: Annotated[
            UserCodeIdentificationUseCase, Depends(get_user_code_identification_use_case)
        ],
        user_id_code: api_models.UserIdCode,
):
    try:
        user_identification = user_code_identification_use_case.get_by_code(code=user_id_code.code)
    except IdentificationNotFoundError:
        raise api_errors.InvalidIdCodeApiError()
    return api_models.UserId(user_id=user_identification.user_id, context=user_identification.context)


@service_router.post("/connections/telegram", response_model=api_models.UserTelegramConnection)
def create_telegram_connection(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.SERVICE))],
        telegram_connection_use_case: Annotated[TelegramConnectionUseCase, Depends(get_telegram_connection_use_case)],
        user_telegram_connection: api_models.UserTelegramConnectionCreate,
):
    try:
        telegram_connection = telegram_connection_use_case.create(
            user_id=user_telegram_connection.user_id,
            telegram_id=user_telegram_connection.telegram_id,
            telegram_username=user_telegram_connection.telegram_username,
        )
    except ConnectionAlreadyExistsError:
        raise api_errors.ConnectionAlreadyExistsApiError()
    return api_models.UserTelegramConnection(
        created=telegram_connection.created,
        user_id=telegram_connection.user_id,
        telegram_id=telegram_connection.telegram_id,
        telegram_username=telegram_connection.telegram_username,
    )
