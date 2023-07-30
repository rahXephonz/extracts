import { Extracts, type FetchOptions } from "./main";

type OptionalFetch = Partial<Omit<FetchOptions, "isPrivate" | "manualUrl">>;

class Fetch {
  private ex: Extracts;

  constructor() {
    this.ex = new Extracts();
  }

  get = async <R>(url: string, fetchOptions?: OptionalFetch) => {
    return await this.ex.fetch<R>(url, "GET", { ...fetchOptions });
  };

  put = async <R>(url: string, fetchOptions?: OptionalFetch) => {
    return await this.ex.fetch<R>(url, "PUT", { ...fetchOptions });
  };

  delete = async <R>(url: string, fetchOptions?: OptionalFetch) => {
    return await this.ex.fetch<R>(url, "DELETE", { ...fetchOptions });
  };

  patch = async <R>(url: string, fetchOptions?: OptionalFetch) => {
    return await this.ex.fetch<R>(url, "PATCH", { ...fetchOptions });
  };

  post = async <R>(url: string, fetchOptions?: OptionalFetch) => {
    return await this.ex.fetch<R>(url, "POST", { ...fetchOptions });
  };
}

export const ex = { ...new Fetch() };
