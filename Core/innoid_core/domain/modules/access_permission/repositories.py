import uuid
from abc import ABC, abstractmethod

from .entities import AccessPermission, UserField


class IAccessPermissionRepository(ABC):
    @abstractmethod
    def get_user_permissions(self, user_id: uuid.UUID) -> list[AccessPermission]:
        raise NotImplementedError

    @abstractmethod
    def get_permission(self, user_id: uuid.UUID, app_id: uuid.UUID, user_field: UserField) -> AccessPermission | None:
        raise NotImplementedError

    @abstractmethod
    def add(self, permission: AccessPermission) -> AccessPermission:
        raise NotImplementedError

    @abstractmethod
    def remove(self, user_id: uuid.UUID, app_id: uuid.UUID) -> list[AccessPermission]:
        raise NotImplementedError

    @abstractmethod
    def remove_by_app_id(self, app_id: uuid.UUID) -> list[AccessPermission]:
        raise NotImplementedError
