import uuid
from datetime import datetime
from typing import Union

from sqlalchemy import Column, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID

from domain.modules.access_permission.entities import UserField
from infrastructure.postgresql.database import Base


class AccessPermissionModel(Base):
    __tablename__ = "access_permissions"
    user_id: Union[uuid.UUID, Column] = Column(UUID(as_uuid=True), primary_key=True)
    app_id: Union[uuid.UUID, Column] = Column(UUID(as_uuid=True), primary_key=True)
    user_field: Union[UserField, Column] = Column(Enum(UserField), primary_key=True)
    created: Union[datetime, Column] = Column(DateTime(timezone=False), nullable=False)
