import { Extracts, FetchOptions } from "./main";

class Fetch extends Extracts {
  get = async <TypeResult, Props = any>(url: string, prop: Props) => {
    return await this.fetch<TypeResult>(url, "GET", { ...prop });
  };

  delete = async <TypeResult, Props = any>(url: string, prop: Props) => {
    return await this.fetch<TypeResult>(url, "DELETE", { ...prop });
  };

  fetchText = async <Props = any>(url: string, prop: Props) => {
    return await this.fetch(url, "GET", { ...prop }).then(res => res.text());
  };

  fetchJSON = async <TypeResult, Props = any>(url: string, prop: Props) => {
    return await this.fetch<TypeResult>(url, "GET", { ...prop }).then(res => res.json());
  };
}

const fetch = new Fetch();

const gets = <Res = any>(url: string, prop?: Partial<FetchOptions>) => {
  return fetch.get<Res>(url, { ...prop });
};

const fetchJSON = <Res = any>(url: string, prop?: Partial<FetchOptions>) => {
  return fetch.fetchJSON<Res>(url, { ...prop });
};

const fetchText = (url: string, prop?: Partial<FetchOptions>) => {
  return fetch.fetchText(url, { ...prop });
};

const deletes = <Res = any>(url: string, prop?: Partial<FetchOptions>) => {
  return fetch.delete<Res>(url, { ...prop });
};

export { gets, deletes, fetchJSON, fetchText };

export default {
  gets,
  deletes,
  fetchJSON,
  fetchText,
};
