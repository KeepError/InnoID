from typing import Iterator

from domain.api_key.usecases import AppApiKeyUseCase
from domain.app.usecases import AppUseCase
from domain.connection.usecases import TelegramConnectionUseCase
from domain.identity.usecases import SsoIdentityUseCase
from domain.user.usecases import UserUseCase
from infrastructure.postgresql.api_key.repositories import AppApiKeyRepository
from infrastructure.postgresql.app.repositories import AppRepository
from infrastructure.postgresql.connection.repositories import TelegramConnectionRepository
from infrastructure.postgresql.database import SessionLocal
from infrastructure.postgresql.user.repositories import UserRepository


def get_user_use_case() -> Iterator[UserUseCase]:
    session = SessionLocal()
    try:
        yield UserUseCase(UserRepository(session))
    finally:
        session.close()


def get_app_use_case() -> Iterator[AppUseCase]:
    session = SessionLocal()
    try:
        yield AppUseCase(AppRepository(session))
    finally:
        session.close()


def get_telegram_connection_use_case() -> Iterator[TelegramConnectionUseCase]:
    session = SessionLocal()
    try:
        yield TelegramConnectionUseCase(TelegramConnectionRepository(session))
    finally:
        session.close()


def get_sso_identity_use_case() -> Iterator[SsoIdentityUseCase]:
    yield SsoIdentityUseCase()


def get_app_api_key_use_case() -> Iterator[AppApiKeyUseCase]:
    session = SessionLocal()
    try:
        yield AppApiKeyUseCase(AppApiKeyRepository(session))
    finally:
        session.close()