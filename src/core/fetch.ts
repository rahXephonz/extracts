import { Extracts, FetchOptions } from "./main";

type UnfetchResponse<Res = never> = {
  ok: boolean;
  statusText: string;
  status: number;
  url: string;
  text: () => Promise<string>;
  json: () => Promise<Res>;
  blob: () => Promise<Blob>;
  clone: () => UnfetchResponse<Res>;
};

type PickText = Pick<UnfetchResponse, "text">;
type PickJSON<T> = Pick<UnfetchResponse<T>, "json">;

class Fetch extends Extracts {
  get = async <TypeResult, Props = any>(url: string, prop: Props) => {
    return await this.fetch<UnfetchResponse<TypeResult>>(url, "GET", { ...prop });
  };

  fetchText = async <Props = any>(url: string, prop: Props) => {
    return await this.fetch<PickText>(url, "GET", { ...prop }).then(res => res.text());
  };

  fetchJSON = async <TypeResult, Props = any>(url: string, prop: Props) => {
    return await this.fetch<PickJSON<TypeResult>>(url, "GET", { ...prop }).then(res => res.json());
  };

  delete = async <TypeResult, Props = any>(url: string, prop: Props) => {
    return await this.fetch<UnfetchResponse<TypeResult>>(url, "DELETE", { ...prop });
  };
}

const fetch = new Fetch();

const gets = <Res = any>(url: string, prop?: Partial<FetchOptions>) => {
  return fetch.get<Res>(url, { ...prop });
};

const fetchJSON = async <Res = any>(url: string, prop?: Partial<FetchOptions>) => {
  return fetch.fetchJSON<Res>(url, { ...prop });
};

const deletes = <Res = any>(url: string, prop?: Partial<FetchOptions>) => {
  return fetch.delete<Res>(url, { ...prop });
};

export { gets, deletes, fetchJSON };

export default {
  gets,
  deletes,
  fetchJSON,
};
