from domain.errors import DomainError


class ConnectionNotFoundError(DomainError):
    pass


class ConnectionAlreadyExistsError(DomainError):
    pass
