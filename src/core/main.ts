import { encode } from "qss";
import _fetch from "unfetch";

enum MethodKey {
  "GET",
  "PUT",
  "POST",
  "DELETE",
  "PATCH",
}

interface FetchOptions {
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
  private intercept500Error = async (err: Errors) => {
    if (err?.status === 500) {
      const customErr = {
        ...err,
        message: `We seem to be experiencing a problem right now. Please wait a few minutes to try again.`,
      };
      await Promise.reject(customErr);
    }
  };

  protected fetch = async <TypeResult>(
    path = "/",
    method: keyof typeof MethodKey = "GET",
    { body, json, params, headers, manualUrl = false, ...opts }: Partial<FetchOptions> = {},
  ): Promise<TypeResult> => {
    const search = params ? encode(params, "?") : "";

    const url = manualUrl ? path : `${process.env.API_KEY}${path}${search}`;

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
        // credentials: 'include', // disabled
      });

      if (resp?.statusText === "No Content") {
        // bypass when it is csrf-cookie request
        return await Promise.resolve({} as TypeResult);
      }

      const jsonBody = await resp?.json();

      if (!resp?.ok) {
        return await Promise.reject(jsonBody);
      }

      let responseBody = {
        ...jsonBody,
      };

      if (Array.isArray(jsonBody)) {
        responseBody = [...jsonBody];
      }

      return await Promise.resolve(responseBody);
    } catch (err: unknown) {
      const msg = err as Errors;
      process.env.NODE_ENV === "development" && console.log("err", err);

      if (err instanceof Error) {
        // deal with network error / CORS error
        if (err.name === "TypeError" && err.message === "Failed to fetch") {
          console.error("failed to get proper response from api server", err);
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
