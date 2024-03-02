import { useEffect, useState } from "react";
import { kwilApi } from "../../common/api/KwilApiInstance";
import { PAGE_SIZE } from "../../common/utils/StandardValues";
import {
  WorkWithAuthor,
  getWorkWithAuthor,
} from "../../common/components/models/UIModels";
import { useProfile } from "../../common/zustand/Store";
import { Work } from "../../common/api/ApiModels";
import { useOutletContext } from "react-router-dom";
import { ReadOutletType } from "./Read";
import { PagedWorkElements } from "../../common/components/PagedWorkElements";

export function ReadFollowed() {
  const [works, setWorks] = useState<WorkWithAuthor[] | null>(null);
  const profile = useProfile((state) => state.profile);
  const {
    currentFollowedId,
    priorKeysetState: [priorKeyset, setPriorKeyset],
    refreshWorksListState: [refreshWorksList, setRefreshWorksList],
    setShowFollowedList,
  } = useOutletContext<ReadOutletType>();

  useEffect(() => {
    setShowFollowedList(true);
  }, [setShowFollowedList]);

  useEffect(() => {
    if (profile) getData(refreshWorksList);
  }, [profile, currentFollowedId]);

  const setNextPriorKeyset = (works: Work[]) => {
    setPriorKeyset(works[works.length - 1].id);
  };

  const getData = (refreshWorksList: boolean) => {
    if (!profile) return;

    if (!refreshWorksList && priorKeyset === 0) {
      return; // if priorKeyset to PAGE_SIZE range is 0 or less there is no more data to get
    }

    // todo: need to test these calls each
    setRefreshWorksList(refreshWorksList);
    if (currentFollowedId === 0) {
      kwilApi
        .getWorksByAllFollowed(profile.id, priorKeyset, PAGE_SIZE)
        .then((works) => {
          if (!works) {
            setWorks(null);
            return;
          }

          if (works.length > 0) {
            setNextPriorKeyset(works);
          }
          getWorkWithAuthor(works)
            .then((works) => {
              setWorks(works);
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    } else {
      kwilApi
        .getWorksByOneFollowed(currentFollowedId, priorKeyset, PAGE_SIZE)
        .then((works) => {
          if (!works) {
            setWorks(null);
            return;
          }

          if (works.length > 0) {
            setNextPriorKeyset(works);
          }
          getWorkWithAuthor(works)
            .then((works) => {
              setWorks(works);
              console.log("works", works);
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <PagedWorkElements
      getData={getData}
      refreshWorksList={refreshWorksList}
      works={works}
      showContent={false}
      showAuthor={true}
      readOnly={true}
      columnCount={2}
    />
  );
}
