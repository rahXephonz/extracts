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

type UnfetchResponse<Res = any> = {
  ok: boolean;
  statusText: string;
  status: number;
  url: string;
  text: () => Promise<string>;
  json: () => Promise<Res>;
  blob: () => Promise<Blob>;
  clone: () => UnfetchResponse<Res>;
};

export class Extracts {
  protected fetch = async <TypeResult>(
    path = "/",
    method: keyof typeof MethodKey,
    { body, json, params, headers, manualUrl = true, ...opts }: Partial<FetchOptions> = {},
  ): Promise<UnfetchResponse<TypeResult>> => {
    const search = params ? encode(params, "?") : "";

    const url = manualUrl ? path : `${process.env.API_KEY}${path}${search}`;

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

    if (!resp?.ok) return await Promise.reject(Error);

    return resp;
  };
}
