import { fetchJSON } from "..";

async function withFetch() {
  const res = await fetchJSON<any[]>("https://jsonplaceholder.typicode.com/posts");

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
  test("works", async () => {
    const res = await withFetch();

    expect(Array.isArray(res)).toEqual(true);
    expect(res.length).toEqual(100);
  });
});
