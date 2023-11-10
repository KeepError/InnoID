from fastapi.applications import FastAPI

from api.v1.routers import users


def get_app() -> FastAPI:
    app = FastAPI()

    app.include_router(users.users_router)

    return app
