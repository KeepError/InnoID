import json

from aiogram import Router
from aiogram.filters import CommandStart, CommandObject
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton

import api

base_router = Router()


@base_router.message(CommandStart(deep_link=True, deep_link_encoded=True))
async def cmd_start(message: Message, command: CommandObject):
    await message.answer(
        f"Hello! This is bot to help you connect your InnoID account to Telegram."
    )

    try:
        data = json.loads(command.args)
    except json.JSONDecodeError:
        await message.answer("Failed to decode data.")
        return
    id_code = data.get("idCode", None)
    app_id = data.get("appId", None)
    redirect_to = data.get("redirect", None)

    if not id_code:
        await message.answer("Not enough data to create connection.")
        return

    try:
        user_id = await api.get_user_id_by_id_code(id_code)
    except api.APIException:
        await message.answer("Failed to identify InnoID account.")
        return

    try:
        await api.create_connection(user_id, str(message.from_user.id))
    except api.APIException:
        await message.answer("Failed to create connection.")
        return

    try:
        user = await api.get_user_by_id(user_id)
    except api.APIException:
        user = None

    try:
        app = await api.get_app_by_id(app_id)
    except api.APIException:
        app = None

    reply_app_name = app["name"] if app else "an app"
    reply_markup = None
    if redirect_to:
        reply_markup = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text=f"Return to {reply_app_name}", url=redirect_to)]
        ])

    user_info = f" ({user['email']})" if user else ""
    reply_text = f"Your InnoID account{user_info} is now connected to Telegram!"

    if not redirect_to:
        reply_text += f"\nYou can now return to {reply_app_name}."

    await message.answer(reply_text, reply_markup=reply_markup)
