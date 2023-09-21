from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    serve_port: int = 22512

    postgres_connection_string: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/innoid_core"

    jwt_secret_key: str = "secret_key"
    jwt_access_token_name: str = "access_token"
    jwt_access_token_expires_in: int = 60 * 30  # seconds
    jwt_refresh_token_name: str = "refresh_token"
    jwt_refresh_token_expires_in: int = 60 * 60 * 24 * 30  # seconds

    ms_ad_client_id: str = "..."
    ms_ad_client_secret: str = "..."
    ms_ad_domain_hint: str = "domain.com"


settings = Settings()
