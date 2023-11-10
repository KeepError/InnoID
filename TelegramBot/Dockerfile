FROM python:3.11.4-slim-bullseye AS production

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /source/
RUN pip install poetry
COPY poetry.lock pyproject.toml /source/
RUN poetry config virtualenvs.create false && poetry install

COPY . /source/

ENV PYTHONPATH=/source/innoid_telegram_bot

ENTRYPOINT ["python", "main_telegram_bot.py"]
