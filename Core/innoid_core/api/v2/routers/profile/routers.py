from typing import Annotated

from fastapi import APIRouter, Depends

from api.v2.dependencies.auth import AuthContext, AuthContextProvider
from api.v2.dependencies.use_cases import (
    get_app_use_case,
    get_telegram_connection_use_case,
    get_user_code_identification_use_case
)
from domain.modules.app.usecases import AppUseCase
from domain.modules.code_identification.usecases import UserCodeIdentificationUseCase
from domain.modules.connection.telegram.errors import ConnectionNotFoundError
from domain.modules.connection.telegram.usecases import TelegramConnectionUseCase
from domain.modules.role.entities import Role
from . import errors as api_errors
from . import models as api_models

profile_router = APIRouter(prefix="/profile", tags=["profile"])


@profile_router.get("", response_model=api_models.User)
def get_current_active_user(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))]
):
    user = auth_context.user
    return api_models.User(user_id=user.user_id, email=user.email)


@profile_router.get("/apps", response_model=list[api_models.UserApp])
def get_user_apps(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        app_use_case: Annotated[AppUseCase, Depends(get_app_use_case)],
):
    apps = app_use_case.get_by_owner_id(owner_id=auth_context.user.user_id)
    return [api_models.UserApp(id=app.app_id, name=app.name) for app in apps]


@profile_router.post("/apps", response_model=api_models.UserApp)
def create_user_app(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        app_use_case: Annotated[AppUseCase, Depends(get_app_use_case)],
        app_create_model: api_models.UserAppCreate,
):
    app = app_use_case.create(name=app_create_model.name, owner_id=auth_context.user.user_id)
    return api_models.UserApp(id=app.app_id, name=app.name)


@profile_router.get("/connections/telegram", response_model=api_models.UserTelegramConnection)
def get_user_telegram_connection(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        telegram_connection_use_case: Annotated[TelegramConnectionUseCase, Depends(get_telegram_connection_use_case)],
):
    try:
        telegram_connection = telegram_connection_use_case.get_by_user_id(user_id=auth_context.user.user_id)
    except ConnectionNotFoundError:
        raise api_errors.ConnectionNotFoundError()
    return api_models.UserTelegramConnection(
        created=telegram_connection.created,
        telegram_id=telegram_connection.telegram_id
    )


@profile_router.post("/id_code", response_model=api_models.UserIdCode)
def create_user_id_code(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        user_code_identification_use_case: Annotated[
            UserCodeIdentificationUseCase, Depends(get_user_code_identification_use_case)],
):
    identification = user_code_identification_use_case.create(user_id=auth_context.user.user_id)
    return api_models.UserIdCode(code=identification.code)