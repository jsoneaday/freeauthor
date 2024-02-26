import { Profile, Work } from "../../api/ApiModels";
import { kwilApi } from "../../api/KwilApiInstance";

export class WorkWithAuthor {
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

export async function getWorkWithAuthor(works: Work[]) {
  const profileIds = works.map((work) => work.author_id);
  const uniqueProfileIds = [...new Set(profileIds)];
  const profiles: Profile[] = [];
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
