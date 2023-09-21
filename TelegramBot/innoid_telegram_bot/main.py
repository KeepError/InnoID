import asyncio

from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode

from routers.base import base_router
from settings import settings


async def on_startup(dispatcher: Dispatcher, bot: Bot):
    print("Bot started")


async def main():
    bot = Bot(token=settings.telegram_bot_token, parse_mode=ParseMode.HTML)
    dp = Dispatcher()
    dp.include_router(base_router)
    dp.startup.register(on_startup)

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
