FROM node:18.3.0 AS builder
WORKDIR /app

ARG VITE_API_URL
ARG VITE_WEB_ROOT_URL
ARG VITE_TELEGRAM_BOT_URL

COPY . /app
RUN npm ci
RUN npm run build

FROM nginx
COPY nginx_config/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html