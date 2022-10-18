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

class Fetch extends Extracts {
  get = async <TypeResult, Props = any>(url: string, prop: Props) => {
    return await this.fetch<UnfetchResponse<TypeResult>>(url, "GET", { ...prop });
  };

  delete = async <TypeResult, Props = any>(url: string, prop: Props) => {
    return await this.fetch<UnfetchResponse<TypeResult>>(url, "DELETE", { ...prop });
  };
}

const fetch = new Fetch();

const gets = <TypeResult = any>(url: string, prop?: Partial<FetchOptions>) => {
  return fetch.get<TypeResult>(url, { ...prop });
};

const deletes = <TypeResult = any>(url: string, prop?: Partial<FetchOptions>) => {
  return fetch.delete<TypeResult>(url, { ...prop });
};

export { gets, deletes };

export default {
  gets,
  deletes,
};
