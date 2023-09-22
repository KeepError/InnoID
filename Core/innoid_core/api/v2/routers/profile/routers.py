from typing import Annotated

from fastapi import APIRouter, Depends

from api.v2.dependencies.auth import AuthContext, AuthContextProvider
from domain.modules.access_permission.usecases import AccessPermissionUseCase
from domain.modules.app.usecases import AppUseCase
from domain.modules.role.entities import Role
from domain.modules.user_code_identification.usecases import UserCodeIdentificationUseCase
from domain.modules.user_connection.telegram.errors import ConnectionNotFoundError
from domain.modules.user_connection.telegram.usecases import TelegramConnectionUseCase
from use_cases import (
    get_telegram_connection_use_case,
    get_user_code_identification_use_case,
    get_access_permission_use_case, get_app_use_case
)
from . import errors as api_errors
from . import models as api_models

profile_router = APIRouter(prefix="/profile", tags=["profile"])


@profile_router.get("", response_model=api_models.User)
def get_current_active_user(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))]
):
    user = auth_context.user
    return api_models.User(user_id=user.user_id, email=user.email)


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


@profile_router.delete("/connections/telegram", response_model=api_models.UserTelegramConnection)
def delete_user_telegram_connection(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        telegram_connection_use_case: Annotated[TelegramConnectionUseCase, Depends(get_telegram_connection_use_case)],
):
    try:
        telegram_connection = telegram_connection_use_case.delete(user_id=auth_context.user.user_id)
    except ConnectionNotFoundError:
        raise api_errors.ConnectionNotFoundError()
    return api_models.UserTelegramConnection(
        created=telegram_connection.created,
        telegram_id=telegram_connection.telegram_id
    )


@profile_router.post("/id_code", response_model=api_models.UserIdCode)
def create_user_id_code(
        user_id_code_request: api_models.UserIdCodeRequest,
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        user_code_identification_use_case: Annotated[
            UserCodeIdentificationUseCase, Depends(get_user_code_identification_use_case)],
):
    identification = user_code_identification_use_case.create(
        user_id=auth_context.user.user_id,
        context=user_id_code_request.context
    )
    return api_models.UserIdCode(code=identification.code)


@profile_router.get("/access_permissions", response_model=list[api_models.AppAccessPermissionsWithAppDetails])
def get_access_permissions(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        access_permission_use_case: Annotated[
            AccessPermissionUseCase, Depends(get_access_permission_use_case)],
        app_use_case: Annotated[AppUseCase, Depends(get_app_use_case)],
):
    user_app_permissions = access_permission_use_case.get_user_apps_permissions(
        user_id=auth_context.user.user_id
    )
    result = []
    for user_app_permission in user_app_permissions:
        app = app_use_case.get_by_id(user_app_permission.app_id)
        result.append(
            api_models.AppAccessPermissionsWithAppDetails(
                app=api_models.App(app_id=app.app_id, name=app.name),
                fields=user_app_permission.fields
            )
        )
    return result


@profile_router.post("/access_permissions", response_model=api_models.AppAccessPermissions)
def add_access_permissions(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        access_permission_use_case: Annotated[
            AccessPermissionUseCase, Depends(get_access_permission_use_case)],
        add_access_permissions_model: api_models.AddAppAccessPermissions,
):
    access_permission_use_case.add_user_permissions_for_app(
        user_id=auth_context.user.user_id,
        app_id=add_access_permissions_model.app_id,
        user_fields=add_access_permissions_model.fields,
    )

    user_app_permissions = access_permission_use_case.get_user_permissions_for_app(
        user_id=auth_context.user.user_id,
        app_id=add_access_permissions_model.app_id,
    )
    return api_models.AppAccessPermissions(
        app_id=add_access_permissions_model.app_id,
        fields=user_app_permissions
    )


@profile_router.delete("/access_permissions", response_model=api_models.AppAccessPermissions)
def remove_access_permissions(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        access_permission_use_case: Annotated[
            AccessPermissionUseCase, Depends(get_access_permission_use_case)],
        remove_access_permissions_model: api_models.DeleteAppAccessPermissions,
):
    access_permission_use_case.remove_user_permissions_for_app(
        user_id=auth_context.user.user_id,
        app_id=remove_access_permissions_model.app_id,
    )

    user_app_permissions = access_permission_use_case.get_user_permissions_for_app(
        user_id=auth_context.user.user_id,
        app_id=remove_access_permissions_model.app_id,
    )
    return api_models.AppAccessPermissions(
        app_id=remove_access_permissions_model.app_id,
        fields=user_app_permissions
    )
