from fastapi import status

from api.v2.errors import ApiError


class UserNotFoundApiError(ApiError):
    error_message = "User not found"
    error_code = 0
    http_status_code = status.HTTP_404_NOT_FOUND
