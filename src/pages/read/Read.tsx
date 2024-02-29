import { FollowedList } from "../../common/components/FollowedList";
import { Layout } from "../../common/components/Layout";
import { useEffect, useRef, useState } from "react";
import { kwilApi } from "../../common/api/KwilApiInstance";
//import { useProfile } from "../common/redux/profile/ProfileHooks";
import { WorkElements } from "../../common/components/WorkElements";
import { PAGE_SIZE } from "../../common/utils/StandardValues";
import {
  WorkWithAuthor,
  getWorkWithAuthor,
} from "../../common/components/models/UIModels";
import { Spinner } from "../../common/components/Spinner";
import { useProfile } from "../../common/zustand/store";
import { Work } from "../../common/api/ApiModels";

// const observerOptions = {
//   root: null,
//   // root: document.querySelector("body"),
//   rootMargin: "0px",
//   threshold: 0.1,
// };

export function Read() {
  const [currentFollowedId, setCurrentFollowedId] = useState(0); // 0 means all
  const [priorKeyset, setPriorKeyset] = useState(0); // todo: need to build this out
  const [works, setWorks] = useState<WorkWithAuthor[] | null>(null);
  //const [profile] = useProfile();
  const profile = useProfile((state) => state.profile);
  const targetRef = useRef<HTMLDivElement>(null);
  const readWorkListRef = useRef<HTMLDivElement>(null);
  const [refreshWorksList, setRefreshWorksList] = useState(true);

  const getCurrentSelectedFollowedId = (id: number) => {
    setRefreshWorksList(true);
    console.log("Read received id", id);
    setCurrentFollowedId(id);
    setPriorKeyset(0);
  };

  useEffect(() => {
    console.log("currentFollowerId updated running getData", currentFollowedId);
    console.log("profile updated running getData", profile);

    getData();
  }, [currentFollowedId, profile, priorKeyset, refreshWorksList]);

  useEffect(() => {
    readWorkListRef.current?.addEventListener("scroll", scrollEventHandler);

    return () => {
      readWorkListRef.current?.removeEventListener(
        "scroll",
        scrollEventHandler
      );
    };
  }, [
    readWorkListRef.current,
    currentFollowedId,
    profile,
    priorKeyset,
    refreshWorksList,
  ]);

  const scrollEventHandler = () => {
    const targetBounds = targetRef.current?.getBoundingClientRect();
    const readWorkListBounds = readWorkListRef.current?.getBoundingClientRect();

    const inView =
      (targetBounds?.bottom || 0) === (readWorkListBounds?.bottom || 0) - 1;

    if (inView) {
      setRefreshWorksList(false);
      console.log("Scroll, running getData", profile);
    }
  };

  const setNextPriorKeyset = (works: Work[]) => {
    const keyset = works[works.length - 1].id - PAGE_SIZE;
    setPriorKeyset(keyset <= 0 ? 0 : keyset);
  };

  const getData = () => {
    console.log(
      `entered getData currentFollowedId: ${currentFollowedId}, profile: ${profile}, priorKeyset: ${priorKeyset}, refreshWorksList: ${refreshWorksList}`
    );
    if (!profile) return;

    if (!refreshWorksList && priorKeyset === 0) {
      return; // if priorKeyset to PAGE_SIZE range is 0 or less there is no more data to get
    }

    // todo: need to test these calls each
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
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
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
        <div ref={readWorkListRef} className="read-work-list">
          <WorkElements
            works={works}
            refresh={refreshWorksList}
            showContent={false}
            twoColumn={true}
          />
          <div
            ref={targetRef}
            style={{
              bottom: "0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {works && works.length > 0 ? <Spinner size={15} /> : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}
