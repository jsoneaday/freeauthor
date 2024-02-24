import { BrowserProvider } from "ethers";
import { WebKwil, Utils, KwilSigner } from "@kwilteam/kwil-js";
import { formattedNow } from "../utils/DateTimeUtils";
import { GenericResponse } from "@kwilteam/kwil-js/dist/core/resreq";
import { TxReceipt } from "@kwilteam/kwil-js/dist/core/tx";
import { JsonRpcSigner } from "ethers";
import { Profile, Work } from "./ApiModels";
import { MsgReceipt } from "@kwilteam/kwil-js/dist/core/message";
import { IKwilApi } from "./IKwilApi";

const ADD_WORK: string = "add_work";
const GET_AUTHOR_WORKS: string = "get_author_works";
const ADD_PROFILE: string = "add_profile";

export class KwilApi implements IKwilApi {
  #provider: BrowserProvider | undefined;
  #signer: JsonRpcSigner | undefined;
  #address: string | undefined;
  Address() {
    return this.#address;
  }

  #kwil: WebKwil | undefined;
  #kwilSigner: KwilSigner | undefined;

  #dbid: string = "";
  #kwilProvider: string = "https://testnet.kwil.com";
  #chainId: string = "kwil-chain-testnet-0.6";

  async connect() {
    this.#provider = new BrowserProvider(window.ethereum);
    this.#signer = await this.#provider.getSigner();
    this.#address = await this.#signer.getAddress();

    this.#dbid = Utils.generateDBID(this.#address, "freeauthor");

    this.#kwil = new WebKwil({
      kwilProvider: this.#kwilProvider,
      chainId: this.#chainId,
    });
    this.#kwilSigner = new KwilSigner(this.#signer, this.#address);

    console.log("Connected with Eth address:", this.#address);
  }

  async addWork(title: string, content: string, authorId: number) {
    let id = await this.#getLastId("get_last_work_id");

    console.log("Send addWork authorId:", authorId);
    const actionBody = {
      dbid: this.#dbid,
      action: ADD_WORK,
      inputs: [
        {
          $work_id: id + 1,
          $updated_at: formattedNow(),
          $title: title,
          $content: content,
          $author_id: authorId,
        },
      ],
    };

    return this.#getResultHash(
      await this.#kwil!.execute(actionBody, this.#kwilSigner!)
    );
  }

  /// @ownerAddress you can pass the Address property for your own wallet
  async addProfile(
    userName: string,
    fullName: string,
    description: string,
    ownerAddress: string,
    socialLinkPrimary: string,
    socialLinkSecond: string
  ) {
    const profileId = await this.#getLastId("get_last_profile_id");

    console.log("Send addProfile updated_at:", formattedNow());
    console.log("Send addProfile owner_address:", this.#address);
    const actionBody = {
      dbid: this.#dbid,
      action: ADD_PROFILE,
      inputs: [
        {
          $profile_id: profileId + 1,
          $updated_at: formattedNow(),
          $username: userName,
          $fullname: fullName,
          $description: description,
          $owner_address: ownerAddress,
          $social_link_primary: socialLinkPrimary,
          $social_link_second: socialLinkSecond,
        },
      ],
    };

    return this.#getResultHash(
      await this.#kwil!.execute(actionBody, this.#kwilSigner!, true)
    );
  }

  async addFollow(followerId: number, followedId: number) {
    let id = await this.#getLastId("get_last_follow_id");

    const actionBody = {
      dbid: this.#dbid,
      action: "add_follow",
      inputs: [
        {
          $follow_id: id + 1,
          $updated_at: formattedNow(),
          $follower_id: followerId,
          $follwed_id: followedId,
        },
      ],
    };

    return this.#getResultHash(
      await this.#kwil!.execute(actionBody, this.#kwilSigner!)
    );
  }

  async addTopic(name: string) {
    let id = await this.#getLastId("get_last_topic_id");

    const actionBody = {
      dbid: this.#dbid,
      action: "add_topic",
      inputs: [
        {
          $topic_id: id + 1,
          $updated_at: formattedNow(),
          $name: name,
        },
      ],
    };

    return this.#getResultHash(
      await this.#kwil!.execute(actionBody, this.#kwilSigner!)
    );
  }

  async addWorkTopic(topicId: number, workId: number) {
    let id = await this.#getLastId("get_last_work_topic_id");

    const actionBody = {
      dbid: this.#dbid,
      action: "add_work_topic",
      inputs: [
        {
          $work_topic_id: id + 1,
          $updated_at: formattedNow(),
          $topic_id: topicId,
          $work_id: workId,
        },
      ],
    };

    return this.#getResultHash(
      await this.#kwil!.execute(actionBody, this.#kwilSigner!)
    );
  }

  async addWorkLikes(workId: number, likerId: number) {
    let id = await this.#getLastId("get_last_like_id");

    const actionBody = {
      dbid: this.#dbid,
      action: "add_work_likes",
      inputs: [
        {
          $work_like_id: id + 1,
          $updated_at: formattedNow(),
          $work_id: workId,
          $liker_id: likerId,
        },
      ],
    };

    return this.#getResultHash(
      await this.#kwil!.execute(actionBody, this.#kwilSigner!)
    );
  }

  async addWorkResponses(content: string, workId: number, responderId: number) {
    let id = await this.#getLastId("get_last_response_id");

    const actionBody = {
      dbid: this.#dbid,
      action: "add_work_responses",
      inputs: [
        {
          $work_response_id: id + 1,
          $updated_at: formattedNow(),
          $content: content,
          $work_id: workId,
          $responder_id: responderId,
        },
      ],
    };

    return this.#getResultHash(
      await this.#kwil!.execute(actionBody, this.#kwilSigner!)
    );
  }

  async cleanDb() {
    if (!this.#kwil) {
      await this.connect();
    }

    const actionBody = {
      dbid: this.#dbid,
      action: "clean_db",
      inputs: [],
    };

    return this.#getResultHash(
      await this.#kwil!.execute(actionBody, this.#kwilSigner!, true)
    );
  }

  async getAuthorWorks(authorId: number, lastKeyset: number, pageSize: number) {
    const actionBody = {
      dbid: this.#dbid,
      action: GET_AUTHOR_WORKS,
      inputs: [
        {
          $author_id: authorId,
          $last_keyset: lastKeyset,
          $page_size: pageSize,
        },
      ],
    };
    return this.#convertToWorks(await this.#kwil!.call(actionBody));
  }

  async getOwnersProfile() {
    const actionBody = {
      dbid: this.#dbid,
      action: "get_owners_profile",
      inputs: [],
    };
    const profiles = this.#convertToProfiles(
      await this.#kwil!.call(actionBody, this.#kwilSigner)
    );
    console.log("getOwnerProfile", profiles);
    return this.#getFirstItem(profiles);
  }

  async getFollwedProfiles(profileId: number) {
    const actionBody = {
      dbid: this.#dbid,
      action: "get_followed_profiles",
      inputs: [
        {
          $follower_id: profileId,
        },
      ],
    };

    return this.#convertToProfiles(
      await this.#kwil!.call(actionBody, this.#kwilSigner)
    );
  }

  /// todo: remove this function
  async getAllProfiles() {
    const actionBody = {
      dbid: this.#dbid,
      action: "get_all_profiles",
      inputs: [],
    };
    const res = await this.#kwil!.call(actionBody);
    if (res.status == 200) {
      console.log("getAllProfiles res.data?.result", res.data?.result);
      // todo: update with actual type
      return res.data?.result;
    }
    return null;
  }

  async txInfo(tx: string) {
    return await this.#kwil!.txInfo(tx);
  }

  /// Waits for tx to finish and gets id
  async waitAndGetId(tx: string | null | undefined) {
    let id = 0;
    let iterations = 0;
    while (id === 0) {
      if (iterations > 5)
        throw new Error("Transaction failed to process within time alotted");

      id = await this.#confirmTxCompleteAndGetEntityId(tx || "");

      await new Promise((r) => setTimeout(r, 3000));
      iterations += 1;
    }

    return id;
  }

  async #confirmTxCompleteAndGetEntityId(tx: string) {
    const result = await this.#kwil!.txInfo(tx);
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
                return inputsArray[0][0] as number;
              }
            }
          }
        }
      }
    }
    return 0;
  }

  #convertToProfiles(res: GenericResponse<MsgReceipt>) {
    if (res.status == 200) {
      if (Array.isArray(res.data?.result)) {
        return res.data.result.map((profile: Profile) => {
          return {
            id: profile.id,
            updated_at: profile.updated_at,
            username: profile.username,
            fullname: profile.fullname,
            description: profile.description,
            owner_address: profile.owner_address,
            social_link_primary: profile.social_link_primary,
            social_link_second: profile.social_link_second,
          } as Profile;
        });
      }
    }
    return null;
  }

  #convertToWorks(res: GenericResponse<MsgReceipt>) {
    if (res.status == 200) {
      if (Array.isArray(res.data?.result)) {
        return res.data.result.map((works: Work) => {
          return {
            id: works.id,
            updated_at: works.updated_at,
            title: works.title,
            content: works.content,
            author_id: works.author_id,
          } as Work;
        });
      }
    }
    return null;
  }

  #getFirstItem<T>(items: T[] | null) {
    if (Array.isArray(items)) {
      return items.length > 0 ? items[0] : null;
    }
    return null;
  }

  async #getResultHash(result: GenericResponse<TxReceipt>) {
    console.log("getResultHash result:", result);
    if (result.status === 200) {
      return result.data?.tx_hash;
    }
    return null;
  }

  async #getLastId(action: string) {
    let id = 0;
    const id_result = await this.#kwil!.call({
      dbid: this.#dbid,
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

export const kwilApi: IKwilApi = new KwilApi();
