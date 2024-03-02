import { useEffect, useState } from "react";
import { kwilApi } from "../../common/api/KwilApiInstance";
import { useProfile } from "../../common/zustand/Store";
import { PAGE_SIZE } from "../../common/utils/StandardValues";
import {
  WorkWithAuthor,
  getWorkWithAuthor,
} from "../../common/components/models/UIModels";
import { PagedWorkElements } from "../../common/components/PagedWorkElements";

export function ManageStories() {
  const [works, setWorks] = useState<WorkWithAuthor[] | null>(null);
  const [priorKeyset, setPriorKeyset] = useState(0);
  const profile = useProfile((state) => state.profile);

  useEffect(() => {
    if (profile) getData(false);
  }, [profile]);

  const getData = (_refreshWorksList: boolean) => {
    if (!profile) return;

    if (priorKeyset === 1) return;

    let count = 0;
    kwilApi.getAuthorWorks(profile.id, priorKeyset, 500).then((works) => {
      count = works?.length || 0;
    });

    kwilApi
      .getAuthorWorks(profile.id, priorKeyset, PAGE_SIZE)
      .then((works) => {
        if (!works) {
          setWorks(null);
          return;
        }

        getWorkWithAuthor(works)
          .then((works) => {
            setWorks(works);
            console.log("WorksWithAuthors and total", works, count);
            if (works.length > 0) {
              setPriorKeyset(works[works.length - 1].id);
            }
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <PagedWorkElements
      getData={getData}
      works={works}
      refreshWorksList={false}
      showAuthor={false}
      showContent={false}
      readOnly={false}
      columnCount={1}
      style={{ marginTop: "1.5em", height: "85vh", paddingBottom: 0 }}
    />
  );
}
