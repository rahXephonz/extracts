<div align="center">
<h1 id="toc">⚡️ Extracts</h1>
<p>extracts your request API with type definitions</p>
</div>

<div align="center">

<!-- prettier-ignore-start -->

[![npm downloads](https://img.shields.io/npm/dw/extracts)](https://www.npmjs.com/package/extracts/v/latest)
[![License](https://img.shields.io/github/license/ioofy/extracts)](https://github.com/ioofy/extracts/blob/main/LICENSE)

<!-- prettier-ignore-end -->

</div>

## Usage

Run one of the following command inside your project directory to install the package:

    $ npm i extracts
    or
    $ yarn add extracts

### Single Fetch

<table>
<tr>
<td>Input</td>
<td>Output</td>
</tr>
<tr>
<td>

```typescript
// test with zod and React
import { ex } from "extracts";
import z from "zod";

const TypeUser = z.objects({
  id: z.number(),
  username: z.string(),
  name: z.string(),
});

type UserDatum = z.infer<typeof TypeUser>;

const [user, setUser] = useState<Array<UserDatum>>([]);

useEffect(() => {
  // this code will running as async
  (async function () {
    const res = await ex.fetchJSON<Array<UserDatum>>("https://jsonplaceholder.typicode.com/users");

    setUser(res);
  })();
}, []);
```

</td>

<td>

```typescript
// will be convert to
// but adding type definitions
const res = await fetch("https://jsonplaceholder.typicode.com/users").then(resp => resp.json);

// and in above example we assign into state ;)
setUser(res);
```

</td>
</tr>
</table>

### Fetching API with customize headers or authorization headers

```typescript
// cart-services
const { getToken } = getClientSideAuth();

const authHeaders: {
  "Content-Type": "application/json";
  Accept: "application/json";
  Authorization: `Bearer ${getToken}`;
  // .. other customizations
};

const getListCart = () => {
  const res = await ex.fetchJSON<Array<CartType>>("https://api.yourapp.com/v1/list-cart", {
    headers: { ...authHeaders },
  });

  return res;
};

const getVoucher = () => {
  // in here we didn't provide headers because default headers it was setup by default
  const res = await ex.fetchJSON<Array<VoucherType>>("https://api.yourapp.com/v1/get-voucher");

  return res;
};
```

### Extends Extracts into your service API

```typescript
import { Activities } from "@types/data";
import { Extracts } from "extracts";

export class CoreAPI extends Extracts {
  // override url and assign your api url, and assign this service
  // private is if services API is private and need a authorization
  // default url API is "/" and private false

  constructor() {
    super("/api/your-path");
  }

  // your logic API goes here when use token or not (isPrivate)

  getToken(): string {
    // somehow you get token
    const { token } = getClientAuth();

    return token;
  }

  setToken({ token }: { token: string }) {
    cookie.set("token", token, { expires: 7, path: "/" });
  }
}

class Activity extends CoreAPI {
  getDetailActivities = async (id: number) => {
    return await this.extracts<Activities>(`/activity-groups/${id}`, "GET");
  };

  deleteActivities = async (id: number) => {
    return await this.extracts(`/activity-groups/${id}`, "DELETE", {
      isPrivate: true,
    });
  };

  getAllActivities = async () => {
    return await this.extracts<{ data: Array<Activities> }>("/activity-groups?email=test@gmail.com", "GET");
  };

  createActivities = async (props: Activities) => {
    return await this.extracts("/activity-groups", "POST", {
      json: {
        ...props,
      },
    });
  };

  updateActivities = async (id: number, props: Activities) => {
    return await this.extracts(`/activity-groups/${id}`, "PATCH", {
      json: {
        ...props,
      },
    });
  };
}

class Auth extends CoreAPI {
  login = async ({ email, password }: { email: string; password: string }) => {
    const data = await this.extracts("/sign_in", "POST", {
      json: {
        email,
        password,
      },
    });

    if (data?.meta?.token) {
      this.setToken({
        token: data?.meta?.token,
      });
    }

    return data;
  };
}
```

And consume it into frontend application ❤

## License

[MIT](./LICENSE)
