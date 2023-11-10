from argparse import Namespace

from cli.helpers import get_service_role
from use_cases import get_app_use_case, get_app_role_use_case


def get_service_apps(args: Namespace):
    app_use_case = next(get_app_use_case())
    app_role_use_case = next(get_app_role_use_case())

    service_role = get_service_role()
    service_apps_ids = app_role_use_case.get_role_app_ids(service_role)
    print("[app_id]: [app_name]")
    for service_app_id in service_apps_ids:
        app = app_use_case.get_by_id(service_app_id)
        print(f"{app.app_id}: {app.name}")


def setup(subparsers):
    parser_get_service_apps = subparsers.add_parser(
        name='get_service_apps',
        help='Get service apps'
    )
    parser_get_service_apps.set_defaults(func=get_service_apps)
