import enum
import uuid
from dataclasses import dataclass
from datetime import datetime


class UserField(enum.Enum):
    USER_ID = "user_id"
    EMAIL = "email"


@dataclass
class AccessPermission:
    user_id: uuid.UUID
    app_id: uuid.UUID
    user_field: UserField
    created: datetime
