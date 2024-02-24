import { GenericResponse } from "@kwilteam/kwil-js/dist/core/resreq";
import { IKwilApi, TxHashPromise } from "./IKwilApi";
import { TxInfoReceipt } from "@kwilteam/kwil-js/dist/core/txQuery";
import {
  Entity,
  Follow,
  Profile,
  Topic,
  Work,
  WorkLike,
  WorkResponse,
  WorkTopic,
} from "./ApiModels";
import { faker } from "@faker-js/faker";
import { formattedNow } from "../utils/DateTimeUtils";

class FakeKwilApi implements IKwilApi {
  #address: string;

  constructor(address: string) {
    this.#address = address;

    // setup testing profiles profile
    profiles.push({
      id: 1,
      updated_at: formattedNow(),
      username: faker.internet.userName(),
      fullname: faker.internet.displayName(),
      description: faker.lorem.sentence({ min: 1, max: 2 }),
      owner_address: this.#address,
      social_link_primary: faker.internet.url(),
      social_link_second: faker.internet.url(),
    });
  }

  async connect() {}

  async addWork(title: string, content: string, authorId: number) {
    const id = getLastEntityId(works);
    works.push({
      id,
      updated_at: formattedNow(),
      title,
      content,
      author_id: authorId,
    });
    return faker.number.binary();
  }
  async addProfile(
    userName: string,
    fullName: string,
    description: string,
    ownerAddress: string,
    socialLinkPrimary: string,
    socialLinkSecond: string
  ) {
    const id = getLastEntityId(profiles);

    profiles.push({
      id,
      updated_at: formattedNow(),
      username: userName,
      fullname: fullName,
      description: description,
      owner_address: ownerAddress,
      social_link_primary: socialLinkPrimary,
      social_link_second: socialLinkSecond,
    });

    return faker.number.binary();
  }
  async addFollow(followerId: number, followedId: number) {
    const id = getLastEntityId(follows);
    follows.push({
      id,
      updated_at: formattedNow(),
      follower_id: followerId,
      followed_id: followedId,
    });
    return faker.number.binary();
  }

  async addTopic(name: string) {
    const id = getLastEntityId(topics);
    topics.push({
      id,
      updated_at: formattedNow(),
      name,
    });
    return faker.number.binary();
  }

  async addWorkTopic(topicId: number, workId: number) {
    const id = getLastEntityId(workTopics);
    workTopics.push({
      id,
      updated_at: formattedNow(),
      topic_id: topicId,
      work_id: workId,
    });
    return faker.number.binary();
  }

  async addWorkLikes(workId: number, likerId: number) {
    const id = getLastEntityId(workLikes);
    workLikes.push({
      id,
      updated_at: formattedNow(),
      work_id: workId,
      liker_id: likerId,
    });
    return faker.number.binary();
  }

  async addWorkResponses(content: string, workId: number, responderId: number) {
    const id = getLastEntityId(workResponses);
    workResponses.push({
      id,
      updated_at: formattedNow(),
      content,
      work_id: workId,
      responder_id: responderId,
    });
    return faker.number.binary();
  }

  async cleanDb() {
    return faker.number.binary();
  }

  async getOwnersProfile(): Promise<Profile | null> {
    return (
      profiles.find((profile) => profile.owner_address === this.#address) ||
      null
    );
  }

  async getFollwedProfiles(followerId: number): Promise<Profile[] | null> {
    const followedIds = follows
      .filter((follow) => follow.follower_id === followerId)
      .map((follow) => follow.followed_id);
    return profiles.filter((profile) => followedIds.includes(profile.id));
  }

  async getAuthorWorks(
    authorId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<Work[] | null> {
    return works
      .filter((work) => work.author_id === authorId)
      .sort((a, b) => {
        if (a.id > b.id) return 1;
        if (a.id < b.id) return -1;
        return 0;
      })
      .slice(lastKeyset, lastKeyset + pageSize);
  }

  async waitAndGetId(tx: string | null | undefined): Promise<number> {
    throw new Error("Not implemented!");
  }
}

function getLastEntityId<T extends Entity>(entities: T[] | null | undefined) {
  if (!entities || entities.length === 0) return 0;

  return entities
    .sort((a, b) => {
      if (a.id > b.id) return 1;
      if (a.id < b.id) return -1;
      return 0;
    })
    .map((entity) => entity.id)[0];
}

const profiles: Profile[] = new Array<Profile>(20);
for (let i = 1; i < 31; i++) {
  profiles[i] = {
    id: i + 1,
    updated_at: formattedNow(),
    username: faker.internet.userName(),
    fullname: faker.internet.displayName(),
    description: faker.lorem.sentence({ min: 1, max: 2 }),
    owner_address: faker.commerce.isbn(),
    social_link_primary: faker.internet.url(),
    social_link_second: faker.internet.url(),
  };
}

function getRandomEntityId<T extends Entity>(entities: T[]) {
  return (
    entities.find(
      (entity) =>
        entity.id === faker.number.int({ min: 1, max: entities.length })
    )?.id || 0
  );
}

function getRandomFollowerIdFollowedId(): [number, number] {
  let follower_id = getRandomEntityId(profiles);
  let followed_id = getRandomEntityId(profiles);
  if (follower_id === followed_id) {
    followed_id =
      follower_id === profiles.length ? profiles.length - 1 : follower_id + 1;
  }
  return [follower_id, followed_id];
}

const works: Work[] = new Array<Work>(30);
for (let i = 0; i < 30; i++) {
  works[i] = {
    id: i + 1,
    updated_at: formattedNow(),
    title: faker.lorem.text(),
    content: faker.lorem.paragraphs({ min: 4, max: 6 }),
    author_id: getRandomEntityId(profiles),
  };
}

const follows: Follow[] = new Array<Follow>(30);
for (let i = 0; i < 30; i++) {
  let [follower_id, followed_id] = getRandomFollowerIdFollowedId();

  follows[i] = {
    id: i + 1,
    updated_at: formattedNow(),
    follower_id,
    followed_id,
  };
}

const topics: Topic[] = new Array<Topic>(8);
for (let i = 0; i < 8; i++) {
  topics[i] = {
    id: i + 1,
    updated_at: formattedNow(),
    name: faker.lorem.text(),
  };
}

const workTopics: WorkTopic[] = new Array<WorkTopic>(works.length);
for (let i = 0; i < workTopics.length; i++) {
  workTopics[i] = {
    id: i + 1,
    updated_at: formattedNow(),
    topic_id: getRandomEntityId(topics),
    work_id: getRandomEntityId(works),
  };
}

const workLikes: WorkLike[] = new Array<WorkLike>(100);
for (let i = 0; i < workLikes.length; i++) {
  workLikes[i] = {
    id: i + 1,
    updated_at: formattedNow(),
    work_id: getRandomEntityId(works),
    liker_id: getRandomEntityId(profiles),
  };
}

const workResponses: WorkResponse[] = new Array<WorkResponse>(20);
for (let i = 0; i < workResponses.length; i++) {
  workResponses[i] = {
    id: i + 1,
    updated_at: formattedNow(),
    content: faker.lorem.paragraph({ min: 1, max: 2 }),
    work_id: getRandomEntityId(works),
    responder_id: getRandomEntityId(profiles),
  };
}
