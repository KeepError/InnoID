from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from domain.errors import DomainError
from domain.modules.auth.jwt.usecases import AuthJWTUseCase
from use_cases import get_auth_jwt_use_case
from ..common import AuthMethodResult

bearer_scheme = HTTPBearer(auto_error=False)


def get_user_jwt_header_auth_result(
        auth_jwt_use_case: Annotated[AuthJWTUseCase, Depends(get_auth_jwt_use_case)],
        access_token: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)]
) -> AuthMethodResult:
    access_token = access_token.credentials if access_token else None
    user_id = None
    if access_token:
        try:
            user_id = auth_jwt_use_case.authenticate_user(access_token)
        except DomainError:
            pass
    return AuthMethodResult(
        user_id=user_id,
        app_id=None,
    )
