import { BrowserProvider } from "ethers";
import { WebKwil, Utils, KwilSigner } from "@kwilteam/kwil-js";
import { formattedNow } from "../utils/DateTimeUtils";
const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const identifier = await signer.getAddress();

const dbid = Utils.generateDBID(identifier, "freeauthor");
const kwilProvider = "https://testnet.kwil.com";
const chainId = "kwil-chain-testnet-0.6";
const ADD_WORK = "add_work";
const GET_AUTHOR_WORKS = "get_author_works";
const ADD_PROFILE = "add_profile";
const GET_PROFILE = "get_profile";

const kwil = new WebKwil({
  kwilProvider,
  chainId,
});
const kwilSigner = new KwilSigner(signer, identifier);

export async function addWork(
  title: string,
  content: string,
  authorId: number
) {
  let workId = await getLastId("get_last_work_id");

  const actionBody = {
    dbid: dbid,
    action: ADD_WORK,
    inputs: [
      {
        $work_id: workId,
        $timestamp: Date.now() / 1000,
        $title: title,
        $content: content,
        $author_id: authorId,
      },
    ],
  };
  const result = await kwil.execute(actionBody, kwilSigner);
  console.log("addWorks result:", result);
  if (result.status == 200) {
    return result.data?.tx_hash;
  }
  return null;
}

export async function getAuthorWorks(
  authorId: number,
  lastKeyset: number,
  pageSize: number
) {
  const actionBody = {
    dbid: dbid,
    action: GET_AUTHOR_WORKS,
    inputs: [
      {
        $author_id: authorId,
        $last_keyset: lastKeyset,
        $page_size: pageSize,
      },
    ],
  };
  const res = await kwil.call(actionBody);
  if (res.status == 200) {
    return res.data?.result;
  }
  return null;
}

export async function addProfile(
  userName: string,
  fullName: string,
  description: string,
  socialLinkPrimary: string,
  socialLinkSecond: string
) {
  const profileId = await getLastId("get_last_profile_id");

  console.log("Sending addProfile with updated_at:", formattedNow());
  const actionBody = {
    dbid: dbid,
    action: ADD_PROFILE,
    inputs: [
      {
        $profile_id: profileId + 1,
        $updated_at: formattedNow(),
        $username: userName,
        $fullname: fullName,
        $description: description,
        $social_link_primary: socialLinkPrimary,
        $social_link_second: socialLinkSecond,
      },
    ],
  };
  const result = await kwil.execute(actionBody, kwilSigner);
  console.log("addProfile result:", result);
  if (result.status == 200) {
    return result.data?.tx_hash;
  }
  return null;
}

export async function txInfo(tx: string) {
  return await kwil.txInfo(tx);
}

async function getLastId(action: string) {
  let id = 0;
  const id_result = await kwil.call({
    dbid,
    action,
    inputs: [],
  });

  console.log("getLastId id_result:", id_result);
  if (id_result.status == 200) {
    if (id_result.data && id_result.data.result) {
      if (
        Array.isArray(id_result.data.result) &&
        id_result.data.result.length > 0
      ) {
        const result = id_result.data.result[0] as any;
        id = result["id"] ? result["id"] : 0;
      }
    } else {
      id = 0;
    }
  }
  console.log("getLastId id:", id);
  return id;
}
