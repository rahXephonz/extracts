import { encode } from "qss";

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
  params: object;
  headers: object;
  isPrivate: boolean;
  manualUrl: boolean;
}

interface CustomError {
  message: string;
}

export class Extracts {
  private baseUrl: string;
  private headers: FetchOptions["headers"];

  constructor(
    options: {
      baseURL: string;
      headers?: FetchOptions["headers"];
    } = { baseURL: "", headers: {} },
  ) {
    this.baseUrl = options.baseURL;
    this.headers = options.headers;
  }

  /**
   * Retrieves the authentication token.
   *
   * @returns The authentication token as a string.
   */
  getToken(): string {
    return "";
  }

  private intercept500Error = async (err: any) => {
    if (err?.status === 500) {
      const customErr: CustomError = {
        ...err,
        message: "Something went wrong on the server. Please try again later",
      };
      await Promise.reject(customErr);
    }
  };

  private intercept401Error = async (err: any) => {
    if (err?.status !== 401) return;
  };

  private getUrl = (params: object | undefined, path: string, manualUrl: boolean) => {
    const search = params ? encode(params, "?") : "";

    const url = manualUrl ? path : `${this.baseUrl}${path}${search}`;

    return url;
  };

  private async handleResponse<T>(resp: Response, method: string): Promise<T> {
    if (resp?.statusText === "No Content") {
      return {} as T;
    }

    const jsonBody = await resp?.json();

    let responseBody = { ...jsonBody };

    if (method !== "GET") {
      if (!resp?.ok) return Promise.reject(jsonBody);
    }

    if (Array.isArray(jsonBody)) {
      responseBody = [...jsonBody];
    }

    return Promise.resolve(responseBody);
  }

  private async handleNetworkError(err: any) {
    if (err.name === "TypeError" && err.message === "Failed to fetch") {
      console.error("failed to get proper response from api server", err);
    }

    this.intercept500Error(err);
    this.intercept401Error(err);

    if (typeof err.json === "function" || typeof err?.response?.json === "function") {
      const data = await err.json();
      err.response = { data };
    }

    return Promise.reject(err);
  }

  private async makeFetchRequest<T>(
    url: string,
    method: string,
    body: FormData | null | string,
    headers = this.headers,
  ): Promise<T> {
    try {
      const resp = await fetch(url, {
        method,
        headers: {
          ...(body && { "Content-Type": "application/json" }),
          Accept: "application/json",
          ...headers,
        },
        body: body ?? (typeof body === "string" ? body : null),
      });

      return await this.handleResponse<T>(resp, method);
    } catch (err: any) {
      return await this.handleNetworkError(err);
    }
  }

  /**
   * Sends a HTTP request to the specified path using the specified method.
   *
   * @param path - The path to send the request to. Defaults to "/" if not provided.
   * @param method - The HTTP method to use for the request. Allowed values are "GET", "POST", "PUT", "PATCH", and "DELETE".
   * @param options - Optional fetch options to customize the request.
   * @returns A promise that resolves to the response data.
   * @typeParam R - The type of the response data. Defaults to `any` if not provided.
   */
  fetch = async <R = any>(
    path = "/",
    method: keyof typeof MethodKey,
    {
      body,
      json,
      params,
      headers,
      isPrivate = false,
      manualUrl = false,
    }: Partial<FetchOptions> = {},
  ): Promise<R> => {
    const url = this.getUrl(params, path, manualUrl);

    if (isPrivate) {
      const token = this.getToken();

      if (token) {
        headers = {
          ...headers,
          Authorization: `${token}`,
        };
      }
    }

    const getJSON = json ? JSON.stringify(json) : null;

    return await this.makeFetchRequest<R>(url, method, body ?? getJSON, headers);
  };
}
