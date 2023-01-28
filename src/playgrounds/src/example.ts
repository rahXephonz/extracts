import { Extracts, ex } from "../..";

const setCookie = (kuki: string) => kuki;

export class CoreAPI extends Extracts {
  constructor() {
    super("https://api.yourapi.com");
  }

  getToken(): string {
    return "";
  }
}

class Random extends CoreAPI {
  getCartList = async () => {
    return await this.extracts<Array<any>>("/cat/carts/cartlist", "GET", {
      isPrivate: true,
    });
  };

  getProductList = async () => {
    const data = await this.extracts<any>("/cat/product?page=1&per_page=10", "GET");

    return data;
  };
}

const getDataUser = async () => {
  const data = await ex.get("https://jsonplaceholder.typicode.com/users");

  return await data.json();
};

const getDataJsonUser = async () => {
  const data = await ex.fetchjson("https://jsonplaceholder.typicode.com/users");

  return await data;
};

getDataJsonUser().then(res => console.log("fromjson", res));
getDataUser().then(res => console.log("from get", res));
