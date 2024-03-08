import { IKwilApi } from "./IKwilApi";
import { KwilApi } from "./KwilApi";

async function getKwilApiInstance(): Promise<IKwilApi> {
  // import { FakeKwilApi } from "./FakeKwilApi";
  // if (import.meta.env.DEV) {
  //   return new FakeKwilApi("0xE7DCCAE2d95A1cB1E30E07477207065A9EDf6D38");
  // }

  const kwilApi: IKwilApi = new KwilApi();
  await kwilApi.connect();
  return kwilApi;
}

export const kwilApi = await getKwilApiInstance();
