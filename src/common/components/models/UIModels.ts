import { ProfileModel, Work, WorkResponse } from "../../api/ApiModels";
import { kwilApi } from "../../api/KwilApiInstance";

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
    public userName: string
  ) {}
}

export class ResponseWithResponder implements UiEntity {
  constructor(
    public id: number,
    public updatedAt: string,
    public content: string,
    public workId: number,
    public responderId: number,
    public responderFullName: string,
    public responderUserName: string
  ) {}
}

export async function getResponseWithResponder(responses: WorkResponse[]) {
  const responderIds = responses.map((response) => response.responder_id);
  const uniqueResponderIds = [...new Set(responderIds)];
  const responderProfiles: ProfileModel[] = [];
  for (let i = 0; i < uniqueResponderIds.length; i++) {
    const profile = await kwilApi.getProfile(uniqueResponderIds[i]);
    if (profile) {
      responderProfiles.push(profile);
    }
  }

  const responsesWithResponder: ResponseWithResponder[] = [];
  for (let i = 0; i < responses.length; i++) {
    const responder = responderProfiles.find(
      (profile) => profile.id === responses[i].responder_id
    );

    if (responder) {
      responsesWithResponder.push({
        id: responses[i].id,
        updatedAt: responses[i].updated_at,
        content: responses[i].content,
        workId: responses[i].work_id,
        responderId: responder.id,
        responderFullName: responder.fullname,
        responderUserName: responder.username,
      });
    }
  }
  return responsesWithResponder;
}

export async function getWorkWithAuthor(works: Work[]) {
  const profileIds = works.map((work) => work.author_id);
  const uniqueProfileIds = [...new Set(profileIds)];
  const profiles: ProfileModel[] = [];
  for (let i = 0; i < uniqueProfileIds.length; i++) {
    const profile = await kwilApi.getProfile(uniqueProfileIds[i]);
    if (profile) {
      profiles.push(profile);
    }
  }

  const worksWithAuthor: WorkWithAuthor[] = [];
  for (let i = 0; i < works.length; i++) {
    const profile = profiles.find(
      (profile) => profile.id === works[i].author_id
    );

    const work = works[i];
    if (profile) {
      worksWithAuthor.push({
        id: work.id,
        updatedAt: work.updated_at,
        title: work.title,
        description: work.description,
        content: work.content,
        authorId: work.author_id,
        fullName: profile.fullname,
        userName: profile.username,
      });
    }
  }
  return worksWithAuthor;
}
