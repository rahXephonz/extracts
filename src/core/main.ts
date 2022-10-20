import { encode } from "qss";
import type { UnfetchResponse } from "./fetch";
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

export class Extracts {
  constructor(public url = "/", public isPrivate = false) {
    this.url = url;
    this.isPrivate = isPrivate;
  }

  getToken() {
    // your code in here how you get your token
  }

  setToken() {
    // your code in here how you set your token
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

  fetch = async <TypeResult>(
    path = this.url,
    method: keyof typeof MethodKey,
    { body, json, params, headers, manualUrl = false, isPrivate = this.isPrivate, ...opts }: Partial<FetchOptions> = {},
  ): Promise<UnfetchResponse<TypeResult>> => {
    const search = params ? encode(params, "?") : "";

    const url = manualUrl ? path : `${path}${search}`;

    if (isPrivate) {
      this.getToken();
    }

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
  };
}
