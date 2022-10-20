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
// test with zod
import { fetchJSON } from "extracts";
import z from "zod";

const TypeUser = z.objects({
  id: z.number(),
  username: z.string(),
  name: z.string(),
});

type UserDatum = z.infer<typeof TypeUser>;

const res = async () => {
  return await fetchJSON<UserDatum[]>("https://jsonplaceholder.typicode.com/users");
};
```

</td>

<td>

```typescript
const showData = () => {
  if (res) {
    // type definitions will be added
    const user = res.map(item => item);
    return JSON.stringify(user);
  }
};
```

</td>
</tr>
</table>

### Extends Extracts into your service API

```typescript
import { Activities } from "@types/data";
import { Extracts } from "extracts";

class Activity extends Extracts {
  getDetailActivities = async (id: number) => {
    return await this.fetch<Activities>(`/activity-groups/${id}`, "GET");
  };

  deleteActivities = async (id: number) => {
    return await this.fetch(`/activity-groups/${id}`, "DELETE");
  };

  getAllActivities = async () => {
    return await this.fetch<{ data: Activities[] }>("/activity-groups?email=mynev.id@gmail.com", "GET");
  };

  createActivities = async (props: Activities) => {
    return await this.fetch("/activity-groups", "POST", {
      json: {
        ...props,
      },
    });
  };

  updateActivities = async (id: number, props: Activities) => {
    return await this.fetch(`/activity-groups/${id}`, "PATCH", {
      json: {
        ...props,
      },
    });
  };
}
```

And consume it into frontend application ❤

## License

[MIT](./LICENSE)
