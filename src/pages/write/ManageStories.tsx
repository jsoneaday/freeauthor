import { useEffect, useRef, useState } from "react";
import { kwilApi } from "../../common/api/KwilApiInstance";
import { useProfile } from "../../common/zustand/Store";
import { WorkElements } from "../../common/components/WorkElements";
import { PAGE_SIZE } from "../../common/utils/StandardValues";
import {
  WorkWithAuthor,
  getWorkWithAuthor,
} from "../../common/components/models/UIModels";
import { Spinner } from "../../common/components/Spinner";

export function ManageStories() {
  const [works, setWorks] = useState<WorkWithAuthor[] | null>(null);
  const [priorKeyset, setPriorKeyset] = useState(0);
  const profile = useProfile((state) => state.profile);
  const readWorkListRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getData();
  }, [profile]);

  useEffect(() => {
    readWorkListRef.current?.addEventListener("scroll", scrollEventHandler);

    return () => {
      readWorkListRef.current?.removeEventListener(
        "scroll",
        scrollEventHandler
      );
    };
  }, [readWorkListRef.current, profile, priorKeyset]);

  const scrollEventHandler = () => {
    const targetBounds = targetRef.current?.getBoundingClientRect();
    const readWorkListBounds = readWorkListRef.current?.getBoundingClientRect();

    const inView =
      (targetBounds?.bottom || 0) ===
      Math.floor(readWorkListBounds?.bottom || 0) - 1;

    if (inView) {
      console.log("scrolling");
      getData();
    }
  };

  const getData = () => {
    if (!profile) return;

    if (priorKeyset === 1) return;

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
            console.log("WorksWithAuthor", works);
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
    <div
      ref={readWorkListRef}
      className="home-content read-work-list"
      style={{ marginTop: "1.5em", height: "85vh", paddingBottom: 0 }} // warning: do not remove bottom padding, needed so as scrolling bottoms match
    >
      <WorkElements
        works={works}
        showAuthor={true}
        showContent={false}
        refresh={false}
      />
      <div
        ref={targetRef}
        style={{
          bottom: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {works && works.length > 0 ? <Spinner size={15} /> : null}
      </div>
    </div>
  );
}
