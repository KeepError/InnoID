from datetime import timezone

from domain.modules.access_permission.entities import AccessPermission
from .models import AccessPermissionModel


class AccessPermissionDataMapper:
    @staticmethod
    def model_to_entity(model: AccessPermissionModel) -> AccessPermission:
        return AccessPermission(
            user_id=model.user_id,
            app_id=model.app_id,
            user_field=model.user_field,
            created=model.created.replace(tzinfo=timezone.utc),
        )

    @staticmethod
    def entity_to_model(entity: AccessPermission) -> AccessPermissionModel:
        return AccessPermissionModel(
            user_id=entity.user_id,
            app_id=entity.app_id,
            user_field=entity.user_field,
            created=entity.created,
        )
