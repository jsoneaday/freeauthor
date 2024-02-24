import { IKwilApi } from "./IKwilApi";
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

const profiles: Profile[] = [];
const worksLength = 30;
const works: Work[] = [];
const follows: Follow[] = [];
const topics: Topic[] = [];
const workTopics: WorkTopic[] = [];
const workLikes: WorkLike[] = [];
const workResponses: WorkResponse[] = [];

export class FakeKwilApi implements IKwilApi {
  #address: string;
  get Address() {
    return this.#address;
  }

  constructor(address: string) {
    console.log("construct FakeKwilApi");
    this.#address = address;

    this.#setupTestData();
  }

  async connect() {}

  async addWork(title: string, content: string, authorId: number) {
    const id = getLastestEntityId(works);
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
    const id = getLastestEntityId(profiles);

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
    const id = getLastestEntityId(follows);
    follows.push({
      id,
      updated_at: formattedNow(),
      follower_id: followerId,
      followed_id: followedId,
    });
    return faker.number.binary();
  }

  async addTopic(name: string) {
    const id = getLastestEntityId(topics);
    topics.push({
      id,
      updated_at: formattedNow(),
      name,
    });
    return faker.number.binary();
  }

  async addWorkTopic(topicId: number, workId: number) {
    const id = getLastestEntityId(workTopics);
    workTopics.push({
      id,
      updated_at: formattedNow(),
      topic_id: topicId,
      work_id: workId,
    });
    return faker.number.binary();
  }

  async addWorkLikes(workId: number, likerId: number) {
    const id = getLastestEntityId(workLikes);
    workLikes.push({
      id,
      updated_at: formattedNow(),
      work_id: workId,
      liker_id: likerId,
    });
    return faker.number.binary();
  }

  async addWorkResponses(content: string, workId: number, responderId: number) {
    const id = getLastestEntityId(workResponses);
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

  async #setupTestData() {
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
    // index 1 already taken by test runner
    for (let i = 1; i < 20; i++) {
      profiles.push({
        id: i + 1,
        updated_at: formattedNow(),
        username: faker.internet.userName(),
        fullname: faker.person.fullName(),
        description: faker.lorem.sentence({ min: 1, max: 2 }),
        owner_address: faker.commerce.isbn(),
        social_link_primary: faker.internet.url(),
        social_link_second: faker.internet.url(),
      });
    }

    for (let i = 0; i < worksLength; i++) {
      works.push({
        id: i + 1,
        updated_at: formattedNow(),
        title: faker.lorem.text(),
        content: faker.lorem.paragraphs({ min: 4, max: 6 }),
        author_id: getRandomEntityId(profiles, "profiles"),
      });
    }

    for (let i = 0; i < 40; i++) {
      let follower_id = getRandomEntityId(profiles, "profiles", 1);
      let followed_id = getRandomEntityId(profiles, "profiles");
      if (follower_id === followed_id) {
        followed_id =
          follower_id === profiles.length
            ? profiles.length - 1
            : follower_id + 1;
      }

      follows.push({
        id: i + 1,
        updated_at: formattedNow(),
        follower_id,
        followed_id,
      });
    }
    console.log("follows", follows);

    for (let i = 0; i < 8; i++) {
      topics.push({
        id: i + 1,
        updated_at: formattedNow(),
        name: faker.lorem.text(),
      });
    }

    for (let i = 0; i < worksLength; i++) {
      workTopics.push({
        id: i + 1,
        updated_at: formattedNow(),
        topic_id: getRandomEntityId(topics, "topics"),
        work_id: getRandomEntityId(works, "works"),
      });
    }

    for (let i = 0; i < 100; i++) {
      workLikes[i] = {
        id: i + 1,
        updated_at: formattedNow(),
        work_id: getRandomEntityId(works, "works"),
        liker_id: getRandomEntityId(profiles, "profiles"),
      };
    }

    for (let i = 0; i < 30; i++) {
      workResponses.push({
        id: i + 1,
        updated_at: formattedNow(),
        content: faker.lorem.paragraph({ min: 1, max: 2 }),
        work_id: getRandomEntityId(works, "works"),
        responder_id: getRandomEntityId(profiles, "profiles"),
      });
    }
  }
}

function getRandomEntityId<T extends Entity>(
  entities: T[],
  _entityName: string,
  givenRandomId?: number
) {
  const randomId = givenRandomId
    ? givenRandomId
    : faker.number.int({ min: 1, max: entities.length });
  return (
    entities.find((entity) => {
      return entity.id === randomId;
    })?.id || 0
  );
}

function getLastestEntityId<T extends Entity>(
  entities: T[] | null | undefined
) {
  if (!entities || entities.length === 0) return 0;

  return entities
    .sort((a, b) => {
      if (a.id > b.id) return 1;
      if (a.id < b.id) return -1;
      return 0;
    })
    .map((entity) => entity.id)[0];
}
