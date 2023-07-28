import { ex } from "..";

async function withFetch() {
  const res = await ex.get<Array<any>>("https://jsonplaceholder.typicode.com/users");

  return res;
}

// Mockup the API
beforeAll(() => {
  global.fetch = () =>
    Promise.resolve({
      json: () => Promise.resolve([{ id: 1, name: "John" }]),
    } as unknown as Promise<Response>);
});

// This is actual testing suite
describe("withFetch", () => {
  test("it should be expect array from API", async () => {
    const res = await withFetch();

    expect(Array.isArray(res)).toEqual(true);
    expect(res.length).toEqual(1);
    expect(res[0]).toEqual({ id: 1, name: "John" });
  });
});
