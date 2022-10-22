import { encode } from "qss";
import _fetch from "unfetch";

enum MethodKey {
  "GET",
  "PUT",
  "POST",
  "DELETE",
  "PATCH",
}

export interface FetchOptions {
  body: FormData;
  json: object;
  mode: string;
  params: object;
  headers: object;
  isPrivate: boolean;
  local: boolean;
  manualUrl: boolean;
}

interface Errors {
  status?: number;
  name?: string;
  json?: any;
  response?: {
    [k: string]: any;
  };
}

export interface UnfetchResponse<Res = any> {
  ok: boolean;
  statusText: string;
  status: number;
  url: string;
  text: () => Promise<string>;
  json: () => Promise<Res>;
  blob: () => Promise<Blob>;
  clone: () => UnfetchResponse<Res>;
}

export class Extracts {
  constructor(public urlApi = "", public isPrivate = false) {
    this.urlApi = urlApi;
    this.isPrivate = isPrivate;
  }

  getToken() {
    // your code in here how you get your token
  }

  setToken() {
    // your code in here how you set your token
  }

  private async ErrorResponse(err: Errors) {
    const msg = err as Errors;
    process.env.NODE_ENV === "development" && console.log("err", err);

    if (err instanceof Error) {
      // deal with network error / CORS error
      if (err.name === "TypeError" && err.message === "Failed to fetch") {
        console.error("Failed to get proper response from api server", err);
      }

      this.intercept500Error(err);
    }

    // get response
    if (typeof msg.json === "function") {
      const data = await msg.json();
      msg.response = { data };
    }

    if (typeof msg?.response?.json === "function") {
      const data = await msg.response.json();
      msg.response = { data };
    }

    return await Promise.reject(err);
  }

  private intercept500Error = async (err: Errors) => {
    if (err?.status === 500) {
      const customErr = {
        ...err,
        message: `We seem to be experiencing a problem right now. Try again later`,
      };
      await Promise.reject(customErr);
    }
  };

  protected fetch = async <TypeResult>(
    path = "/",
    method: keyof typeof MethodKey,
    { body, json, params, headers, manualUrl = false, isPrivate = this.isPrivate, ...opts }: Partial<FetchOptions> = {},
  ): Promise<UnfetchResponse<TypeResult>> => {
    const search = params ? encode(params, "?") : "";

    const url = manualUrl ? path : `${this.urlApi}${path}${search}`;

    if (isPrivate) this.getToken();

    try {
      const resp = await _fetch(url, {
        method,
        headers: {
          ...json,
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
        ...opts,
        body: body || (json ? JSON.stringify(json) : null),
      });

      if (!resp?.ok) return await Promise.reject(Error);

      return resp;
    } catch (err: unknown) {
      this.ErrorResponse(err);
    }
  };

  protected extracts = async <TypeResult>(
    path = "/",
    method: keyof typeof MethodKey,
    { body, json, params, headers, manualUrl = false, isPrivate = this.isPrivate, ...opts }: Partial<FetchOptions> = {},
  ): Promise<TypeResult> => {
    const search = params ? encode(params, "?") : "";

    const url = manualUrl ? path : `${this.urlApi}${path}${search}`;

    if (isPrivate) this.getToken();

    try {
      const resp = await _fetch(url, {
        method,
        headers: {
          ...(json && { "content-type": "application/json" }),
          Accept: "application/json",
          ...headers,
        },
        ...opts,
        body: body || (json ? JSON.stringify(json) : null),
      });

      if (resp?.statusText === "No Content") {
        // bypass when it is csrf-cookie request
        return await Promise.resolve({} as TypeResult);
      }

      let jsonBody = (await resp?.json()) as TypeResult;
      if (!resp?.ok) {
        return await Promise.reject(jsonBody);
      }

      let responseBody = {
        ...jsonBody,
      };

      if (Array.isArray(jsonBody)) {
        responseBody = [...jsonBody] as TypeResult;
      }

      return await Promise.resolve(responseBody);
    } catch (err) {
      this.ErrorResponse(err);
    }
  };
}
