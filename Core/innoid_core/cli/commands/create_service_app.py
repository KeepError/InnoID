from argparse import Namespace

from cli.helpers import get_service_user_uuid, get_service_role, get_service_app_id
from use_cases import get_app_use_case, get_auth_api_key_use_case, get_app_role_use_case


def create_service_app(args: Namespace):
    app_name = args.app_name

    app_use_case = next(get_app_use_case())
    auth_api_key_use_case = next(get_auth_api_key_use_case())
    app_role_use_case = next(get_app_role_use_case())

    service_role = get_service_role()

    service_app_id = get_service_app_id(app_role_use_case, app_use_case, app_name)
    if service_app_id:
        print(f"Service app already exists: {service_app_id}")
        return

    app = app_use_case.create(
        name=app_name,
        owner_id=get_service_user_uuid(),
    )
    app_role = app_role_use_case.add_role(app.app_id, service_role)
    api_key = auth_api_key_use_case.create_api_key(app.app_id)
    print(f"App with ID {app.app_id} created")
    print(f"It has {service_role} role")
    print(f"API key: {api_key}")


def setup(subparsers):
    parser_create_telegram_app = subparsers.add_parser(
        name='create_service_app',
        help='Create service app'
    )
    parser_create_telegram_app.add_argument('app_name')
    parser_create_telegram_app.set_defaults(func=create_service_app)
