import uuid

from sqlalchemy.orm.session import Session

from domain.modules.access_permission.entities import AccessPermission
from domain.modules.access_permission.repositories import IAccessPermissionRepository
from .data_mappers import AccessPermissionDataMapper
from .models import AccessPermissionModel


class AccessPermissionRepository(IAccessPermissionRepository):
    session: Session

    def __init__(self, session: Session):
        self.session = session

    def get_user_permissions(self, user_id: uuid.UUID) -> list[AccessPermission]:
        permission_models = self.session.query(AccessPermissionModel).filter_by(user_id=user_id).all()
        return list(map(AccessPermissionDataMapper.model_to_entity, permission_models))

    def get_permission(self, user_id: uuid.UUID, app_id: uuid.UUID, user_field: str) -> AccessPermission | None:
        permission_model = self.session.query(AccessPermissionModel).filter_by(
            user_id=user_id,
            app_id=app_id,
            user_field=user_field,
        ).one_or_none()
        return AccessPermissionDataMapper.model_to_entity(permission_model) if permission_model else None

    def add(self, permission: AccessPermission) -> AccessPermission:
        permission_model = AccessPermissionDataMapper.entity_to_model(permission)
        self.session.add(permission_model)
        self.session.commit()
        return AccessPermissionDataMapper.model_to_entity(permission_model)

    def remove(self, user_id: uuid.UUID, app_id: uuid.UUID) -> list[AccessPermission]:
        permission_models = self.session.query(AccessPermissionModel).filter_by(
            user_id=user_id,
            app_id=app_id
        ).all()
        for permission_model in permission_models:
            self.session.delete(permission_model)
        self.session.commit()
        return list(map(AccessPermissionDataMapper.model_to_entity, permission_models))

    def remove_by_app_id(self, app_id: uuid.UUID) -> list[AccessPermission]:
        permission_models = self.session.query(AccessPermissionModel).filter_by(
            app_id=app_id
        ).all()
        for permission_model in permission_models:
            self.session.delete(permission_model)
        self.session.commit()
        return list(map(AccessPermissionDataMapper.model_to_entity, permission_models))
