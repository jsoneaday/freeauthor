import { BrowserProvider } from "ethers";
import { WebKwil, Utils, KwilSigner } from "@kwilteam/kwil-js";
import { formattedNow } from "../utils/DateTimeUtils";
import { GenericResponse } from "@kwilteam/kwil-js/dist/core/resreq";
import { TxReceipt } from "@kwilteam/kwil-js/dist/core/tx";
import { JsonRpcSigner } from "ethers";
import { Profile } from "./ApiModels";

const ADD_WORK: string = "add_work";
const GET_AUTHOR_WORKS: string = "get_author_works";
const ADD_PROFILE: string = "add_profile";

export class KwilApi {
  private provider: BrowserProvider | undefined;
  private signer: JsonRpcSigner | undefined;
  private address: string | undefined;
  Address() {
    return this.address;
  }

  private kwil: WebKwil | undefined;
  private kwilSigner: KwilSigner | undefined;

  private dbid: string = "";
  private kwilProvider: string = "https://testnet.kwil.com";
  private chainId: string = "kwil-chain-testnet-0.6";

  async connect() {
    this.provider = new BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    this.address = await this.signer.getAddress();
    console.log("Eth address:", this.address);

    this.dbid = Utils.generateDBID(this.address, "freeauthor");

    this.kwil = new WebKwil({
      kwilProvider: this.kwilProvider,
      chainId: this.chainId,
    });
    this.kwilSigner = new KwilSigner(this.signer, this.address);
  }

  async addWork(title: string, content: string, authorId: number) {
    let workId = await this.getLastId("get_last_work_id");

    console.log("Send addWork authorId:", authorId);
    const actionBody = {
      dbid: this.dbid,
      action: ADD_WORK,
      inputs: [
        {
          $work_id: workId + 1,
          $updated_at: formattedNow(),
          $title: title,
          $content: content,
          $author_id: authorId,
        },
      ],
    };

    return this.getResultHash(
      await this.kwil!.execute(actionBody, this.kwilSigner!)
    );
  }

  async cleanDb() {
    const actionBody = {
      dbid: this.dbid,
      action: "clean_db",
      inputs: [],
    };

    return this.getResultHash(
      await this.kwil!.execute(actionBody, this.kwilSigner!, true)
    );
  }

  async getAuthorWorks(authorId: number, lastKeyset: number, pageSize: number) {
    const actionBody = {
      dbid: this.dbid,
      action: GET_AUTHOR_WORKS,
      inputs: [
        {
          $author_id: authorId,
          $last_keyset: lastKeyset,
          $page_size: pageSize,
        },
      ],
    };
    const res = await this.kwil!.call(actionBody);
    if (res.status == 200) {
      // todo: update with actual type
      return res.data?.result;
    }
    return null;
  }

  async getOwnersProfile(): Promise<Profile | null> {
    const actionBody = {
      dbid: this.dbid,
      action: "get_owners_profile",
      inputs: [],
    };
    const res = await this.kwil!.call(actionBody, this.kwilSigner);
    if (res.status == 200) {
      console.log("getOwnersProfile res.data?.result", res.data?.result);
      if (Array.isArray(res.data?.result) && res.data.result.length > 0) {
        const ownerProfile = res.data.result[0];
        return {
          id: ownerProfile.id,
          updated_at: ownerProfile.updated_at,
          username: ownerProfile.username,
          fullname: ownerProfile.fullname,
          description: ownerProfile.description,
          owner_address: ownerProfile.owner_address,
          social_link_primary: ownerProfile.social_link_primary,
          social_link_second: ownerProfile.social_link_second,
        };
      }
    }
    return null;
  }

  async getAllProfiles() {
    const actionBody = {
      dbid: this.dbid,
      action: "get_all_profiles",
      inputs: [],
    };
    const res = await this.kwil!.call(actionBody);
    if (res.status == 200) {
      console.log("getAllProfiles res.data?.result", res.data?.result);
      // todo: update with actual type
      return res.data?.result;
    }
    return null;
  }

  async addProfile(
    userName: string,
    fullName: string,
    description: string,
    socialLinkPrimary: string,
    socialLinkSecond: string
  ) {
    const profileId = await this.getLastId("get_last_profile_id");

    console.log("Send addProfile updated_at:", formattedNow());
    console.log("Send addProfile owner_address:", this.address);
    const actionBody = {
      dbid: this.dbid,
      action: ADD_PROFILE,
      inputs: [
        {
          $profile_id: profileId + 1,
          $updated_at: formattedNow(),
          $username: userName,
          $fullname: fullName,
          $description: description,
          $owner_address: this.address!,
          $social_link_primary: socialLinkPrimary,
          $social_link_second: socialLinkSecond,
        },
      ],
    };

    return this.getResultHash(
      await this.kwil!.execute(actionBody, this.kwilSigner!, true)
    );
  }

  async txInfo(tx: string) {
    return await this.kwil!.txInfo(tx);
  }

  async confirmTxCompleteAndGetEntityId(tx: string) {
    const result = await this.kwil!.txInfo(tx);
    console.log("tx info:", result);
    if (result.status === 200) {
      if (result.data) {
        if (result.data.tx_result && result.data.tx_result.log === "success") {
          if (
            result.data.tx.body.payload &&
            result.data.tx.body.payload.length >= 3
          ) {
            const inputsArray = result.data.tx.body.payload[2];
            if (Array.isArray(inputsArray)) {
              if (Array.isArray(inputsArray[0])) {
                return inputsArray[0][0];
              }
            }
          }
        }
      }
    }
    return 0;
  }

  /// Waits for tx to finish and gets id
  async waitAndGetId(tx: string | null | undefined) {
    let id = 0;
    let iterations = 0;
    while (id === 0) {
      if (iterations > 5)
        throw new Error("Transaction failed to process within time alotted");

      id = await this.confirmTxCompleteAndGetEntityId(tx || "");

      await new Promise((r) => setTimeout(r, 3000));
      iterations += 1;
    }

    return id;
  }

  private async getResultHash(result: GenericResponse<TxReceipt>) {
    console.log("getResultHash result:", result);
    if (result.status === 200) {
      return result.data?.tx_hash;
    }
    return null;
  }

  private async getLastId(action: string) {
    let id = 0;
    const id_result = await this.kwil!.call({
      dbid: this.dbid,
      action,
      inputs: [],
    });

    console.log("getLastId id_result:", id_result);
    if (id_result.status === 200) {
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
}

export const kwilApi = new KwilApi();
