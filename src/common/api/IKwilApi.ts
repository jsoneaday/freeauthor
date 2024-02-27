import { Profile, Work } from "./ApiModels";

export type TxHashPromise = Promise<string | null | undefined>;

export interface IKwilApi {
  get Address(): string;
  connect(): Promise<void>;

  addWork(
    title: string,
    description: string | undefined,
    content: string,
    authorId: number
  ): TxHashPromise;
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

  updateWork(
    workId: number,
    title: string,
    description: string | undefined,
    content: string,
    authorId: number
  ): TxHashPromise;

  cleanDb(): TxHashPromise;

  getProfile(profileId: number): Promise<Profile | null>;
  getOwnersProfile(): Promise<Profile | null>;
  getFollwedProfiles(profileId: number): Promise<Profile[] | null>;
  getWork(workId: number): Promise<Work | null>;
  getAuthorWorks(
    authorId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<Work[] | null>;
  getWorksByAllFollowed(
    followerId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<Work[] | null>;
  getWorksByOneFollowed(
    followerId: number,
    followedId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<Work[] | null>;

  waitAndGetId(tx: string | null | undefined): Promise<number>;
}
