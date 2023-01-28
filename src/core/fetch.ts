import { Extracts, type FetchOptions } from "./main";

type OptionalFetch = Partial<FetchOptions>;

class Fetch extends Extracts {
  get = async <TypeResult = any>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<TypeResult>("GET", { ...prop }, url);
  };

  put = async <TypeResult = any>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<TypeResult>("PUT", { ...prop }, url);
  };

  delete = async <TypeResult = any>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<TypeResult>("DELETE", { ...prop }, url);
  };

  patch = async <TypeResult = any>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<TypeResult>("PATCH", { ...prop }, url);
  };

  post = async <TypeResult = any>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<TypeResult>("POST", { ...prop }, url);
  };

  fetchText = async (url: string, prop?: OptionalFetch) => {
    return await this.fetch("GET", { ...prop }, url).then(res => res.text());
  };

  fetchjson = async <TypeResult = any>(url: string, prop?: OptionalFetch) => {
    return await this.extracts<TypeResult>("GET", { ...prop }, url);
  };
}

export const ex = {
  ...new Fetch(),
};
