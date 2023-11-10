from argparse import Namespace

from cli.helpers import get_service_app_id
from use_cases import get_app_use_case, get_auth_api_key_use_case, get_app_role_use_case


def refresh_service_app_api_key(args: Namespace):
    app_name = args.app_name

    app_use_case = next(get_app_use_case())
    auth_api_key_use_case = next(get_auth_api_key_use_case())
    app_role_use_case = next(get_app_role_use_case())

    service_app_id = get_service_app_id(app_role_use_case, app_use_case, app_name)
    if not service_app_id:
        print(f"Service app not exists")
        return

    api_key = auth_api_key_use_case.refresh_api_key(service_app_id)

    print(f"API key: {api_key}")


def setup(subparsers):
    parser_refresh_service_app_api_key = subparsers.add_parser(
        name='refresh_service_app_api_key',
        help='Refresh service app API key'
    )
    parser_refresh_service_app_api_key.add_argument('app_name')
    parser_refresh_service_app_api_key.set_defaults(func=refresh_service_app_api_key)
