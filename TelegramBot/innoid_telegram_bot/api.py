from dataclasses import dataclass

import aiohttp

from settings import settings

BASE_URL = settings.api_url
HEADERS = {
    "X-API-Key": settings.app_api_key
}


class APIException(Exception):
    pass


async def get_user_by_id(user_id: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(
                url=f"{BASE_URL}/service/user/{user_id}",
                headers=HEADERS,
        ) as response:
            if response.status != 200:
                raise APIException()
            data = await response.json()
            return data


async def get_app_by_id(app_id: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(
                url=f"{BASE_URL}/service/app/{app_id}",
                headers=HEADERS,
        ) as response:
            if response.status != 200:
                raise APIException()
            data = await response.json()
            return data


@dataclass
class IdCodeResponse:
    user_id: str
    context: dict


async def get_user_id_by_id_code(id_code: int) -> IdCodeResponse:
    async with aiohttp.ClientSession() as session:
        async with session.post(
                url=f"{BASE_URL}/service/user_id/code",
                headers=HEADERS,
                json={
                    "code": id_code,
                },
        ) as response:
            if response.status != 200:
                raise APIException()
            data = await response.json()
            user_id = data.get("user_id", None)
            context = data.get("context", None)
            return IdCodeResponse(user_id=user_id, context=context)


async def create_connection(user_id: str, telegram_id: str) -> None:
    async with aiohttp.ClientSession() as session:
        async with session.post(
                url=f"{BASE_URL}/service/connections/telegram",
                headers=HEADERS,
                json={
                    "user_id": user_id,
                    "telegram_id": telegram_id,
                },
        ) as response:
            if response.status != 200:
                raise APIException()
