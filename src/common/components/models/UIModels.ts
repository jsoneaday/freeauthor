import {
  ProfileModel,
  WorkResponseModel,
  WorkWithAuthorModel,
} from "../../api/ApiModels";

export interface UiEntity {
  id: number;
  updatedAt: string;
}

export class WorkWithAuthor implements UiEntity {
  constructor(
    public id: number,
    public updatedAt: string,
    public title: string,
    public content: string,
    public description: string | undefined,
    public authorId: number,
    public fullName: string,
    public userName: string,
    public profileDesc: string
  ) {}
}

export class ResponseWithResponder implements UiEntity {
  constructor(
    public id: number,
    public updatedAt: string,
    public workId: number,
    public workTitle: string,
    public responseContent: string,
    public responderId: number,
    public userName: string,
    public fullName: string,
    public profileDesc: string
  ) {}
}

export class Profile implements UiEntity {
  constructor(
    public id: number,
    public updatedAt: string,
    public userName: string,
    public fullName: string,
    public description: string,
    public ownerAddress: string,
    public socialLinkPrimary: string | undefined,
    public socialLinkSecond: string | undefined
  ) {}
}

export async function getResponseWithResponder(responses: WorkResponseModel[]) {
  const responsesWithResponder: ResponseWithResponder[] = [];
  for (let i = 0; i < responses.length; i++) {
    responsesWithResponder.push({
      id: responses[i].id,
      updatedAt: responses[i].updated_at,
      workId: responses[i].work_id,
      workTitle: responses[i].work_title,
      responseContent: responses[i].response_content,
      responderId: responses[i].id,
      fullName: responses[i].fullname,
      userName: responses[i].username,
      profileDesc: responses[i].profileDesc,
    });
  }
  return responsesWithResponder;
}

export async function getWorkWithAuthor(works: WorkWithAuthorModel[]) {
  const worksWithAuthor: WorkWithAuthor[] = [];
  for (let i = 0; i < works.length; i++) {
    worksWithAuthor.push({
      id: works[i].id,
      updatedAt: works[i].updated_at,
      title: works[i].title,
      description: works[i].description,
      content: works[i].content,
      authorId: works[i].author_id,
      fullName: works[i].fullname,
      userName: works[i].username,
      profileDesc: works[i].profileDesc,
    });
  }
  return worksWithAuthor;
}

export async function getProfile(profileModels: ProfileModel[]) {
  const profiles: Profile[] = [];
  for (let i = 0; i < profileModels.length; i++) {
    profiles.push({
      id: profileModels[i].id,
      updatedAt: profileModels[i].updated_at,
      fullName: profileModels[i].fullname,
      userName: profileModels[i].username,
      description: profileModels[i].description,
      ownerAddress: profileModels[i].owner_address,
      socialLinkPrimary: profileModels[i].social_link_primary,
      socialLinkSecond: profileModels[i].social_link_second,
    });
  }
  return profiles;
}
