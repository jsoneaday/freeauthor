export interface Entity {
  id: number;
  updated_at: string;
}

export class Work implements Entity {
  constructor(
    public id: number,
    public updated_at: string,
    public title: string,
    public content: string,
    public author_id: number,
    public description: string | undefined
  ) {}
}

export class WorkWithAuthorModel implements Entity {
  constructor(
    public id: number,
    public updated_at: string,
    public title: string,
    public content: string,
    public description: string | undefined,
    public author_id: number,
    public username: string,
    public fullname: string,
    public profileDesc: string
  ) {}
}

export class ProfileModel implements Entity {
  constructor(
    public id: number,
    public updated_at: string,
    public username: string,
    public fullname: string,
    public description: string,
    public owner_address: string,
    public social_link_primary: string | undefined,
    public social_link_second: string | undefined
  ) {}
}

// todo: refactor
export class Follow implements Entity {
  constructor(
    id: number,
    updated_at: string,
    public follower_id: number,
    public followed_id: number
  ) {
    this.id = id;
    this.updated_at = updated_at;
  }

  id: number;
  updated_at: string;
}

export class TopicModel implements Entity {
  constructor(
    public id: number,
    public updated_at: string,
    public name: string
  ) {}
}

// todo: refactor
export class WorkTopic implements Entity {
  constructor(
    id: number,
    updated_at: string,
    public topic_id: number,
    public work_id: number
  ) {
    this.id = id;
    this.updated_at = updated_at;
  }

  id: number;
  updated_at: string;
}

// todo: refactor
export class WorkLike implements Entity {
  constructor(
    id: number,
    updated_at: string,
    public work_id: number,
    public liker_id: number
  ) {
    this.id = id;
    this.updated_at = updated_at;
  }

  id: number;
  updated_at: string;
}

// todo: refactor
export class WorkResponse implements Entity {
  constructor(
    id: number,
    updated_at: string,
    public content: string,
    public work_id: number,
    public responder_id: number
  ) {
    this.id = id;
    this.updated_at = updated_at;
  }

  id: number;
  updated_at: string;
}

export class WorkResponseModel implements Entity {
  constructor(
    public id: number,
    public updated_at: string,
    public work_id: number,
    public work_title: string,
    public response_content: string,
    public responder_id: number,
    public username: string,
    public fullname: string,
    public profileDesc: string
  ) {}
}
