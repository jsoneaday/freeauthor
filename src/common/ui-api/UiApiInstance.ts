import { UiApi } from "./UiApi";

const uiApi = new UiApi();
await uiApi.connect("");

export const api = uiApi;
