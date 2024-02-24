import { TxInfoReceipt } from "@kwilteam/kwil-js/dist/core/txQuery";
import { Profile, Work } from "./ApiModels";
import { GenericResponse } from "@kwilteam/kwil-js/dist/core/resreq";

export type TxHashPromise = Promise<string | null | undefined>;

export interface IKwilApi {
  connect(): Promise<void>;

  addWork(title: string, content: string, authorId: number): TxHashPromise;
  addProfile(
    userName: string,
    fullName: string,
    description: string,
    ownerAddress: string,
    socialLinkPrimary: string,
    socialLinkSecond: string
  ): TxHashPromise;
  addFollow(followerId: number, followedId: number): TxHashPromise;
  addTopic(name: string): TxHashPromise;
  addWorkTopic(topicId: number, workId: number): TxHashPromise;
  addWorkLikes(workId: number, likerId: number): TxHashPromise;
  addWorkResponses(
    content: string,
    workId: number,
    responderId: number
  ): TxHashPromise;

  cleanDb(): TxHashPromise;

  getOwnersProfile(): Promise<Profile | null>;
  getFollwedProfiles(profileId: number): Promise<Profile[] | null>;
  getAuthorWorks(
    authorId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<Work[] | null>;

  txInfo(tx: string): Promise<GenericResponse<TxInfoReceipt>>;

  waitAndGetId(tx: string | null | undefined): Promise<number>;
}
