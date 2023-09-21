import uuid
from typing import Annotated

from fastapi import APIRouter, Depends

from api.v2.dependencies.auth import AuthContext, AuthContextProvider
from domain.modules.app.errors import AppNotFoundError
from domain.modules.app.usecases import AppUseCase
from domain.modules.auth.api_key.usecases import AuthApiKeyUseCase
from domain.modules.role.entities import Role
from domain.modules.access_permission.usecases import AccessPermissionUseCase
from use_cases import get_app_use_case, get_auth_api_key_use_case, get_access_permission_use_case
from . import errors as api_errors
from . import models as api_models

apps_router = APIRouter(prefix="", tags=["apps"])


@apps_router.get("/apps/current", response_model=api_models.App)
def get_current_active_app(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.APP))]
):
    app = auth_context.app
    return api_models.App(app_id=app.app_id, name=app.name, owner_id=app.owner_id)


@apps_router.get("/apps", response_model=list[api_models.App])
def get_apps(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        app_use_case: Annotated[AppUseCase, Depends(get_app_use_case)],
):
    apps = app_use_case.get_by_owner_id(owner_id=auth_context.user.user_id)
    return [
        api_models.App(app_id=app.app_id, name=app.name, owner_id=app.owner_id)
        for app in apps
    ]


@apps_router.get("/apps/{app_id}", response_model=api_models.App)
def get_app(
        app_id: uuid.UUID,
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        app_use_case: Annotated[AppUseCase, Depends(get_app_use_case)],
):
    try:
        app = app_use_case.get_by_id(app_id=app_id)
    except AppNotFoundError:
        raise api_errors.AppNotFoundApiError()
    return api_models.App(app_id=app.app_id, name=app.name, owner_id=app.owner_id)


@apps_router.delete("/apps/{app_id}")
def delete_app(
        app_id: uuid.UUID,
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        app_use_case: Annotated[AppUseCase, Depends(get_app_use_case)],
        auth_api_key_use_case: Annotated[AuthApiKeyUseCase, Depends(get_auth_api_key_use_case)],
        access_permission_use_case: Annotated[AccessPermissionUseCase, Depends(get_access_permission_use_case)],
):
    try:
        app = app_use_case.get_by_id(app_id=app_id)
    except AppNotFoundError:
        raise api_errors.AppNotFoundApiError()
    if app.owner_id != auth_context.user.user_id:
        raise api_errors.NotAppOwnerApiError()
    auth_api_key_use_case.delete_api_key(app_id=app.app_id)
    access_permission_use_case.remove_app_permissions(app_id=app.app_id)
    app_use_case.delete(app_id=app.app_id)


@apps_router.put("/apps/{app_id}", response_model=api_models.App)
def update_app(
        app_id: uuid.UUID,
        app_update_model: api_models.AppUpdate,
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        app_use_case: Annotated[AppUseCase, Depends(get_app_use_case)],
):
    try:
        app = app_use_case.get_by_id(app_id=app_id)
    except AppNotFoundError:
        raise api_errors.AppNotFoundApiError()
    if app.owner_id != auth_context.user.user_id:
        raise api_errors.NotAppOwnerApiError()
    app = app_use_case.update(app_id=app.app_id, name=app_update_model.name)
    return api_models.App(app_id=app.app_id, name=app.name, owner_id=app.owner_id)


@apps_router.post("/apps", response_model=api_models.AppWithApiKey)
def create_app(
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        app_use_case: Annotated[AppUseCase, Depends(get_app_use_case)],
        auth_api_key_use_case: Annotated[AuthApiKeyUseCase, Depends(get_auth_api_key_use_case)],
        app_create_model: api_models.AppCreate,
):
    app = app_use_case.create(name=app_create_model.name, owner_id=auth_context.user.user_id)
    original_api_key = auth_api_key_use_case.create_api_key(app_id=app.app_id)
    return api_models.AppWithApiKey(app_id=app.app_id, name=app.name, owner_id=app.owner_id, api_key=original_api_key)


@apps_router.post("/apps/{app_id}/reset-api-key", response_model=api_models.AppWithApiKey)
def reset_app_api_key(
        app_id: uuid.UUID,
        auth_context: Annotated[AuthContext, Depends(AuthContextProvider(Role.USER))],
        app_use_case: Annotated[AppUseCase, Depends(get_app_use_case)],
        auth_api_key_use_case: Annotated[AuthApiKeyUseCase, Depends(get_auth_api_key_use_case)],
):
    try:
        app = app_use_case.get_by_id(app_id)
    except AppNotFoundError:
        raise api_errors.AppNotFoundApiError()
    if app.owner_id != auth_context.user.user_id:
        raise api_errors.NotAppOwnerApiError()
    original_api_key = auth_api_key_use_case.refresh_api_key(app_id=app.app_id)
    return api_models.AppWithApiKey(app_id=app.app_id, name=app.name, owner_id=app.owner_id, api_key=original_api_key)
