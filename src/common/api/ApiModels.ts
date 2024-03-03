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

export class ProfileModel implements Entity {
  constructor(
    public id: number,
    public updated_at: string,
    public username: string,
    public fullname: string,
    public description: string,
    public owner_address: string,
    public social_link_primary: string,
    public social_link_second: string
  ) {}
}

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

export class Topic implements Entity {
  constructor(id: number, updated_at: string, public name: string) {
    this.id = id;
    this.updated_at = updated_at;
  }

  id: number;
  updated_at: string;
}

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
