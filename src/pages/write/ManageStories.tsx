import { useEffect, useState } from "react";
import { api } from "../../common/ui-api/UiApiInstance";
import { useProfile } from "../../common/zustand/Store";
import { PAGE_SIZE } from "../../common/utils/StandardValues";
import { PagedWorkElements } from "../../common/components/display-elements/PagedWorkElements";
import { WorkElements } from "../../common/components/display-elements/WorkElements";
import { WorkWithAuthor } from "../../common/ui-api/UIModels";

export function ManageStories() {
  const profile = useProfile((state) => state.profile);
  const [refreshWorksData, setRefreshWorksData] = useState(false);

  useEffect(() => {
    if (profile) setRefreshWorksData(true);
  }, [profile]);

  const getData = async (priorKeyset: number) => {
    if (!profile) return null;

    console.log("getAuthorWorks", profile.id, priorKeyset, PAGE_SIZE);

    let works: WorkWithAuthor[] | null;
    if (priorKeyset === 0) {
      works = await api.getAuthorWorksTop(profile.id, PAGE_SIZE);
    } else {
      works = await api.getAuthorWorks(profile.id, priorKeyset, PAGE_SIZE);
    }
    if (!works) {
      return null;
    }

    return works || null;
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
