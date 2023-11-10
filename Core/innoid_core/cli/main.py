import argparse
import sys

from cli.commands import (
    get_service_apps,
    create_service_app,
    delete_service_app,
    refresh_service_app_api_key
)


def main():
    parser = argparse.ArgumentParser(description="Command-line interface")
    subparsers = parser.add_subparsers()

    get_service_apps.setup(subparsers)
    create_service_app.setup(subparsers)
    delete_service_app.setup(subparsers)
    refresh_service_app_api_key.setup(subparsers)

    args = parser.parse_args()
    args.func(args)
