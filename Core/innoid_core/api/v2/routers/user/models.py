import uuid
from datetime import datetime

from pydantic import BaseModel


class User(BaseModel):
    user_id: uuid.UUID
    email: str
