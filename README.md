<div align="center">
<h1 id="toc">⚡️ Extracts</h1>
<p>extracts your request API with type definitions using fetch</p>
</div>

<div align="center">

<!-- prettier-ignore-start -->

[![npm downloads](https://img.shields.io/npm/dw/extracts)](https://www.npmjs.com/package/extracts/v/latest)
[![License](https://img.shields.io/github/license/ioofy/extracts)](https://github.com/ioofy/extracts/blob/main/LICENSE)

<!-- prettier-ignore-end -->

</div>

## Installation

```bash
npm install extracts-api
```

or

```bash
yarn add extracts-api
```

# Usage

## Class Approach

The package provides a class-based approach to interact with the API. You can create an instance of the main class, and then extend it for specific endpoints or functionalities.

```ts
import { Extracts } from "extracts-api";
import { UserLoginType, Users } from "./types";

class CoreAPI extends Extracts {
  private customGetToken() {
    // your token from client side auth or serverside auth
    const { token } = getToken();

    return `Bearer ${token}`;
  }

  constructor() {
    super({ baseURL: "https://api.example.com" });

    // Override for get method token
    this.getToken = this.customGetToken;
  }

  public setToken(token: string) {
    jsCookie.set("key", token, {
      expires: 7,
      path: "/",
      secure: true,
      sameSite: "Lax",
    });
  }
}

class UserAPI extends CoreAPI {
  // isPrivate API that need a token authorization Bearer
  getUsers = async () => {
    return await this.fetch<Users>("/users", "GET", { isPrivate: true });
  };

  // authorization
  login = async (data: UserLoginType) => {
    const res = await this.fetch<LoginResponse>("/auth/login", "POST", {
      json: { ...data },
    });

    if (res.data.token) {
      this.setToken(res.data.token);
    }

    return res;
  };
}

const userAPI = new UserAPI();

// get a users data
userAPI.getUsers().then(res => console.log(res));
```

## Function Approach

You can also use a function approach to interact with the API. This way, you can customize headers and options for individual API calls.

```ts
import { Extracts } from "extracts-api";
import { Users } from "./types";

const extracts = ({ isPrivate }: { isPrivate: boolean }) => {
  function getAuthToken() {
    const { token } = getToken();

    return `Bearer ${token}`;
  }

  const customHeaders = {
    Authorization: isPrivate ? `Bearer ${getAuthToken()}` : null,
  };

  // create a instance
  const instance = new Extracts({
    baseURL: "https://api.example.com",
    headers: customHeaders,
  });

  return instance;
};

export const userAPI = {
  getUsers: async () => {
    return extracts({ isPrivate: true }).fetch<Users>("/users", "GET");
  },
};
```

## Direct ex Usage

You can also use the ex instance provided by the package directly to make API calls.

```ts
import { ex } from "extracts-api";
import { Users } from "./types";

export async function getUsers() {
  const res = await ex.get<Users>("https://api.example.com");

  return res;
}
```

## API Reference

### Class: `Extracts`

The main class for interacting with the API.

#### Constructor: `new Extracts(options: ExtractsOptions)`

Create a new instance of the `Extracts` class.

- `options` (optional): An object containing configuration options for the instance.
  - `baseURL` (string, optional): The base URL for the API. Default is an empty string.
  - `headers` (object, optional): Custom headers to be included in every request. Default is an empty object.

#### Method: `fetch<T>(path: string, method: string, options?: FetchOptions): Promise<T>`

Make a fetch request to the API.

- `path` (string): The path of the API endpoint to be appended to the base URL.
- `method` (string): The HTTP method for the request (e.g., "GET", "POST", "PUT", etc.).
- `options` (optional): Additional options for the fetch request.
  - `body` (FormData | null | string, optional): The request body. Default is null.
  - `json` (object, optional): A JSON object to be sent as the request body.
  - `params` (object, optional): URL parameters to be included in the request URL.
  - `headers` (object, optional): Custom headers to be included in the request. These headers will override the instance's default headers.
  - `isPrivate` (boolean, optional): Set to true if the request requires authorization. Default is false.
  - `local` (boolean, optional): Set to true if the request should be made to a local endpoint. Default is false.
  - `manualUrl` (boolean, optional): Set to true if you want to manually provide the full request URL. Default is false.

#### Method: `getToken(): string`

Get the access token used for authorization. Override this method to provide custom token retrieval logic.

### Class: `CoreAPI extends Extracts`

An extended class for specific endpoints or functionalities.

#### Constructor: `new CoreAPI()`

Create a new instance of the `CoreAPI` class.

#### Method: `customGetToken(): string`

A custom method to retrieve the access token used for authorization. Override this method to provide custom token retrieval logic.

### Class: `Random extends CoreAPI`

An extended class for additional functionalities based on `CoreAPI`.

#### Method: `getUsers(): Promise<Users>`

Make a fetch request to get a list of users. This method uses the `fetch` method of the `CoreAPI` class.

### Function: `extracts(options: { isPrivate: boolean }): Extracts`

A function to create an instance of the `Extracts` class with custom headers.

- `options`: An object containing the options for customizing the instance.
  - `isPrivate` (boolean): Set to true if the request requires authorization.

Returns an instance of the `Extracts` class with custom headers based on the provided options.

### Global Variable: `ex`

An instance of the `Extracts` class with default options.

#### Method: `get<T>(url: string): Promise<T>`

Make a GET request to the specified URL using the default `ex` instance.

- `url` (string): The URL to make the GET request to.

Returns a promise that resolves to the response data.

## License

This project is licensed under the [MIT License](./LICENSE).
