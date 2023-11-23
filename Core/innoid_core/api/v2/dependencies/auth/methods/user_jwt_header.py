from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPBearer

from use_cases import get_auth_jwt_use_case
from domain.errors import DomainError
from domain.modules.auth.jwt.usecases import AuthJWTUseCase
from ..common import AuthMethodResult


bearer_scheme = HTTPBearer()


def get_jwt_header_auth_result(
        auth_jwt_use_case: Annotated[AuthJWTUseCase, Depends(get_auth_jwt_use_case)],
        access_token: Annotated[str | None, Depends(bearer_scheme)]
) -> AuthMethodResult:
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
