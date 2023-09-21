from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    telegram_bot_token: str = "..."
    api_url: str = "http://localhost:22512/v2"
    app_api_key: str = "..."


settings = Settings()
