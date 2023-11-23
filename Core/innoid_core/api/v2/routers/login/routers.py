from typing import Annotated

from fastapi import APIRouter, Depends, Request, Response, Cookie
from starlette.datastructures import URL

from domain.errors import DomainError
from domain.modules.auth.jwt.usecases import AuthJWTUseCase
from domain.modules.login.sso.usecases import LoginSSOUseCase
from domain.modules.user.errors import UserNotFoundError
from domain.modules.user.usecases import UserUseCase
from settings import settings
from use_cases import get_auth_jwt_use_case
from use_cases import get_login_sso_use_case
from use_cases import get_user_use_case
from . import errors as api_errors
from . import models as api_models

login_router = APIRouter(prefix="/login", tags=["login"])


def set_tokens_cookies(
        response: Response,
        refresh_token_url: URL,
        access_token: str,
        refresh_token: str
):
    response.set_cookie(
        key=settings.jwt_access_token_name,
        value=access_token,
        httponly=True,
        secure=True,
        max_age=settings.jwt_refresh_token_expires_in
    )
    response.set_cookie(
        key=settings.jwt_refresh_token_name,
        value=refresh_token,
        httponly=True,
        secure=True,
        max_age=settings.jwt_refresh_token_expires_in,
        path=refresh_token_url.path
    )


def clear_tokens_cookies(response: Response, refresh_token_url: URL):
    response.delete_cookie(
        key=settings.jwt_access_token_name,
    )
    response.delete_cookie(
        key=settings.jwt_refresh_token_name,
        path=refresh_token_url.path
    )


@login_router.post("/refresh-tokens", response_model=api_models.RefreshTokenResult)
def refresh_tokens(
        request: Request,
        response: Response,
        auth_jwt_use_case: Annotated[AuthJWTUseCase, Depends(get_auth_jwt_use_case)],
        refresh_token: Annotated[str | None, Cookie(alias=settings.jwt_refresh_token_name)] = None
):
    try:
        tokens = auth_jwt_use_case.refresh_tokens(original_refresh_token=refresh_token)
    except DomainError:
        raise api_errors.IncorrectTokenApiError()

    set_tokens_cookies(
        response=response,
        refresh_token_url=request.url_for("refresh_tokens"),
        access_token=tokens.access_token,
        refresh_token=tokens.refresh_token
    )

    auth_tokens = api_models.AuthTokens(
        access_token=tokens.access_token,
        refresh_token=tokens.refresh_token,
    )
    refresh_token_result = api_models.RefreshTokenResult(
        auth_tokens=auth_tokens,
        success=True
    )

    return refresh_token_result


@login_router.post("/sso/uri", response_model=api_models.SSOLoginURI)
def get_sso_login_uri(
        login_sso_use_case: Annotated[LoginSSOUseCase, Depends(get_login_sso_use_case)],
        sso_login_uri_request: api_models.SSOLoginURIRequest,
):
    uri = login_sso_use_case.get_login_uri(
        redirect_uri=sso_login_uri_request.redirect_uri,
        context=sso_login_uri_request.context,
    )
    return api_models.SSOLoginURI(uri=uri)


@login_router.post("/sso/login", response_model=api_models.SSOLoginResult)
def login_with_sso(
        request: Request,
        response: Response,
        login_sso_use_case: Annotated[LoginSSOUseCase, Depends(get_login_sso_use_case)],
        auth_jwt_use_case: Annotated[AuthJWTUseCase, Depends(get_auth_jwt_use_case)],
        user_use_case: Annotated[UserUseCase, Depends(get_user_use_case)],
        sso_login: api_models.SSOLogin,
):
    sso_login_result = login_sso_use_case.get_user_info(
        code=sso_login.authorization_code,
        redirect_uri=sso_login.redirect_uri,
        state=sso_login.state,
    )

    try:
        user = user_use_case.get_by_email(email=sso_login_result.user_info.email)
    except UserNotFoundError:
        user = user_use_case.create(email=sso_login_result.user_info.email)

    tokens = auth_jwt_use_case.create_tokens(user_id=user.user_id)
    set_tokens_cookies(
        response=response,
        refresh_token_url=request.url_for("refresh_tokens"),
        access_token=tokens.access_token,
        refresh_token=tokens.refresh_token
    )

    auth_tokens = api_models.AuthTokens(
        access_token=tokens.access_token,
        refresh_token=tokens.refresh_token,
    )
    login_result = api_models.SSOLoginResult(
        auth_tokens=auth_tokens,
        context=sso_login_result.context,
    )
    return login_result


@login_router.post("/logout")
def logout(
        request: Request,
        response: Response,
):
    refresh_token_url = request.url_for("refresh_tokens")
    clear_tokens_cookies(response=response, refresh_token_url=refresh_token_url)
