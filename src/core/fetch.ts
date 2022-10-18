import { Extracts } from "./main";

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
  get = async <TypeResult>(url: string) => {
    return await this.fetch<UnfetchResponse<TypeResult>>(url, "GET");
  };

  delete = async (url: string) => {
    return await this.fetch<UnfetchResponse>(url, "DELETE");
  };
}

const fetch = new Fetch();

const gets = <TypeResult = any>(url: string) => fetch.get<TypeResult>(url);

const deletes = (url: string) => fetch.delete(url);

export { gets, deletes };

export default {
  gets,
  deletes,
};
