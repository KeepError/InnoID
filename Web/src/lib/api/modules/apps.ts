import makeAPIRequest, { RequestMethod } from "../request";
import { App } from "../entities";

interface GetUserAppsResponse {
  apps: App[];
}

export async function getUserApps(): Promise<GetUserAppsResponse> {
  interface APIResponse extends Array<App> {}

  const { data } = await makeAPIRequest<APIResponse>({
    method: RequestMethod.GET,
    url: "/apps",
  });
  return {
    apps: data.map((app) => ({
      app_id: app.app_id,
      name: app.name,
    })),
  };
}

interface GetAppResponse {
  app: App;
}

export async function getApp(app_id: string): Promise<GetAppResponse> {
  interface APIResponse extends App {}

  const { data } = await makeAPIRequest<APIResponse>({
    method: RequestMethod.GET,
    url: "/apps/" + app_id,
  });
  return {
    app: {
      app_id: data.app_id,
      name: data.name,
    },
  };
}

interface CreateAppResponse {
  app: App;
  api_key: string;
}

export async function createApp(name: string): Promise<CreateAppResponse> {
  interface APIResponse {
    app_id: string;
    name: string;
    owner_id: string;
    api_key: string;
  }

  const { data } = await makeAPIRequest<APIResponse>({
    method: RequestMethod.POST,
    url: "/apps",
    data: {
      name,
    },
  });
  return {
    app: {
      app_id: data.app_id,
      name: data.name,
    },
    api_key: data.api_key,
  };
}

export async function deleteApp(app_id: string): Promise<void> {
  await makeAPIRequest({
    method: RequestMethod.DELETE,
    url: "/apps/" + app_id,
  });
}

interface UpdateAppResponse {
  app: App;
}

export async function updateApp(
  app_id: string,
  name: string
): Promise<UpdateAppResponse> {
  interface APIResponse {
    app_id: string;
    name: string;
    owner_id: string;
  }

  const { data } = await makeAPIRequest<APIResponse>({
    method: RequestMethod.PUT,
    url: "/apps/" + app_id,
    data: {
      name: name,
    },
  });
  return {
    app: {
      app_id: data.app_id,
      name: data.name,
    },
  };
}

interface ResetAppApiKeyResponse {
  api_key: string;
}

export async function resetAppApiKey(
  app_id: string
): Promise<ResetAppApiKeyResponse> {
  interface APIResponse {
    app_id: string;
    name: string;
    owner_id: string;
    api_key: string;
  }

  const { data } = await makeAPIRequest<APIResponse>({
    method: RequestMethod.POST,
    url: "/apps/" + app_id + "/reset-api-key",
  });
  return {
    api_key: data.api_key,
  };
}
