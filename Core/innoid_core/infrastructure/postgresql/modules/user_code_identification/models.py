import uuid
from datetime import datetime
from typing import Union

from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB

from infrastructure.postgresql.database import Base


class UserCodeIdentificationModel(Base):
    __tablename__ = "user_identifications"
    identification_id: Union[uuid.UUID, Column] = Column(UUID(as_uuid=True), primary_key=True)
    user_id: Union[uuid.UUID, Column] = Column(UUID(as_uuid=True), nullable=False)
    created: Union[datetime, Column] = Column(DateTime(timezone=False), nullable=False)
    code: Union[int, Column] = Column(Integer, nullable=False)
    context: Union[dict, Column] = Column(JSONB)
