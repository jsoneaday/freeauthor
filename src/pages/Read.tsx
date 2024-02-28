import { FollowedList } from "../common/components/FollowedList";
import { Layout } from "../common/components/Layout";
import { useEffect, useRef, useState } from "react";
import { kwilApi } from "../common/api/KwilApiInstance";
import { useProfile } from "../common/redux/profile/ProfileHooks";
import { WorkElements } from "../common/components/WorkElements";
import { PAGE_SIZE } from "../common/utils/StandardValues";
import {
  WorkWithAuthor,
  getWorkWithAuthor,
} from "../common/components/models/UIModels";
import { Spinner } from "../common/components/Spinner";

const observerOptions = {
  root: null,
  // root: document.querySelector("body"),
  rootMargin: "0px",
  threshold: 0.1,
};

export function Read() {
  // 0 means all
  const [currentFollowedId, setCurrentFollowedId] = useState(0);
  const [priorKeyset, setPriorKeyset] = useState(0); // todo: need to build this out
  const [works, setWorks] = useState<WorkWithAuthor[] | null>(null);
  const [profile, _setProfile] = useProfile();
  const targetRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [refreshWorksList, setRefreshWorksList] = useState(false);

  const getCurrentSelectedFollowedId = (id: number) => {
    setRefreshWorksList(true);
    console.log("Read received id", id);
    setCurrentFollowedId(id);
  };

  useEffect(() => {
    console.log("currentFollowerId updated running getData", currentFollowedId);
    getData();
  }, [currentFollowedId, profile]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries: any) => {
      const [entry] = entries;
      // setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting) {
        setRefreshWorksList(false);
        console.log("Read Intersection running getData", profile);
        getData();
      }
    }, observerOptions);

    const ref = targetRef.current;
    if (ref) observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, []);

  const getData = () => {
    console.log(
      `entered getData currentFollowedId: ${currentFollowedId}, profile.id: ${profile?.id}, priorKeyset: ${priorKeyset}, refreshWorksList: ${refreshWorksList}`
    );
    if (!profile) return;

    if (!refreshWorksList && priorKeyset === 1) {
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
            const keyset = works[works.length - 1].id - PAGE_SIZE;
            setPriorKeyset(keyset <= 0 ? 1 : keyset);
          }
          getWorkWithAuthor(works)
            .then((works) => {
              console.log("Read set all follower works", works);
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
            const keyset = works[works.length - 1].id - PAGE_SIZE;
            setPriorKeyset(keyset <= 0 ? 1 : keyset);
          }
          getWorkWithAuthor(works)
            .then((works) => {
              console.log("Read set followed works", works);
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
        <div style={{ marginTop: "1.5em", width: "100%" }}>
          <WorkElements
            works={works}
            refresh={refreshWorksList}
            showContent={false}
            twoColumn={true}
          />
        </div>
        <div ref={targetRef} style={{ bottom: "0" }}>
          {works && works.length > 0 ? <Spinner size={15} /> : null}
        </div>
      </div>
    </Layout>
  );
}
