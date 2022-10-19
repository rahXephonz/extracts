import { Extracts, type FetchOptions } from "./main";

class Fetch extends Extracts {
  get = async <TypeResult, Props = any>(url: string, prop: Props) => {
    return await this.fetch<TypeResult>(url, "GET", { ...prop });
  };

  put = async <TypeResult, Props = any>(url: string, prop: Props) => {
    return await this.fetch<TypeResult>(url, "PUT", { ...prop });
  };

  delete = async <TypeResult, Props = any>(url: string, prop: Props) => {
    return await this.fetch<TypeResult>(url, "DELETE", { ...prop });
  };

  patch = async <TypeResult, Props = any>(url: string, prop: Props) => {
    return await this.fetch<TypeResult>(url, "PATCH", { ...prop });
  };

  post = async <TypeResult, Props = any>(url: string, prop: Props) => {
    return await this.fetch<TypeResult>(url, "POST", { ...prop });
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

const puts = <Res = any>(url: string, prop?: Partial<FetchOptions>) => {
  return fetch.get<Res>(url, { ...prop });
};

const deletes = <Res = any>(url: string, prop?: Partial<FetchOptions>) => {
  return fetch.delete<Res>(url, { ...prop });
};

const patchs = <Res = any>(url: string, prop?: Partial<FetchOptions>) => {
  return fetch.patch<Res>(url, { ...prop });
};

const posts = <Res = any>(url: string, prop?: Partial<FetchOptions>) => {
  return fetch.post<Res>(url, { ...prop });
};

const fetchJSON = <Res = any>(url: string, prop?: Partial<FetchOptions>) => {
  return fetch.fetchJSON<Res>(url, { ...prop });
};

const fetchText = (url: string, prop?: Partial<FetchOptions>) => {
  return fetch.fetchText(url, { ...prop });
};

export { gets, deletes, patchs, posts, fetchJSON, fetchText };

export default {
  gets,
  puts,
  patchs,
  posts,
  deletes,
  fetchJSON,
  fetchText,
};
