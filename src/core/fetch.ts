import { Extracts, type FetchOptions } from "./main";

type OptionalFetch = Partial<Omit<FetchOptions, "isPrivate" | "manualUrl">>;

class Fetch {
  private ex: Extracts;

  constructor() {
    this.ex = new Extracts();
  }

  /**
   * Performs a GET request to the specified URL.
   *
   * @param url - The URL to send the GET request.
   * @param fetchOptions - Optional fetch options to customize the request.
   * @returns A promise that resolves to the response data.
   * @typeParam R - The type of the response data.
   */
  get = async <R>(url: string, fetchOptions?: OptionalFetch) => {
    return await this.ex.fetch<R>(url, "GET", { ...fetchOptions });
  };

  /**
   * Performs a PUT request to the specified URL.
   *
   * @param url - The URL to send the PUT request.
   * @param fetchOptions - Optional fetch options to customize the request.
   * @returns A promise that resolves to the response data.
   * @typeParam R - The type of the response data.
   */
  put = async <R>(url: string, fetchOptions?: OptionalFetch) => {
    return await this.ex.fetch<R>(url, "PUT", { ...fetchOptions });
  };

  /**
   * Performs a DELETE request to the specified URL.
   *
   * @param url - The URL to send the DELETE request.
   * @param fetchOptions - Optional fetch options to customize the request.
   * @returns A promise that resolves to the response data.
   * @typeParam R - The type of the response data.
   */
  delete = async <R>(url: string, fetchOptions?: OptionalFetch) => {
    return await this.ex.fetch<R>(url, "DELETE", { ...fetchOptions });
  };

  /**
   * Performs a PATCH request to the specified URL.
   *
   * @param url - The URL to send the PATCH request.
   * @param fetchOptions - Optional fetch options to customize the request.
   * @returns A promise that resolves to the response data.
   * @typeParam R - The type of the response data.
   */
  patch = async <R>(url: string, fetchOptions?: OptionalFetch) => {
    return await this.ex.fetch<R>(url, "PATCH", { ...fetchOptions });
  };

  /**
   * Performs a POST request to the specified URL.
   *
   * @param url - The URL to send the POST request.
   * @param fetchOptions - Optional fetch options to customize the request.
   * @returns A promise that resolves to the response data.
   * @typeParam R - The type of the response data.
   */
  post = async <R>(url: string, fetchOptions?: OptionalFetch) => {
    return await this.ex.fetch<R>(url, "POST", { ...fetchOptions });
  };
}

export const ex = { ...new Fetch() };
