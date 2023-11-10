import makeAPIRequest, { RequestMethod } from "../request";
import { User } from "../entities";

interface GetCurrentUserResponse {
  user: User;
}

export async function getCurrentUser(): Promise<GetCurrentUserResponse> {
  interface APIResponse {
    user_id: string;
    email: string;
  }

  const { data } = await makeAPIRequest<APIResponse>({
    method: RequestMethod.GET,
    url: "/profile",
  });
  return {
    user: {
      user_id: data.user_id,
      email: data.email,
    },
  };
}

interface GetUserTelegramConnectionResponse {
  created: string;
  telegram_id: string;
  telegram_username: string;
}

export async function getUserTelegramConnection(): Promise<GetUserTelegramConnectionResponse> {
  interface APIResponse {
    created: string;
    telegram_id: string;
    telegram_username: string;
  }

  const { data } = await makeAPIRequest<APIResponse>({
    method: RequestMethod.GET,
    url: "/profile/connections/telegram",
  });
  return {
    created: data.created,
    telegram_id: data.telegram_id,
    telegram_username: data.telegram_username,
  };
}

export async function deleteUserTelegramConnection(): Promise<void> {
  await makeAPIRequest({
    method: RequestMethod.DELETE,
    url: "/profile/connections/telegram",
  });
}

interface createUserIdCodeResponse {
  id_code: number;
}

export async function createUserIdCode(context: object): Promise<createUserIdCodeResponse> {
  interface APIResponse {
    code: number;
  }

  const { data } = await makeAPIRequest<APIResponse>({
    method: RequestMethod.POST,
    url: "/profile/id_code",
    data: {
      context: context,
    },
  });
  return {
    id_code: data.code,
  };
}

export interface getAccessPermissionsResponse {
  app_permissions: {
    app: {
      app_id: string;
      name: string;
    };
    fields: string[];
  }[];
}

export async function getAccessPermissions(): Promise<getAccessPermissionsResponse> {
  interface APIResponse {
    app: {
      app_id: string;
      name: string;
    };
    fields: string[];
  }

  const { data } = await makeAPIRequest<APIResponse[]>({
    method: RequestMethod.GET,
    url: "/profile/access_permissions",
  });
  return {
    app_permissions: data,
  };
}

export async function addAccessPermissions(
  app_id: string,
  fields: string[]
): Promise<void> {
  await makeAPIRequest({
    method: RequestMethod.POST,
    url: `/profile/access_permissions`,
    data: {
      app_id: app_id,
      fields: fields,
    },
  });
}

export async function removeAccessPermissions(app_id: string): Promise<void> {
  await makeAPIRequest({
    method: RequestMethod.DELETE,
    url: `/profile/access_permissions`,
    data: {
      app_id: app_id,
    },
  });
}
