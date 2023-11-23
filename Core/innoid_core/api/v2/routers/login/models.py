from pydantic import BaseModel


class SSOLoginURIRequest(BaseModel):
    redirect_uri: str
    context: dict


class SSOLoginURI(BaseModel):
    uri: str


class SSOLogin(BaseModel):
    authorization_code: str
    redirect_uri: str
    state: str


class AuthTokens(BaseModel):
    access_token: str
    refresh_token: str


class SSOLoginResult(BaseModel):
    tokens: AuthTokens
    context: dict


class RefreshTokenResult(BaseModel):
    tokens: AuthTokens
    success: bool
