import { useEffect, useState } from "react";
import { PagedWorkElements } from "../common/components/PagedWorkElements";
import { ProfileForm } from "../common/components/ProfileForm";
import { Layout } from "../common/components/Layout";
import { RandomImg } from "../common/components/RandomImage";
import { TabHeader } from "../common/components/TabHeader";
import { useParams } from "react-router-dom";
import { kwilApi } from "../common/api/KwilApiInstance";
import { PAGE_SIZE } from "../common/utils/StandardValues";
import { getWorkWithAuthor } from "../common/components/models/UIModels";

enum PageSections {
  Stories = "Profile Stories",
  Responses = "Profile Responses",
  Following = "Following",
  Followers = "Followers",
}

/// Register by creating a profile with optional avatar/image
export function Profile() {
  const [sectionName, setSectionName] = useState(PageSections.Stories);
  const [refreshWorksData, setRefreshWorksData] = useState(true);
  const { profile_id } = useParams<{ profile_id: string }>();

  const profileCreatedCallback = () => {};

  const getData = async (priorKeyset: number) => {
    if (sectionName === PageSections.Stories) {
      return await getStories(priorKeyset);
    }
    return null;
  };

  const getStories = async (priorKeyset: number) => {
    const works = await kwilApi.getAuthorWorks(
      Number(profile_id || 0),
      priorKeyset,
      PAGE_SIZE
    );
    if (!works || works.length === 0) return null;

    const worksWithAuthor = await getWorkWithAuthor(works);
    console.log("works", worksWithAuthor);
    return worksWithAuthor;
  };

  return (
    <Layout>
      <div className="home-single">
        <div className="profile-edit-section">
          <RandomImg
            style={{
              width: "6.5em",
              height: "6.5em",
              marginLeft: "2em",
              marginRight: "4em",
            }}
          />
          <ProfileForm
            profileCreatedCallback={profileCreatedCallback}
            profileId={profile_id ? Number(profile_id) : undefined}
          />
        </div>
        <div className="profile-stories">
          <TabHeader headerName={sectionName} />

          <PagedWorkElements
            getNextData={getData}
            refreshWorksData={refreshWorksData}
            setRefreshWorksData={setRefreshWorksData}
            readOnly={true}
            showContent={false}
            showAuthor={true}
            columnCount={2}
            style={{ height: "70vh" }}
          />
        </div>
      </div>
    </Layout>
  );
}
