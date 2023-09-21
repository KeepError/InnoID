import uuid
from dataclasses import dataclass
from datetime import datetime

from .entities import AccessPermission, UserField
from .repositories import IAccessPermissionRepository


@dataclass
class UserAppPermissions:
    app_id: uuid.UUID
    fields: list[UserField]


class AccessPermissionUseCase:
    permission_repository: IAccessPermissionRepository

    def __init__(self, permission_repository: IAccessPermissionRepository):
        self.permission_repository = permission_repository

    def get_user_apps_permissions(self, user_id: uuid.UUID) -> list[UserAppPermissions]:
        user_permissions = self.permission_repository.get_user_permissions(user_id)
        app_ids = set(user_permission.app_id for user_permission in user_permissions)
        return [
            UserAppPermissions(
                app_id=app_id,
                fields=[user_permission.user_field for user_permission in user_permissions
                        if user_permission.app_id == app_id],
            )
            for app_id in app_ids
        ]

    def get_user_permissions_for_app(self, user_id: uuid.UUID, app_id: uuid.UUID) -> list[UserField]:
        user_permissions = self.permission_repository.get_user_permissions(user_id)
        return [user_permission.user_field for user_permission in user_permissions if user_permission.app_id == app_id]

    def add_user_permissions_for_app(
            self, user_id: uuid.UUID, app_id: uuid.UUID, user_fields: list[UserField]
    ):
        for user_field in user_fields:
            if self.permission_repository.get_permission(user_id, app_id, user_field):
                continue
            permission = AccessPermission(
                user_id=user_id,
                app_id=app_id,
                user_field=user_field,
                created=datetime.now(),
            )
            self.permission_repository.add(permission)

    def remove_user_permissions_for_app(self, user_id: uuid.UUID, app_id: uuid.UUID):
        self.permission_repository.remove(user_id, app_id)

    def remove_app_permissions(self, app_id: uuid.UUID):
        self.permission_repository.remove_by_app_id(app_id)
