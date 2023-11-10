from fastapi import status

from api.v2.errors import ApiError


class NotAuthenticatedApiError(ApiError):
    error_message = "Not allowed"
    error_code = 0
    http_status_code = status.HTTP_401_UNAUTHORIZED


class InvalidIdCodeApiError(ApiError):
    error_message = "Invalid identification code"
    error_code = 0
    http_status_code = status.HTTP_401_UNAUTHORIZED


class ConnectionAlreadyExistsApiError(ApiError):
    error_message = "Connection already exists"
    error_code = 0
    http_status_code = status.HTTP_409_CONFLICT


class UserNotFoundApiError(ApiError):
    error_message = "User not found"
    error_code = 0
    http_status_code = status.HTTP_404_NOT_FOUND


class AppNotFoundApiError(ApiError):
    error_message = "App not found"
    error_code = 0
    http_status_code = status.HTTP_404_NOT_FOUND
