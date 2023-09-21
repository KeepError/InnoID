from argparse import Namespace

from cli.helpers import get_service_role, get_service_app_id
from use_cases import get_app_use_case, get_auth_api_key_use_case, get_app_role_use_case


def delete_service_app(args: Namespace):
    app_name = args.app_name

    app_use_case = next(get_app_use_case())
    auth_api_key_use_case = next(get_auth_api_key_use_case())
    app_role_use_case = next(get_app_role_use_case())

    service_role = get_service_role()

    service_app_id = get_service_app_id(app_role_use_case, app_use_case, app_name)
    if not service_app_id:
        print(f"Service app not exists")
        return

    app_use_case.delete(service_app_id)
    app_role_use_case.remove_role(service_app_id, service_role)
    auth_api_key_use_case.delete_api_key(service_app_id)
    print(f"App with ID {service_app_id} deleted")


def setup(subparsers):
    parser_delete_telegram_app = subparsers.add_parser(
        name='delete_service_app',
        help='Delete service app'
    )
    parser_delete_telegram_app.add_argument('app_name')
    parser_delete_telegram_app.set_defaults(func=delete_service_app)
