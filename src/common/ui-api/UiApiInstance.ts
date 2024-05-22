import { IApi } from "../api/IApi";
import { UiApi } from "./UiApi";

let uiApi: UiApi;

/// always returns same instance
export async function initOrGetUiApi(apiObj: IApi, walletProvider: object) {
  if (!uiApi) {
    uiApi = new UiApi(apiObj, walletProvider);
  }
  return uiApi;
}
