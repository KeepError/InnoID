import uuid

from domain.modules.app.usecases import AppUseCase
from domain.modules.role.entities import Role
from domain.modules.role.usecases import AppRoleUseCase


def get_service_user_uuid():
    return uuid.UUID("00000000-0000-0000-0000-000000000000")


def get_service_role():
    return Role.SERVICE


def get_service_app_id(
        app_role_use_case: AppRoleUseCase,
        app_use_case: AppUseCase,
        app_name: str
) -> uuid.UUID:
    for app_id in app_role_use_case.get_role_app_ids(get_service_role()):
        if app_use_case.get_by_id(app_id).name == app_name:
            return app_id
