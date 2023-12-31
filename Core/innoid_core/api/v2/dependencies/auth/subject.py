from dataclasses import dataclass
from typing import Annotated

from fastapi import Depends

from domain.modules.app.entities import App
from domain.modules.app.usecases import AppUseCase
from domain.modules.user.entities import User
from domain.modules.user.usecases import UserUseCase
from .common import AuthMethodResult
from .methods.app_api_key import get_app_api_key_auth_result
from .methods.user_jwt_cookie import get_user_jwt_cookie_auth_result
from .methods.user_jwt_header import get_user_jwt_header_auth_result
from use_cases import get_user_use_case, get_app_use_case


@dataclass
class AuthenticationSubject:
    user: User | None
    app: App | None


def get_authentication_subject(
        jwt_cookie_auth_result: Annotated[AuthMethodResult, Depends(get_user_jwt_cookie_auth_result)],
        jwt_header_auth_result: Annotated[AuthMethodResult, Depends(get_user_jwt_header_auth_result)],
        api_key_auth_result: Annotated[AuthMethodResult, Depends(get_app_api_key_auth_result)],
        user_use_case: Annotated[UserUseCase, Depends(get_user_use_case)],
        app_use_case: Annotated[AppUseCase, Depends(get_app_use_case)],
) -> AuthenticationSubject:
    user_id = None
    app_id = None
    for auth_result in (
            jwt_cookie_auth_result,
            jwt_header_auth_result,
            api_key_auth_result
    ):
        user_id = user_id or auth_result.user_id
        app_id = app_id or auth_result.app_id
    return AuthenticationSubject(
        user=user_use_case.get_by_id(user_id) if user_id else None,
        app=app_use_case.get_by_id(app_id) if app_id else None,
    )
