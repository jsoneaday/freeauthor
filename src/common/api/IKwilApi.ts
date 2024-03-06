import {
  ProfileModel,
  Topic,
  WorkResponseModel,
  WorkWithAuthorModel,
} from "./ApiModels";

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
  addWorkResponse(
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

  updateProfile(
    profileId: number,
    userName: string,
    fullName: string,
    description: string,
    socialLinkPrimary: string,
    socialLinkSecond: string
  ): TxHashPromise;

  cleanDb(): TxHashPromise;

  getProfile(profileId: number): Promise<ProfileModel | null>;
  getOwnersProfile(): Promise<ProfileModel | null>;

  getFollowedProfiles(profileId: number): Promise<ProfileModel[] | null>;
  getFollowerProfiles(profileId: number): Promise<ProfileModel[] | null>;

  getWork(workId: number): Promise<WorkWithAuthorModel | null>;

  getWorksByAllFollowed(
    followerId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  getWorksByOneFollowed(
    followedId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  getAuthorWorks(
    authorId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  getWorksByTopic(
    topicId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  getWorkLikeCount(workId: number): Promise<number>;

  getWorkResponses(
    workId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkResponseModel[] | null>;

  getWorkResponsesByProfile(
    profileId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkResponseModel[] | null>;

  getWorkResponseCount(workId: number): Promise<number>;

  getFollowedCount(profileId: number): Promise<number>;
  getFollowerCount(profileId: number): Promise<number>;

  getAllTopics(): Promise<Topic[]>;

  waitAndGetId(tx: string | null | undefined): Promise<number>;
  testWaitAndGetId(
    tx: string | null | undefined,
    entityType: string
  ): Promise<number>;
}
