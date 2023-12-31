from domain.modules.user_connection.telegram.entities import TelegramConnection
from .models import TelegramConnectionModel


class TelegramConnectionDataMapper:
    @staticmethod
    def model_to_entity(model: TelegramConnectionModel) -> TelegramConnection:
        return TelegramConnection(
            user_id=model.user_id,
            created=model.created,
            telegram_id=model.telegram_id,
            telegram_username=model.telegram_username,
        )

    @staticmethod
    def entity_to_model(entity: TelegramConnection) -> TelegramConnectionModel:
        return TelegramConnectionModel(
            user_id=entity.user_id,
            created=entity.created,
            telegram_id=entity.telegram_id,
            telegram_username=entity.telegram_username,
        )
