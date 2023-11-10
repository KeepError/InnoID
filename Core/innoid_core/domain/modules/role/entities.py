import enum
import uuid
from dataclasses import dataclass


class Role(enum.Enum):
    ADMIN = "ADMIN"
    SERVICE = "SERVICE"
    USER = "USER"
    APP = "APP"


@dataclass
class UserRole:
    user_id: uuid.UUID
    role: Role


@dataclass
class AppRole:
    app_id: uuid.UUID
    role: Role
