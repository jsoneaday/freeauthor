import { IKwilApi } from "./IKwilApi";
import {
  Entity,
  Follow,
  ProfileModel,
  Topic,
  Work,
  WorkLike,
  WorkResponse,
  WorkTopic,
} from "./ApiModels";
import { faker } from "@faker-js/faker";
import { formattedNow } from "../utils/DateTimeUtils";

const profiles: ProfileModel[] = [];
const worksLength = 600;
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

  async addWork(
    title: string,
    description: string | undefined,
    content: string,
    authorId: number
  ) {
    const id = getLastestEntityId(works);
    console.log("last work id", id);
    works.push({
      id: id + 1,
      updated_at: formattedNow(),
      title,
      description,
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
      id: id + 1,
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
      id: id + 1,
      updated_at: formattedNow(),
      follower_id: followerId,
      followed_id: followedId,
    });
    return faker.number.binary();
  }

  async addTopic(name: string) {
    const id = getLastestEntityId(topics);
    topics.push({
      id: id + 1,
      updated_at: formattedNow(),
      name,
    });
    return faker.number.binary();
  }

  async addWorkTopic(topicId: number, workId: number) {
    const id = getLastestEntityId(workTopics);
    workTopics.push({
      id: id + 1,
      updated_at: formattedNow(),
      topic_id: topicId,
      work_id: workId,
    });
    return faker.number.binary();
  }

  async addWorkLikes(workId: number, likerId: number) {
    const id = getLastestEntityId(workLikes);
    workLikes.push({
      id: id + 1,
      updated_at: formattedNow(),
      work_id: workId,
      liker_id: likerId,
    });
    return faker.number.binary();
  }

  async addWorkResponses(content: string, workId: number, responderId: number) {
    const id = getLastestEntityId(workResponses);
    workResponses.push({
      id: id + 1,
      updated_at: formattedNow(),
      content,
      work_id: workId,
      responder_id: responderId,
    });
    return faker.number.binary();
  }

  async updateWork(
    workId: number,
    title: string,
    description: string | undefined,
    content: string,
    _authorId: number
  ) {
    const work = works.find((work) => work.id === workId);
    if (work) {
      work.title = title;
      work.description = description;
      work.content = content;
    } else {
      throw new Error(`work to update is not found ${workId}`);
    }
    return faker.number.binary();
  }

  async updateProfile(
    profileId: number,
    userName: string,
    fullName: string,
    description: string,
    socialLinkPrimary: string,
    socialLinkSecond: string
  ) {
    const profile = profiles.find((profile) => profile.id === profileId);
    if (!profile) throw new Error(`No Profile found by id ${profileId}`);

    profile.updated_at = formattedNow();
    profile.username = userName;
    profile.fullname = fullName;
    profile.description = description;
    profile.social_link_primary = socialLinkPrimary;
    profile.social_link_second = socialLinkSecond;

    return faker.number.binary();
  }

  async cleanDb() {
    return faker.number.binary();
  }

  async getProfile(profileId: number) {
    return profiles.find((profile) => profile.id === profileId) || null;
  }

  async getOwnersProfile(): Promise<ProfileModel | null> {
    return (
      profiles.find((profile) => profile.owner_address === this.#address) ||
      null
    );
  }

  async getFollwedProfiles(followerId: number): Promise<ProfileModel[] | null> {
    const followedIds = follows
      .filter((follow) => follow.follower_id === followerId)
      .map((follow) => follow.followed_id);
    return profiles.filter((profile) => followedIds.includes(profile.id));
  }

  async getWork(workId: number) {
    return works.find((work) => work.id === workId) || null;
  }

  async getAuthorWorks(
    authorId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<Work[] | null> {
    let filteredWorks: Work[];
    if (lastKeyset === 0) {
      filteredWorks = works.filter((work) => work.author_id === authorId);
    } else {
      filteredWorks = works.filter(
        (work) => work.author_id === authorId && work.id < lastKeyset
      );
    }

    return filteredWorks
      .sort((a, b) => {
        if (a.id > b.id) return -1;
        if (a.id < b.id) return 1;
        return 0;
      })
      .slice(0, pageSize);
  }

  async getWorksByAllFollowed(
    followerId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<Work[] | null> {
    const followedIds = follows
      .filter((follow) => follow.follower_id === followerId)
      .map((follow) => follow.followed_id);

    let filteredWorks: Work[];
    if (lastKeyset === 0) {
      filteredWorks = works.filter((work) =>
        followedIds.includes(work.author_id)
      );
    } else {
      filteredWorks = works.filter(
        (work) => followedIds.includes(work.author_id) && work.id < lastKeyset
      );
    }

    return filteredWorks
      .sort((a, b) => {
        if (a.id > b.id) return -1;
        if (a.id < b.id) return 1;
        return 0;
      })
      .slice(0, pageSize);
  }

  async getWorksByOneFollowed(
    followedId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<Work[] | null> {
    let filteredWorks: Work[];
    if (lastKeyset === 0) {
      filteredWorks = works.filter((work) => work.author_id === followedId);
    } else {
      filteredWorks = works.filter(
        (work) => work.author_id === followedId && work.id < lastKeyset
      );
    }

    return filteredWorks
      .sort((a, b) => {
        if (a.id > b.id) return -1;
        if (a.id < b.id) return 1;
        return 0;
      })
      .slice(0, pageSize);
  }

  async getWorksLikeCount(_workId: number): Promise<number> {
    return faker.number.int({ min: 2589, max: 19892 });
  }

  async getWorkResponses(
    workId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<WorkResponse[] | null> {
    let filteredResponses: WorkResponse[];
    if (lastKeyset === 0) {
      filteredResponses = workResponses.filter(
        (workResponse) => workResponse.work_id === workId
      );
    } else {
      filteredResponses = workResponses.filter(
        (workResponse) =>
          workResponse.work_id === workId && workResponse.work_id < lastKeyset
      );
    }

    return filteredResponses
      .sort((a, b) => {
        if (a.id > b.id) return -1;
        if (a.id < b.id) return 1;
        return 0;
      })
      .slice(0, pageSize);
  }

  async getWorksResponseCount(_workId: number): Promise<number> {
    return faker.number.int({ min: 2589, max: 19892 });
  }

  async getAllTopics(): Promise<Topic[]> {
    return topics;
  }

  async getWorksByTopic(
    topicId: number,
    lastKeyset: number,
    pageSize: number
  ): Promise<Work[] | null> {
    const workIds = workTopics
      .filter((wt) => wt.topic_id === topicId)
      .map((work) => work.id);

    let filteredWorks: Work[];
    if (lastKeyset === 0) {
      filteredWorks = works.filter((work) => workIds.includes(work.id));
    } else {
      filteredWorks = works.filter(
        (work) => workIds.includes(work.id) && work.id < lastKeyset
      );
    }

    return filteredWorks
      .sort((a, b) => {
        if (a.id > b.id) return -1;
        if (a.id < b.id) return 1;
        return 0;
      })
      .slice(0, pageSize);
  }

  async waitAndGetId(_tx: string | null | undefined): Promise<number> {
    throw new Error(
      "Deliberately not implemented, for testing use testWaitAndGetId"
    );
  }

  async testWaitAndGetId(
    _tx: string | null | undefined,
    entityType: string
  ): Promise<number> {
    let entities: Entity[] = [];
    if (entityType === "works") {
      entities = works;
    } else if (entityType === "profiles") {
      entities = profiles;
    } else if (entityType === "follows") {
      entities = follows;
    } else {
      throw new Error(`testWaitAndGetId for ${entityType} not implemented yet`);
    }
    return getLastestEntityId(entities);
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
    // index 1 already taken by test runner profile
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
        title: faker.lorem.sentence(),
        description: faker.lorem.sentences({ min: 2, max: 2 }),
        content: md1,
        author_id: getRandomEntityId(profiles, "profiles"),
      });
    }

    for (let i = 0; i < 40; i++) {
      let follower_id = getRandomEntityId(profiles, "profiles", 1); // for testing I want only my test account following
      let followed_id = getRandomEntityId(profiles, "profiles");
      if (follower_id === followed_id) {
        followed_id =
          follower_id === profiles.length
            ? profiles.length - 1
            : follower_id + 1;

        const alreadyFollowedIds = follows
          .filter((follow) => follow.follower_id === follower_id)
          .map((follow) => follow.followed_id);

        if (alreadyFollowedIds.includes(followed_id)) {
          followed_id = alreadyFollowedIds.sort((a, b) => {
            if (a > b) return -1;
            if (a < b) return 1;
            return 0;
          })[alreadyFollowedIds.length - 1];
        }
      }

      follows.push({
        id: i + 1,
        updated_at: formattedNow(),
        follower_id,
        followed_id,
      });
    }

    topics.push({
      id: 1,
      updated_at: formattedNow(),
      name: "most tipped",
    });
    topics.push({
      id: 2,
      updated_at: formattedNow(),
      name: "most responded",
    });
    topics.push({
      id: 3,
      updated_at: formattedNow(),
      name: "most subscribed",
    });
    for (let i = 3; i < 16; i++) {
      topics.push({
        id: i + 1,
        updated_at: formattedNow(),
        name: faker.company.buzzNoun().includes("eyeballs")
          ? faker.company.buzzNoun()
          : faker.company.buzzNoun(),
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

    for (let i = 0; i < 1000; i++) {
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
      if (a.id > b.id) return -1;
      if (a.id < b.id) return 1;
      return 0;
    })
    .map((entity) => entity.id)[0];
}

// const header = "# Random Markdown Sample";
// const olist = `1. First item
// 2. Second item
// 3. Third item`;
// const ulist = `* Item 1
// * Item 2
//   * Subitem A
//   * Subitem B
// * Item 3`;
// const code = `
// function go() {
//     // some code
// }
// `;
const md1: string = `# Random Markdown Sample

## Introduction

Welcome to this random Markdown sample! In this document, we'll explore different Markdown elements, including headers, paragraphs, bold text, italic text, lists, and code blocks.

### Longer Paragraphs
Let's expand on the idea of longer paragraphs. Markdown allows you to express ideas more elaborately. Whether you're documenting code, writing technical documentation, or creating a simple blog post, Markdown's simplicity shines.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa.

Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet.

### Unordered List

- Item 1
- Item 2
  - Subitem A
  - Subitem B
- Item 3

### Ordered List

1. First item
2. Second item
3. Third item

## Code Blocks

Code blocks are created using three backticks. You can also specify the programming language for syntax highlighting.

\`python
def greet(name):
    print(f"Hello, {name}!")
\`

### Conclusion
This concludes our exploration of extended Markdown elements. Remember, the beauty of Markdown lies in its simplicity and readability. Feel free to experiment and tailor it to your needs, creating documents that are both informative and visually appealing.
`;
