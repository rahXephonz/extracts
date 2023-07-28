import { Extracts, type FetchOptions } from "./main";

type OptionalFetch = Partial<FetchOptions>;

class Fetch extends Extracts {
  get = async <R>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<R>(url, "GET", { ...prop });
  };

  put = async <R>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<R>(url, "PUT", { ...prop });
  };

  delete = async <R>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<R>(url, "DELETE", { ...prop });
  };

  patch = async <R>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<R>(url, "PATCH", { ...prop });
  };

  post = async <R>(url: string, prop?: OptionalFetch) => {
    return await this.fetch<R>(url, "POST", { ...prop });
  };
}

export const ex = {
  ...new Fetch(),
};
