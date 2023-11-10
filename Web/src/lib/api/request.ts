import axios from "axios";
import { API_URL } from "../config";
import { CallAPIError } from "./errors";

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

interface Request {
  method: RequestMethod;
  url: string;
  data?: object;
  headers?: object;
}

interface Response<ResponseDataSchema> {
  status: number;
  data: ResponseDataSchema;
}

async function makeAPIRequest<ResponseSchema>(
  requestData: Request,
  refresh_on_fail: boolean = true
): Promise<Response<ResponseSchema>> {
  try {
    const { status, data } = await axios.request<ResponseSchema>({
      method: requestData.method,
      baseURL: API_URL,
      url: requestData.url,
      data: requestData.data,
      headers: {
        // Authorization: "Bearer " + getAccessToken(),
        ...requestData.headers,
      },
      withCredentials: true,
    });
    return {
      status: status,
      data: data,
    };
  } catch (error: any) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 403 &&
      refresh_on_fail
    ) {
      await axios.request({
        method: RequestMethod.POST,
        baseURL: API_URL,
        url: "/login/refresh-tokens",
        withCredentials: true,
      });
      return makeAPIRequest<ResponseSchema>(requestData, false);
    } else {
      throw new CallAPIError();
    }
  }
}
export default makeAPIRequest;
