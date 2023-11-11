import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.v1 import fastapi_app as fastapi_app_v1
from api.v2 import fastapi_app as fastapi_app_v2
from infrastructure.postgresql.database import setup_database
from settings import settings

setup_database()

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/v2", fastapi_app_v2.get_app())
app.mount("/api/v2", fastapi_app_v2.get_app())
app.mount("/v1", fastapi_app_v1.get_app())


def main():
    uvicorn.run("api.main:app", port=settings.serve_port, reload=True)
