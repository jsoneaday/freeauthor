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

export class Topic implements UiEntity {
  constructor(
    public id: number,
    public updatedAt: string,
    public name: string
  ) {}
}
