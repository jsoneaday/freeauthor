import { IKwilApi, TxHashPromise } from "../api/IKwilApi";
import { FakeKwilApi } from "../../common/api/FakeKwilApi";
import { KwilApi } from "../api/KwilApi";
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
  #_kwilApi: IKwilApi | null = null;
  get #kwilApi(): IKwilApi {
    return this.#_kwilApi!;
  }

  get Address() {
    return this.#kwilApi.Address;
  }

  async connect(environment: string) {
    if (environment === "development") {
      this.#_kwilApi = new FakeKwilApi(
        "0xE7DCCAE2d95A1cB1E30E07477207065A9EDf6D38"
      );
    } else {
      this.#_kwilApi = new KwilApi();
      await this.#_kwilApi.connect();
    }
  }

  async addWork(
    title: string,
    description: string | undefined,
    content: string,
    authorId: number,
    topicId: number
  ): TxHashPromise {
    return await this.#kwilApi.addWork(
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
    return await this.#kwilApi.addProfile(
      userName,
      fullName,
      description,
      ownerAddress,
      socialLinkPrimary,
      socialLinkSecond
    );
  }
  async addFollow(followerId: number, followedId: number): TxHashPromise {
    return await this.#kwilApi.addFollow(followerId, followedId);
  }
  async addTopic(name: string): TxHashPromise {
    return await this.#kwilApi.addTopic(name);
  }
  async addWorkTopic(topicId: number, workId: number): TxHashPromise {
    return await this.#kwilApi.addWorkTopic(topicId, workId);
  }
  async addWorkLikes(workId: number, likerId: number): TxHashPromise {
    return await this.#kwilApi.addWorkLikes(workId, likerId);
  }
  async addWorkResponse(
    content: string,
    workId: number,
    responderId: number
  ): TxHashPromise {
    return await this.#kwilApi.addWorkResponse(content, workId, responderId);
  }

  async waitAndGetId(
    tx: string | null | undefined,
    entityType?: string
  ): Promise<number> {
    return await this.#kwilApi.waitAndGetId(tx, entityType);
  }

  async updateWork(
    workId: number,
    title: string,
    description: string | undefined,
    content: string,
    authorId: number,
    topicId: number
  ): TxHashPromise {
    return this.#kwilApi.updateWork(
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
    return this.#kwilApi.updateProfile(
      profileId,
      userName,
      fullName,
      description,
      socialLinkPrimary,
      socialLinkSecond
    );
  }

  async getProfile(profileId: number): Promise<Profile | null> {
    const profile = await this.#kwilApi.getProfile(profileId);
    if (profile) return this.#getProfile(profile);
    return null;
  }

  async getOwnersProfile(): Promise<Profile | null> {
    const profile = await this.#kwilApi.getOwnersProfile();
    if (profile) return this.#getProfile(profile);
    return null;
  }

  async getFollowedProfiles(profileId: number): Promise<Profile[] | null> {
    const profiles = await this.#kwilApi.getFollowedProfiles(profileId);
    if (profiles) return this.#getProfiles(profiles);
    return null;
  }

  async getFollowerProfiles(profileId: number): Promise<Profile[] | null> {
    const profiles = await this.#kwilApi.getFollowerProfiles(profileId);
    if (profiles) return this.#getProfiles(profiles);
    return null;
  }

  async getWork(workId: number): Promise<WorkWithAuthor | null> {
    const work = await this.#kwilApi.getWork(workId);
    if (work) return this.#getWorkWithAuthor(work);
    return null;
  }

  async searchWorksTop(
    searchTxt: string,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#kwilApi.searchWorksTop(searchTxt, pageSize);
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async searchWorks(
    searchTxt: string,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#kwilApi.searchWorks(
      searchTxt,
      lastKeyset,
      pageSize
    );
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async getWorksByAllFollowed(
    followerId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#kwilApi.getWorksByAllFollowed(
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
    const works = await this.#kwilApi.getWorksByAllFollowedTop(
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
    const works = await this.#kwilApi.getWorksByOneFollowed(
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
    const works = await this.#kwilApi.getWorksByOneFollowedTop(
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
    const works = await this.#kwilApi.getAuthorWorks(
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
    const works = await this.#kwilApi.getAuthorWorksTop(authorId, pageSize);
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async getWorksByTopic(
    topicId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkWithAuthor[] | null> {
    const works = await this.#kwilApi.getWorksByTopic(
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
    const works = await this.#kwilApi.getWorksByTopicTop(topicId, pageSize);
    if (works) return this.#getWorkWithAuthors(works);
    return null;
  }

  async getWorkLikeCount(workId: number): Promise<number> {
    return await this.#kwilApi.getWorkLikeCount(workId);
  }

  async getWorkResponses(
    workId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<ResponseWithResponder[] | null> {
    const responses = await this.#kwilApi.getWorkResponses(
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
    const responses = await this.#kwilApi.getWorkResponsesTop(workId, pageSize);
    if (responses) return this.#getResponseWithResponders(responses);
    return null;
  }

  async getWorkResponsesByProfile(
    profileId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<ResponseWithResponder[] | null> {
    const responses = await this.#kwilApi.getWorkResponsesByProfile(
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
    const responses = await this.#kwilApi.getWorkResponsesByProfileTop(
      profileId,
      pageSize
    );
    if (responses) return this.#getResponseWithResponders(responses);
    return null;
  }

  async getWorkResponseCount(workId: number): Promise<number> {
    return await this.#kwilApi.getWorkResponseCount(workId);
  }

  async getFollowedCount(profileId: number): Promise<number> {
    return this.#kwilApi.getFollowedCount(profileId);
  }
  async getFollowerCount(profileId: number): Promise<number> {
    return this.#kwilApi.getFollowerCount(profileId);
  }

  async getAllTopics(): Promise<Topic[] | null> {
    const topics = await this.#kwilApi.getAllTopics();
    return (
      topics?.map((topic) => ({
        id: topic.id,
        updatedAt: topic.updated_at,
        name: topic.name,
      })) || null
    );
  }

  async getTopicByWork(workId: number): Promise<Topic | null> {
    const topic = await this.#kwilApi.getTopicByWork(workId);
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
    const workTopic = await this.#kwilApi.getWorkTopic(workId);
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
    return await this.#kwilApi.cleanDb();
  }

  async setupData(): TxHashPromise {
    return await this.#kwilApi.setupData();
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
