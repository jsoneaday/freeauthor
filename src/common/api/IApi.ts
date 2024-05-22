import { UploadResponse } from "@irys/sdk/common/types";
import {
  Avatar,
  ProfileModel,
  TopicModel,
  WorkResponseModel,
  WorkTopicModel,
  WorkWithAuthorModel,
} from "./ApiModels";

export type TxHashPromise = Promise<string | null | undefined | UploadResponse>;

export interface IApi {
  get Address(): string;

  getData(entityTxId: string): Promise<null | string | ArrayBuffer>;

  arbitraryFund(amount: number): Promise<void>;

  /// Loaded balance on Irys
  balance(): Promise<number>;

  addWork(
    title: string,
    /// if undefined use first few words of content
    description: string | undefined,
    /// should be html
    content: string,
    authorId: string,
    topicId: string,
    fund?: boolean
  ): TxHashPromise;

  updateWork(
    title: string,
    description: string | undefined,
    content: string,
    authorId: string,
    topicId: string,
    priorWorkId: string,
    fund?: boolean
  ): TxHashPromise;

  /// workId is transaction id
  getWork(workId: string): Promise<WorkWithAuthorModel | null>;

  searchWorksTop(
    searchTxt: string,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  searchWorks(
    searchTxt: string,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  getWorksByAllFollowed(
    followerId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  getWorksByAllFollowedTop(
    followerId: number,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  getWorksByOneFollowed(
    followedId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  getWorksByOneFollowedTop(
    followedId: number,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  getAuthorWorks(
    authorId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  getAuthorWorksTop(
    authorId: number,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  getWorksByTopic(
    topicId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  getWorksByTopicTop(
    topicId: number,
    pageSize: number
  ): Promise<WorkWithAuthorModel[] | null>;

  addProfile(
    userName: string,
    fullName: string,
    description: string,
    fund?: boolean,
    socialLinkPrimary?: string,
    socialLinkSecondary?: string,
    avatar?: Avatar
  ): TxHashPromise;

  updateProfile(
    userName: string,
    fullName: string,
    description: string,
    fund?: boolean,
    socialLinkPrimary?: string,
    socialLinkSecondary?: string,
    avatar?: Avatar
  ): TxHashPromise;

  getProfile(profileId: string): Promise<ProfileModel | null>;
  getOwnersProfile(): Promise<ProfileModel | null>;
  getFollowedProfiles(profileId: number): Promise<ProfileModel[] | null>;
  getFollowerProfiles(profileId: number): Promise<ProfileModel[] | null>;

  addWorkResponse(
    content: string,
    workId: number,
    responderId: number,
    fund?: boolean
  ): TxHashPromise;

  getWorkResponses(
    workId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkResponseModel[] | null>;

  getWorkResponsesTop(
    workId: number,
    pageSize: number
  ): Promise<WorkResponseModel[] | null>;

  getWorkResponsesByProfile(
    profileId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkResponseModel[] | null>;

  getWorkResponsesByProfileTop(
    profileId: number,
    pageSize: number
  ): Promise<WorkResponseModel[] | null>;

  isConnected(): Promise<boolean>;
  connect(walletProvider?: object): Promise<void>;

  addFollow(
    followerId: number,
    followedId: number,
    fund?: boolean
  ): TxHashPromise;
  removeFollow(followerId: number, followedId: number): TxHashPromise;

  addTopic(name: string, fund?: boolean): TxHashPromise;
  removeTopic(name: string): TxHashPromise;

  addWorkTopic(topicId: number, workId: number, fund?: boolean): TxHashPromise;
  removeWorkTopic(topicId: number, workId: number): TxHashPromise;

  addWorkLike(workId: number, likerId: number, fund?: boolean): TxHashPromise;
  removeWorkLike(workId: number, likerId: number): TxHashPromise;

  /// Used to wait for tx completion and then get entity id
  // waitAndGetId(
  //   tx: string | null | undefined,
  //   entityType?: string
  // ): Promise<number>;

  getWorkLikeCount(workId: number): Promise<number>;

  getWorkResponseCount(workId: number): Promise<number>;

  getFollowedCount(profileId: number): Promise<number>;
  getFollowerCount(profileId: number): Promise<number>;

  getAllTopics(): Promise<TopicModel[] | null>;
  getWorkTopic(workId: number): Promise<WorkTopicModel | null>;
  getTopicByWork(workId: number): Promise<TopicModel | null>;

  // cleanDb(): TxHashPromise;
  // setupData(): TxHashPromise;
}
