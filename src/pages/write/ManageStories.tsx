import { useEffect, useState } from "react";
import { kwilApi } from "../../common/api/KwilApiInstance";
import { useProfile } from "../../common/zustand/Store";
import { PAGE_SIZE } from "../../common/utils/StandardValues";
import { getWorkWithAuthor } from "../../common/components/models/UIModels";
import { PagedWorkElements } from "../../common/components/DisplayElements/PagedWorkElements";
import { WorkElements } from "../../common/components/DisplayElements/WorkElements";

export function ManageStories() {
  const profile = useProfile((state) => state.profile);
  const [refreshWorksData, setRefreshWorksData] = useState(false);

  useEffect(() => {
    if (profile) setRefreshWorksData(true);
  }, [profile]);

  const getData = async (priorKeyset: number) => {
    if (!profile) return null;

    let count = 0;
    // todo: remove get total count for testing
    kwilApi.getAuthorWorks(profile.id, priorKeyset, 500).then((works) => {
      count = works?.length || 0;
    });

    const works = await kwilApi.getAuthorWorks(
      profile.id,
      priorKeyset,
      PAGE_SIZE
    );
    if (!works) {
      return null;
    }

    const worksWithAuthor = getWorkWithAuthor(works);
    console.log("WorksWithAuthors and total", worksWithAuthor, count);
    return worksWithAuthor || null;
  };

  return (
    <PagedWorkElements
      getNextData={getData}
      refreshWorksData={refreshWorksData}
      setRefreshWorksData={setRefreshWorksData}
      payload={{
        showAuthor: false,
        showContent: false,
        readOnly: false,
        columnCount: 1,
      }}
      style={{ marginTop: "1.5em", height: "85vh", paddingBottom: 0 }}
    >
      <WorkElements works={[]} />
    </PagedWorkElements>
  );
}
