import {
  Avatar,
  BaseTags,
  ProfileModel,
  FreeAuthQueryResponse,
  Tag,
  TopicModel,
  Work,
  WorkResponseModel,
  WorkTopicModel,
  WorkWithAuthorModel,
  QueryResponse,
} from "./ApiModels";
import { IApi, TxHashPromise } from "./IApi";
import { WebIrys, NodeIrys } from "@irys/sdk";
import Query from "@irys/query";
import { RPC_URL, TOKEN, TX_METADATA_URL } from "../Env";
import { readFileSync } from "fs";
import bs58 from "bs58";

const DESC = "DESC";
//const ASC = "ASC";
const SEARCH_TX = "irys:transactions";

export class IrysApi implements IApi {
  #irys?: WebIrys | NodeIrys;
  get #Irys() {
    if (!this.#irys) throw new Error("#webIrys is not set yet!");
    return this.#irys;
  }
  #query?: Query;
  get #Query() {
    if (!this.#query) throw new Error("#query is not set yet!");
    return this.#query;
  }
  #address?: string;
  get Address() {
    if (!this.#address) throw new Error("#address is not set yet!");
    return this.#address;
  }
  #network = "devnet";
  #token = "solana";
  #wallet?: { rpcUrl: string; name: string; provider: object };

  async isConnected(): Promise<boolean> {
    return this.#irys ? true : false;
  }

  /// if no walletProvider assumed wallet coming from file
  async connect(walletProvider?: object): Promise<void> {
    if (walletProvider) {
      this.#wallet = {
        rpcUrl: RPC_URL,
        name: TOKEN,
        provider: walletProvider,
      };
      const webIrys = new WebIrys({
        network: this.#network,
        token: this.#token,
        wallet: this.#wallet,
      });
      this.#irys = await webIrys.ready();
    } else {
      const keyBuffer = Uint8Array.from(
        JSON.parse(import.meta.env.VITE_SOLANA_KEY)
      );
      const key = bs58.encode(keyBuffer);

      const irys = new NodeIrys({
        network: this.#network,
        token: this.#token,
        key,
        config: {
          providerUrl: RPC_URL,
        },
      });
      this.#irys = await irys.ready();
    }

    this.#address = this.#irys.address;

    this.#query = new Query({ network: this.#network });
  }

  async #fundText(content: string) {
    const contentSize = this.#getByteSizeOfString(content);
    const fundingAmount = await this.#Irys.getPrice(contentSize);
    console.log("funding needed:", fundingAmount);
    await this.#Irys.fund(fundingAmount);
  }

  async #fundFile(file: File) {
    await this.#Irys.fund(await this.#Irys.getPrice(file.size));
  }

  async #fundFileBuffer(file: Buffer) {
    await this.#Irys.fund(await this.#Irys.getPrice(file.byteLength));
  }

  #getByteSizeOfString(content: string): number {
    const encoder = new TextEncoder();
    const encodedString = encoder.encode(content);
    return encodedString.length;
  }

  async #uploadText(content: string, tags: Tag[]): TxHashPromise {
    await this.#fundText(content);

    return await this.#Irys.upload(content, {
      tags: [...BaseTags, ...tags],
    });
  }

  async #uploadFile(file: File | string, tags: Tag[]): TxHashPromise {
    if (typeof file == "string") {
      return await this.#uploadFileFromPath(file, tags);
    }
    await this.#fundFile(file);
    return await (this.#Irys as WebIrys).uploadFile(file, {
      tags: [...BaseTags, ...tags],
    });
  }

  async #uploadFileFromPath(path: string, tags: Tag[]): TxHashPromise {
    const file = readFileSync(path);
    await this.#fundFileBuffer(file);
    return await (this.#Irys as NodeIrys).uploadFile(path, {
      tags: [...BaseTags, ...tags],
    });
  }

  async #confirmEntityOwner(
    _txId: string,
    _verificationAddress: string
  ): Promise<boolean> {
    const result = await fetch(TX_METADATA_URL);
    if (result.ok) {
      const txMeta = await result.json();
      console.log("txMeta", txMeta);
      return true;
    }
    return false;
  }

  async getData(entityTxId: string): Promise<null | string | ArrayBuffer> {
    const response = await fetch(`IRYS_DATA_URL/${entityTxId}`);

    if (response.ok) {
      const contentType = response.headers.get("Content-Type");
      if (contentType === "text/plain" || contentType === "application/json") {
        return await response.text();
      }
      return new Promise(async (res, rej) => {
        const reader = new FileReader();
        reader.onload = function () {
          res(reader.result);
        };
        reader.onerror = function () {
          rej(reader.error);
        };
        reader.readAsArrayBuffer(await response.blob());
      });
    }
    return null;
  }

  async arbitraryFund(amount: number): Promise<void> {
    this.#Irys.fund(amount);
  }

  async balance(): Promise<number> {
    return this.#Irys.utils
      .fromAtomic(await this.#Irys.getLoadedBalance())
      .toNumber();
  }

  async addWork(
    title: string,
    description: string | undefined,
    content: string,
    authorId: string,
    topicId: string
  ): TxHashPromise {
    let _desc = !description
      ? content.substring(0, content.length < 20 ? content.length : 20)
      : description;

    const tags = [
      { name: "Content-Type", value: "text/html" },
      { name: "Entity-Type", value: "Work" },
      { name: "title", value: title },
      { name: "description", value: _desc },
      { name: "authorId", value: authorId.toString() },
      { name: "topicId", value: topicId.toString() },
    ];

    return await this.#uploadText(content, tags);
  }

  async updateWork(
    title: string,
    description: string | undefined,
    content: string,
    authorId: string,
    topicId: string,
    priorWorkId: string
  ): TxHashPromise {
    if (!(await this.#confirmEntityOwner(priorWorkId, this.Address))) {
      throw new Error("");
    }
    return await this.addWork(title, description, content, authorId, topicId);
  }

  async getWork(workId: string): Promise<WorkWithAuthorModel | null> {
    const workQueryResponse = await this.#Query
      .search(SEARCH_TX)
      .ids([workId])
      .sort(DESC);

    if (workQueryResponse.length > 0) {
      const workQueryResponseItem: QueryResponse = workQueryResponse[0];
      const data = await this.getData(workQueryResponseItem.id);
      const workResponse: FreeAuthQueryResponse = {
        data,
        ...workQueryResponseItem,
      };
      const work = convertQueryToWork(workResponse);

      const profile = await this.getProfile(work.author_id);
      return convertModelsToWorkWithAuthor(work, profile!);
    }
    return null;
  }

  async searchWorksTop(
    _searchTxt: string,
    _pageSize: number
  ): Promise<WorkWithAuthorModel[] | null> {
    throw new Error("Not implemented");
  }

  async searchWorks(
    _searchTxt: string,
    _lastKeyset: number,
    _pageSize: number
  ): Promise<WorkWithAuthorModel[] | null> {
    throw new Error("Not implemented");
  }

  async getWorksByAllFollowed(
    _followerId: number,
    _lastKeyset: number,
    _pageSize: number
  ): Promise<WorkWithAuthorModel[] | null> {
    throw new Error("Not implemented");
  }

  async getWorksByAllFollowedTop(
    _followerId: number,
    _pageSize: number
  ): Promise<WorkWithAuthorModel[] | null> {
    throw new Error("Not implemented");
  }

  async getWorksByOneFollowed(
    _followedId: number,
    _lastKeyset: number,
    _pageSize: number
  ): Promise<WorkWithAuthorModel[] | null> {
    throw new Error("Not implemented");
  }

  async getWorksByOneFollowedTop(
    _followedId: number,
    _pageSize: number
  ): Promise<WorkWithAuthorModel[] | null> {
    throw new Error("Not implemented");
  }

  async getAuthorWorks(
    _authorId: number,
    _lastKeyset: number,
    _pageSize: number
  ): Promise<WorkWithAuthorModel[] | null> {
    throw new Error("Not implemented");
  }

  async getAuthorWorksTop(
    _authorId: number,
    _pageSize: number
  ): Promise<WorkWithAuthorModel[] | null> {
    throw new Error("Not implemented");
  }

  async getWorksByTopic(
    _topicId: number,
    _lastKeyset: number,
    _pageSize: number
  ): Promise<WorkWithAuthorModel[] | null> {
    throw new Error("Not implemented");
  }

  async getWorksByTopicTop(
    _topicId: number,
    _pageSize: number
  ): Promise<WorkWithAuthorModel[] | null> {
    throw new Error("Not implemented");
  }

  async addProfile(
    userName: string,
    fullName: string,
    description: string,
    socialLinkPrimary?: string,
    socialLinkSecondary?: string,
    avatar?: Avatar
  ): TxHashPromise {
    const tags = [
      { name: "Entity-Type", value: "Profile" },
      { name: "userName", value: userName },
      { name: "fullName", value: fullName },
      { name: "description", value: description },
      { name: "ownerAddress", value: this.Address },
    ];
    if (avatar) {
      tags.push({
        name: "Content-Type",
        value: `image/${avatar.fileExtension}`,
      });
    }
    if (socialLinkPrimary) {
      tags.push({ name: "socialLinkPrimary", value: socialLinkPrimary });
    }
    if (socialLinkSecondary) {
      tags.push({ name: "socialLinkSecondary", value: socialLinkSecondary });
    }

    if (!avatar) {
      return await this.#uploadText("", tags);
    }
    return await this.#uploadFile(avatar.file, tags);
  }

  async updateProfile(
    userName: string,
    fullName: string,
    description: string,
    socialLinkPrimary: string,
    socialLinkSecondary: string,
    avatar?: Avatar
  ): TxHashPromise {
    return await this.addProfile(
      userName,
      fullName,
      description,
      socialLinkPrimary,
      socialLinkSecondary,
      avatar
    );
  }

  async getProfile(profileId: string): Promise<ProfileModel | null> {
    const result = await this.#Query
      .search(SEARCH_TX)
      .ids([profileId])
      .sort(DESC);

    const data = await this.getData(result[0].id);

    return convertQueryToProfile({ data, ...result[0] });
  }

  async getOwnersProfile(): Promise<ProfileModel | null> {
    throw new Error("Not implemented");
  }

  async getFollowedProfiles(
    _profileId: number
  ): Promise<ProfileModel[] | null> {
    throw new Error("Not implemented");
  }
  async getFollowerProfiles(
    _profileId: number
  ): Promise<ProfileModel[] | null> {
    throw new Error("Not implemented");
  }

  async addWorkResponse(
    content: string,
    workId: number,
    responderId: number
  ): TxHashPromise {
    const tags = [
      { name: "Content-Type", value: "text/html" },
      { name: "Entity-Type", value: "Work" },
      { name: "workId", value: workId.toString() },
      { name: "responderId", value: responderId.toString() },
    ];

    return await this.#uploadText(content, tags);
  }

  async getWorkResponses(
    _workId: number,
    _lastKeyset: number,
    _pageSize: number
  ): Promise<WorkResponseModel[] | null> {
    throw new Error("Not implemented");
  }

  async getWorkResponsesTop(
    _workId: number,
    _pageSize: number
  ): Promise<WorkResponseModel[] | null> {
    throw new Error("Not implemented");
  }

  async getWorkResponsesByProfile(
    _profileId: number,
    _lastKeyset: number,
    _pageSize: number
  ): Promise<WorkResponseModel[] | null> {
    throw new Error("Not implemented");
  }

  async getWorkResponsesByProfileTop(
    _profileId: number,
    _pageSize: number
  ): Promise<WorkResponseModel[] | null> {
    throw new Error("Not implemented");
  }

  async addFollow(followerId: number, followedId: number): TxHashPromise {
    const tags = [
      { name: "Entity-Type", value: "Follow" },
      { name: "followerId", value: followerId.toString() },
      { name: "followedId", value: followedId.toString() },
    ];

    return await this.#uploadText("", tags);
  }
  async removeFollow(_followerId: number, _followedId: number): TxHashPromise {
    throw new Error("Not implemented");
  }

  async addTopic(name: string): TxHashPromise {
    const tags = [
      { name: "Entity-Type", value: "Topic" },
      { name: "name", value: name },
    ];

    return await this.#uploadText("", tags);
  }
  async removeTopic(_name: string): TxHashPromise {
    throw new Error("Not implemented");
  }

  async addWorkTopic(topicId: number, workId: number): TxHashPromise {
    const tags = [
      { name: "Entity-Type", value: "WorkTopic" },
      { name: "topicId", value: topicId.toString() },
      { name: "workId", value: workId.toString() },
    ];

    return await this.#uploadText("", tags);
  }
  async removeWorkTopic(_topicId: number, _workId: number): TxHashPromise {
    throw new Error("Not implemented");
  }

  async addWorkLike(workId: number, likerId: number): TxHashPromise {
    const tags = [
      { name: "Entity-Type", value: "WorkLike" },
      { name: "workId", value: workId.toString() },
      { name: "likerId", value: likerId.toString() },
    ];

    return await this.#uploadText("", tags);
  }
  async removeWorkLike(_workId: number, _likerId: number): TxHashPromise {
    throw new Error("Not implemented");
  }

  async getWorkLikeCount(_workId: number): Promise<number> {
    throw new Error("Not implemented");
  }

  async getWorkResponseCount(_workId: number): Promise<number> {
    throw new Error("Not implemented");
  }

  async getFollowedCount(_profileId: number): Promise<number> {
    throw new Error("Not implemented");
  }
  async getFollowerCount(_profileId: number): Promise<number> {
    throw new Error("Not implemented");
  }

  async getAllTopics(): Promise<TopicModel[] | null> {
    throw new Error("Not implemented");
  }
  async getWorkTopic(_workId: number): Promise<WorkTopicModel | null> {
    throw new Error("Not implemented");
  }
  async getTopicByWork(_workId: number): Promise<TopicModel | null> {
    throw new Error("Not implemented");
  }
}

function convertQueryToWork(response: FreeAuthQueryResponse): Work {
  return new Work(
    response.id,
    response.timestamp,
    response.tags.find((tag) => tag.name == "title")?.value || "",
    response.tags.find((tag) => tag.name == "content")?.value || "",
    response.tags.find((tag) => tag.name == "authorId")?.value || "",
    response.tags.find((tag) => tag.name == "description")?.value
  );
}

function convertQueryToProfile(response: FreeAuthQueryResponse): ProfileModel {
  return new ProfileModel(
    response.id,
    response.timestamp,
    response.tags.find((tag) => tag.name == "username")?.value || "",
    response.tags.find((tag) => tag.name == "fullname")?.value || "",
    response.tags.find((tag) => tag.name == "description")?.value || "",
    response.tags.find((tag) => tag.name == "ownerAddress")?.value || "",
    response.tags.find((tag) => tag.name == "socialLinkPrimary")?.value,
    response.tags.find((tag) => tag.name == "socialLinkSecondary")?.value
  );
}

function convertModelsToWorkWithAuthor(
  work: Work,
  profile: ProfileModel
): WorkWithAuthorModel {
  return new WorkWithAuthorModel(
    work.id,
    work.updated_at,
    work.title,
    work.content,
    work.description,
    work.author_id,
    profile.username,
    profile.fullname,
    profile.description
  );
}
