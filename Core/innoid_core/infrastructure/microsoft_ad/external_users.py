import base64
import json
from urllib.parse import quote_plus

import requests

from domain.external_users import IExternalUsers, ExternalUserInfo, OAuthResult
from settings import settings


class MSADExternalUsers(IExternalUsers):
    def get_oauth_login_uri(self, redirect_uri: str, context: dict) -> str:
        context_str = json.dumps(context)
        context_b64 = base64.b64encode(context_str.encode('utf-8')).decode('utf-8')
        uri = "https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize" \
              "?client_id={client_id}" \
              "&response_type=code" \
              "&redirect_uri={redirect_uri}" \
              "&domain_hint={domain_hint}" \
              "&response_mode=query&" \
              "scope=User.ReadBasic.All" \
              "&state={state}" \
            .format(client_id=settings.ms_ad_client_id,
                    redirect_uri=quote_plus(redirect_uri),
                    domain_hint=quote_plus(settings.ms_ad_domain_hint),
                    state=quote_plus(context_b64))
        return uri

    def get_oauth_user_info(self, code: str, state: str, redirect_uri: str) -> OAuthResult | None:
        context_str = base64.b64decode(state).decode('utf-8')
        context = json.loads(context_str)

        res = requests.post(
            "https://login.microsoftonline.com/organizations/oauth2/v2.0/token",
            data={
                "client_id": settings.ms_ad_client_id,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
                "client_secret": settings.ms_ad_client_secret,
                "code": code
            }
        )
        res_data = res.json()
        access_token = res_data.get("access_token", None)
        if not access_token:
            return None

        res = requests.get(
            "https://graph.microsoft.com/v1.0/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        res_data = res.json()
        return OAuthResult(
            context=context,
            user_info=ExternalUserInfo(
                email=res_data.get("mail", None),
                name=res_data.get("givenName", None),
                surname=res_data.get("surname", None),
                display_name=res_data.get("displayName", None),
                job=res_data.get("jobTitle", None)
            )
        )
