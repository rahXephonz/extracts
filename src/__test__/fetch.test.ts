import { ex } from "..";

async function withFetch() {
  const res = await ex.get<Array<any>>("https://jsonplaceholder.typicode.com/users").then(res => res.json());
  const json = res;

  return json;
}

// This is the section where we mock `fetch`
const unmockedFetch = global.fetch;

beforeAll(() => {
  global.fetch = () =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    } as unknown as Promise<Response>);
});

afterAll(() => {
  global.fetch = unmockedFetch;
});

// This is actual testing suite
describe("withFetch", () => {
  test("it should be expect array from API", async () => {
    const res = await withFetch();

    expect(Array.isArray(res)).toEqual(true);
    expect(res.length).toEqual(10);
  });
});
