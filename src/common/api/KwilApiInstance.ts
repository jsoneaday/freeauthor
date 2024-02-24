import { IKwilApi } from "./IKwilApi";
// import { KwilApi } from "./KwilApi";
import { FakeKwilApi } from "./FakeKwilApi";

// export const kwilApi: IKwilApi = new KwilApi();
export const kwilApi: IKwilApi = new FakeKwilApi(
  "0xE7DCCAE2d95A1cB1E30E07477207065A9EDf6D38"
);
