import { useEffect, useState } from "react";
import { kwilApi } from "../../common/api/KwilApiInstance";
import { PAGE_SIZE } from "../../common/utils/StandardValues";
import { getWorkWithAuthor } from "../../common/components/models/UIModels";
import { useProfile } from "../../common/zustand/Store";
import { PagedWorkElements } from "../../common/components/PagedWorkElements";
import { Layout } from "../../common/components/Layout";
import { FollowedList } from "../../common/components/FollowedList";
import { WorkElements } from "../../common/components/WorkElements";

export function ReadFollowed() {
  const profile = useProfile((state) => state.profile);
  const [currentFollowedId, setCurrentFollowedId] = useState(0); // 0 means all
  const [refreshWorksData, setRefreshWorksData] = useState(false);

  useEffect(() => {
    console.log("profile, currentFollowedId, priorKeyset updated, run getData");
    setRefreshWorksData(true);
  }, [profile, currentFollowedId]);

  const getCurrentSelectedFollowedId = (id: number) => {
    console.log("getCurrentSelectedFollowedId", id);
    setCurrentFollowedId(id);
  };

  const getData = async (priorKeyset: number) => {
    console.log("begin getData", currentFollowedId);
    if (!profile) return null;

    // todo: need to test these calls each
    if (currentFollowedId === 0) {
      const works = await kwilApi.getWorksByAllFollowed(
        profile.id,
        priorKeyset,
        PAGE_SIZE
      );
      if (!works || works.length === 0) {
        return null;
      }

      const worksWithAuthor = await getWorkWithAuthor(works);
      console.log("works", works);
      return worksWithAuthor;
    } else {
      const works = await kwilApi.getWorksByOneFollowed(
        currentFollowedId,
        priorKeyset,
        PAGE_SIZE
      );
      if (!works || works.length === 0) {
        return null;
      }

      const worksWithAuthor = await getWorkWithAuthor(works);
      console.log("works", works);
      return worksWithAuthor;
    }
  };

  return (
    <Layout>
      <div className="home-single">
        <div style={{ marginBottom: "2em", width: "100%" }}>
          <FollowedList
            getCurrentSelectedFollowedId={getCurrentSelectedFollowedId}
          />
        </div>
        <PagedWorkElements
          getNextData={getData}
          refreshWorksData={refreshWorksData}
          setRefreshWorksData={setRefreshWorksData}
          payload={{
            showContent: false,
            showAuthor: true,
            readOnly: true,
            columnCount: 2,
          }}
        >
          <WorkElements works={[]} />
        </PagedWorkElements>
      </div>
    </Layout>
  );
}
