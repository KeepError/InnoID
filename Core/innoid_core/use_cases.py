from typing import Iterator

from domain.modules.access_permission.usecases import AccessPermissionUseCase
from domain.modules.app.usecases import AppUseCase
from domain.modules.auth.api_key.usecases import AuthApiKeyUseCase
from domain.modules.auth.jwt.usecases import AuthJWTUseCase
from domain.modules.login.sso.usecases import LoginSSOUseCase
from domain.modules.role.usecases import UserRoleUseCase, AppRoleUseCase
from domain.modules.user.usecases import UserUseCase
from domain.modules.user_code_identification.usecases import UserCodeIdentificationUseCase
from domain.modules.user_connection.telegram.usecases import TelegramConnectionUseCase
from infrastructure.microsoft_ad.external_users import MSADExternalUsers
from infrastructure.postgresql.database import SessionLocal
from infrastructure.postgresql.modules.access_permission.repositories import AccessPermissionRepository
from infrastructure.postgresql.modules.app.repositories import AppRepository
from infrastructure.postgresql.modules.auth.api_key.repositories import ApiKeyRepository
from infrastructure.postgresql.modules.auth.jwt.repositories import JWTRefreshTokenRepository
from infrastructure.postgresql.modules.role.repositories import UserRoleRepository, AppRoleRepository
from infrastructure.postgresql.modules.user.repositories import UserRepository
from infrastructure.postgresql.modules.user_code_identification.repositories import UserCodeIdentificationRepository
from infrastructure.postgresql.modules.user_connection.telegram.repositories import TelegramConnectionRepository


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


def get_user_role_use_case() -> Iterator[UserRoleUseCase]:
    session = SessionLocal()
    try:
        yield UserRoleUseCase(UserRoleRepository(session))
    finally:
        session.close()


def get_app_role_use_case() -> Iterator[AppRoleUseCase]:
    session = SessionLocal()
    try:
        yield AppRoleUseCase(AppRoleRepository(session))
    finally:
        session.close()


def get_telegram_connection_use_case() -> Iterator[TelegramConnectionUseCase]:
    session = SessionLocal()
    try:
        yield TelegramConnectionUseCase(TelegramConnectionRepository(session))
    finally:
        session.close()


def get_auth_jwt_use_case() -> Iterator[AuthJWTUseCase]:
    session = SessionLocal()
    try:
        yield AuthJWTUseCase(JWTRefreshTokenRepository(session))
    finally:
        session.close()


def get_auth_api_key_use_case() -> Iterator[AuthApiKeyUseCase]:
    session = SessionLocal()
    try:
        yield AuthApiKeyUseCase(ApiKeyRepository(session))
    finally:
        session.close()


def get_user_code_identification_use_case() -> Iterator[UserCodeIdentificationUseCase]:
    session = SessionLocal()
    try:
        yield UserCodeIdentificationUseCase(UserCodeIdentificationRepository(session))
    finally:
        session.close()


def get_access_permission_use_case() -> Iterator[AccessPermissionUseCase]:
    session = SessionLocal()
    try:
        yield AccessPermissionUseCase(AccessPermissionRepository(session))
    finally:
        session.close()


def get_login_sso_use_case() -> Iterator[LoginSSOUseCase]:
    yield LoginSSOUseCase(MSADExternalUsers())
