import { IApi, TxHashPromise } from "../api/IApi";
import {
  ProfileModel,
  WorkResponseModel,
  WorkWithAuthorModel,
} from "../api/ApiModels";
import {
  Profile,
  ResponseWithResponder,
  Topic,
  WorkTopic,
  WorkWithAuthor,
} from "./UIModels";

export class UiApi {
  #_api: IApi | null = null;
  get #Api(): IApi {
    return this.#_api!;
  }

  get Address() {
    return this.#Api.Address;
  }

  /// Pass api instance here
  /// e.g. new FakeApi("0xE7DCCAE2d95A1cB1E30E07477207065A9EDf6D38")
  constructor(apiObj: IApi, walletProvider: object) {
    this.#_api = apiObj;
    if (!this.isConnected()) {
      this.connect(walletProvider);
    }
  }

  async isConnected(): Promise<boolean> {
    return await this.#Api?.isConnected();
  }

  async connect(walletProvider: object) {
    await this.#Api.connect(walletProvider);
  }

  async addWork(
    title: string,
    description: string | undefined,
    content: string,
    authorId: number,
    topicId: number
  ): TxHashPromise {
    return await this.#Api.addWork(
      title,
      description,
      content,
      authorId,
      topicId
    );
  }

  async addProfile(
    userName: string,
    fullName: string,
    description: string,
    ownerAddress: string,
    socialLinkPrimary: string,
    socialLinkSecond: string
  ): TxHashPromise {
    return await this.#Api.addProfile(
      userName,
      fullName,
      description,
      ownerAddress,
      socialLinkPrimary,
      socialLinkSecond
    );
  }
  async addFollow(followerId: number, followedId: number): TxHashPromise {
    return await this.#Api.addFollow(followerId, followedId);
  }
  async addTopic(name: string): TxHashPromise {
    return await this.#Api.addTopic(name);
  }
  async addWorkTopic(topicId: number, workId: number): TxHashPromise {
    return await this.#Api.addWorkTopic(topicId, workId);
  }
  async addWorkLikes(workId: number, likerId: number): TxHashPromise {
    return await this.#Api.addWorkLike(workId, likerId);
  }
  async addWorkResponse(
    content: string,
    workId: number,
    responderId: number
  ): TxHashPromise {
    return await this.#Api.addWorkResponse(content, workId, responderId);
  }

  async waitAndGetId(
    tx: string | null | undefined,
    entityType?: string
  ): Promise<number> {
    return await this.#Api.waitAndGetId(tx, entityType);
  }

  async updateWork(
    workId: number,
    title: string,
    description: string | undefined,
    content: string,
    authorId: number,
    topicId: number
  ): TxHashPromise {
    return this.#Api.updateWork(
      workId,
      title,
      description,
      content,
      authorId,
      topicId
    );
  }

  async updateProfile(
    profileId: number,
    userName: string,
    fullName: string,
    description: string,
    socialLinkPrimary: string,
    socialLinkSecond: string
  ): TxHashPromise {
    return this.#Api.updateProfile(
      profileId,
      userName,
      fullName,
      description,
      socialLinkPrimary,
      socialLinkSecond
    );
  }

  async getProfile(profileId: number): Promise<Profile | null> {
    const profile = await this.#Api.getProfile(profileId);
    if (profile) return this.#getProfile(profile);
    return null;
  }

  async getOwnersProfile(): Promise<Profile | null> {
    const profile = await this.#Api.getOwnersProfile();
    if (profile) return this.#getProfile(profile);
    return null;
  }

  async getFollowedProfiles(profileId: number): Promise<Profile[] | null> {
    const profiles = await this.#Api.getFollowedProfiles(profileId);
    if (profiles) return this.#getProfiles(profiles);
    return null;
  }

  async getFollowerProfiles(profileId: number): Promise<Profile[] | null> {
    const profiles = await this.#Api.getFollowerProfiles(profileId);
    if (profiles) return this.#getProfiles(profiles);
    return null;
  }

  async getWork(workId: number): Promise<WorkWithAuthor | null> {
    const work = await this.#Api.getWork(workId);
    if (work) return this.#getWorkWithAuthor(work);
    return null;
  }

  async searchWorksTop(
    searchTxt: string,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#Api.searchWorksTop(searchTxt, pageSize);
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async searchWorks(
    searchTxt: string,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#Api.searchWorks(searchTxt, lastKeyset, pageSize);
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async getWorksByAllFollowed(
    followerId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#Api.getWorksByAllFollowed(
      followerId,
      lastKeyset,
      pageSize
    );
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async getWorksByAllFollowedTop(
    followerId: number,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#Api.getWorksByAllFollowedTop(
      followerId,
      pageSize
    );
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async getWorksByOneFollowed(
    followedId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#Api.getWorksByOneFollowed(
      followedId,
      lastKeyset,
      pageSize
    );
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async getWorksByOneFollowedTop(
    followedId: number,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#Api.getWorksByOneFollowedTop(
      followedId,
      pageSize
    );
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async getAuthorWorks(
    authorId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#Api.getAuthorWorks(
      authorId,
      lastKeyset,
      pageSize
    );
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async getAuthorWorksTop(
    authorId: number,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#Api.getAuthorWorksTop(authorId, pageSize);
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async getWorksByTopic(
    topicId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#Api.getWorksByTopic(
      topicId,
      lastKeyset,
      pageSize
    );
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async getWorksByTopicTop(
    topicId: number,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#Api.getWorksByTopicTop(topicId, pageSize);
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async getWorkLikeCount(workId: number): Promise<number> {
    return await this.#Api.getWorkLikeCount(workId);
  }

  async getWorkResponses(
    workId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<ResponseWithResponder[] | null> {
    const responses = await this.#Api.getWorkResponses(
      workId,
      lastKeyset,
      pageSize
    );
    if (responses) return this.#getResponseWithResponders(responses);
    return null;
  }

  async getWorkResponsesTop(
    workId: number,
    pageSize: number
  ): Promise<ResponseWithResponder[] | null> {
    const responses = await this.#Api.getWorkResponsesTop(workId, pageSize);
    if (responses) return this.#getResponseWithResponders(responses);
    return null;
  }

  async getWorkResponsesByProfile(
    profileId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<ResponseWithResponder[] | null> {
    const responses = await this.#Api.getWorkResponsesByProfile(
      profileId,
      lastKeyset,
      pageSize
    );
    if (responses) return this.#getResponseWithResponders(responses);
    return null;
  }

  async getWorkResponsesByProfileTop(
    profileId: number,
    pageSize: number
  ): Promise<ResponseWithResponder[] | null> {
    const responses = await this.#Api.getWorkResponsesByProfileTop(
      profileId,
      pageSize
    );
    if (responses) return this.#getResponseWithResponders(responses);
    return null;
  }

  async getWorkResponseCount(workId: number): Promise<number> {
    return await this.#Api.getWorkResponseCount(workId);
  }

  async getFollowedCount(profileId: number): Promise<number> {
    return this.#Api.getFollowedCount(profileId);
  }
  async getFollowerCount(profileId: number): Promise<number> {
    return this.#Api.getFollowerCount(profileId);
  }

  async getAllTopics(): Promise<Topic[] | null> {
    const topics = await this.#Api.getAllTopics();
    return (
      topics?.map((topic) => ({
        id: topic.id,
        updatedAt: topic.updated_at,
        name: topic.name,
      })) || null
    );
  }

  async getTopicByWork(workId: number): Promise<Topic | null> {
    const topic = await this.#Api.getTopicByWork(workId);
    if (topic) {
      return {
        id: topic.id,
        updatedAt: topic.updated_at,
        name: topic.name,
      };
    }
    return null;
  }

  async getWorkTopic(workId: number): Promise<WorkTopic | null> {
    const workTopic = await this.#Api.getWorkTopic(workId);
    if (workTopic) {
      return {
        id: workTopic.id,
        updatedAt: workTopic.updated_at,
        workId: workTopic.work_id,
        topicId: workTopic.topic_id,
      };
    }
    return null;
  }

  async cleanDb(): TxHashPromise {
    return await this.#Api.cleanDb();
  }

  async setupData(): TxHashPromise {
    return await this.#Api.setupData();
  }

  #getResponseWithResponders(responses: WorkResponseModel[]) {
    const responsesWithResponder: ResponseWithResponder[] = [];
    for (let i = 0; i < responses.length; i++) {
      if (responses[i]) {
        responsesWithResponder.push(
          this.#getResponseWithResponder(responses[i])
        );
      }
    }
    return responsesWithResponder;
  }

  #getResponseWithResponder(response: WorkResponseModel) {
    return {
      id: response.id,
      updatedAt: response.updated_at,
      workId: response.work_id,
      workTitle: response.work_title,
      responseContent: response.response_content,
      responderId: response.id,
      fullName: response.fullname,
      userName: response.username,
      profileDesc: response.profileDesc,
    };
  }

  #getWorkWithAuthors(works: WorkWithAuthorModel[]) {
    const worksWithAuthor: WorkWithAuthor[] = [];
    for (let i = 0; i < works.length; i++) {
      if (works[i]) {
        worksWithAuthor.push(this.#getWorkWithAuthor(works[i]));
      }
    }
    return worksWithAuthor;
  }

  #getWorkWithAuthor(work: WorkWithAuthorModel) {
    return {
      id: work.id,
      updatedAt: work.updated_at,
      title: work.title,
      description: work.description,
      content: work.content,
      authorId: work.author_id,
      fullName: work.fullname,
      userName: work.username,
      profileDesc: work.profileDesc,
    };
  }

  #getProfiles(profileModels: ProfileModel[]) {
    if (!profileModels) return null;

    const profiles: Profile[] = [];
    for (let i = 0; i < profileModels.length; i++) {
      if (profileModels[i]) {
        const profileModel = this.#getProfile(profileModels[i]);
        profiles.push(profileModel);
      }
    }
    return profiles;
  }

  #getProfile(profileModel: ProfileModel) {
    return {
      id: profileModel.id,
      updatedAt: profileModel.updated_at,
      fullName: profileModel.fullname,
      userName: profileModel.username,
      description: profileModel.description,
      ownerAddress: profileModel.owner_address,
      socialLinkPrimary: profileModel.social_link_primary,
      socialLinkSecond: profileModel.social_link_second,
    };
  }
}
