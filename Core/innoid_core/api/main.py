import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.v2 import fastapi_app as fastapi_app_v2
from infrastructure.postgresql.database import setup_database
from settings import settings

setup_database()

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/v2", fastapi_app_v2.get_app())


def main():
    uvicorn.run("api.main:app", port=settings.serve_port, reload=True)
