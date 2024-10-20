import { ContentType } from "./ContentType";
import { HttpStatusCode } from "./HttpStatusCode";
import { Method } from "./Method";
import { LightweightPayload, Payload, RequestOptions, Response } from "./types";

export class Request {
  static get<T>(
    endpoint: string,
    payload?: LightweightPayload
  ): Promise<Response<T>> {
    return Request.execute({ endpoint, method: Method.GET, ...payload });
  }

  static post<T>(
    endpoint: string,
    payload?: LightweightPayload
  ): Promise<Response<T>> {
    return Request.execute<T>({
      endpoint,
      method: Method.POST,
      ...payload,
    });
  }

  static put<T>(
    endpoint: string,
    payload?: LightweightPayload
  ): Promise<Response<T>> {
    return Request.execute({ endpoint, method: Method.PUT, ...payload });
  }

  static patch<T>(
    endpoint: string,
    payload?: LightweightPayload
  ): Promise<Response<T>> {
    return Request.execute({
      endpoint,
      method: Method.PATCH,
      ...payload,
    });
  }

  static delete<T>(
    endpoint: string,
    payload?: LightweightPayload
  ): Promise<Response<T>> {
    return Request.execute({
      endpoint,
      method: Method.DELETE,
      ...payload,
    });
  }

  private static async execute<T>(payload: Payload): Promise<Response<T>> {
    const { endpoint, method, body, query } = payload;

    const requestOptions: RequestOptions = {
      method: method,
      headers: { "Content-Type": "application/json" },
    };

    const session = localStorage.getItem("session");
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession && parsedSession.accessToken)
        requestOptions.headers.authorization = `Bearer ${parsedSession.accessToken}`;
    }

    if (body) requestOptions.body = JSON.stringify(body);

    let urlParams: string = "";
    if (query) {
      const queryParams: [string, any][] = [];
      for (const [key, value] of Object.entries(query)) {
        if (Array.isArray(value))
          value.forEach((item) => queryParams.push([`${key}[]`, item]));
        else queryParams.push([key, value]);
      }
      urlParams = `?${new URLSearchParams(queryParams)}`;
    }

    const data = await fetch(`${endpoint}${urlParams}`, requestOptions);

    if (data.status >= HttpStatusCode.BadRequest) {
      throw await data.json();
    }

    if (data.status === HttpStatusCode.NoContent) {
      return { data: null, error: null };
    }

    const contentType = data.headers.get("content-type");
    if (contentType === ContentType.JSON) {
      return {
        data: await data.json(),
        error: null,
      };
    } else {
      throw TypeError("Unexpected response type");
    }
  }
}
