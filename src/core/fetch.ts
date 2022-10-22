import { Extracts, type FetchOptions } from "./main";

type OptionalFetch = Partial<FetchOptions>;

class Fetch extends Extracts {
  get = async <TypeResult = any>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<TypeResult>(url, "GET", { ...prop });
  };

  put = async <TypeResult = any>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<TypeResult>(url, "PUT", { ...prop });
  };

  delete = async <TypeResult = any>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<TypeResult>(url, "DELETE", { ...prop });
  };

  patch = async <TypeResult = any>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<TypeResult>(url, "PATCH", { ...prop });
  };

  post = async <TypeResult = any>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<TypeResult>(url, "POST", { ...prop });
  };

  fetchText = async (url: string, prop?: OptionalFetch) => {
    return await this.fetch(url, "GET", { ...prop }).then(res => res.text());
  };

  fetchjson = async <TypeResult = any>(url: string, prop?: OptionalFetch) => {
    return await this.extracts<TypeResult>(url, "GET", { ...prop });
  };
}

export const ex = {
  ...new Fetch(),
};
