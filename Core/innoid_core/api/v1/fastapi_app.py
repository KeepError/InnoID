from fastapi.applications import FastAPI

from api.v1.routers import login_router


def get_app() -> FastAPI:
    app = FastAPI()

    app.include_router(login_router)

    return app
