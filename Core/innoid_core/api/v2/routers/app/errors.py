from fastapi import status

from api.v2.errors import ApiError


class AppNotFoundApiError(ApiError):
    error_message = "App not found"
    error_code = 0
    http_status_code = status.HTTP_404_NOT_FOUND


class NotAppOwnerApiError(ApiError):
    error_message = "You are not owner of this app"
    error_code = 0
    http_status_code = status.HTTP_403_FORBIDDEN
