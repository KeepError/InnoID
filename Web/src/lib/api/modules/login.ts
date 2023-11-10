import makeAPIRequest, { RequestMethod } from "../request";

interface GetSSOLoginURLResponse {
  loginURL: string;
}

export async function getSSOLoginURL(redirect_uri: string, context: object): Promise<GetSSOLoginURLResponse> {
  interface APIResponse {
    uri: string;
  }

  const { data } = await makeAPIRequest<APIResponse>({
    method: RequestMethod.POST,
    url: "/login/sso/uri",
    data: {
      redirect_uri: redirect_uri,
      context: context,
    },
  }, false);
  return {
    loginURL: data.uri,
  };
}

interface LoginWithSSOResponse {
  // tokens: Tokens;
  loginContext: object;
}

export async function loginWithSSO(
  redirect_uri: string,
  authorization_code: string,
  state: string
): Promise<LoginWithSSOResponse> {
  interface APIResponse {
    // tokens: Tokens;
    context: object;
  }

  const { data } = await makeAPIRequest<APIResponse>({
    method: RequestMethod.POST,
    url: "/login/sso/login",
    data: {
      authorization_code: authorization_code,
      redirect_uri: redirect_uri,
      state: state,
    },
  }, false);

  // setAccessToken(data.tokens.access_token);
  // setRefreshToken(data.tokens.refresh_token);
  return {
    // tokens: data.tokens,
    loginContext: data.context,
  };
}

export async function logout(): Promise<void> {
  await makeAPIRequest({
    method: RequestMethod.POST,
    url: "/login/logout",
  }, false);
}
