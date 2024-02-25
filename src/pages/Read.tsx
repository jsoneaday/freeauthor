import { FollowedList } from "../common/components/FollowedList";
import { Layout } from "../common/components/Layout";
import { MarkdownEditor } from "../common/components/MarkdownEditor";
import { useEffect, useState } from "react";
import { kwilApi } from "../common/api/KwilApiInstance";
import { useProfile } from "../common/redux/profile/ProfileHooks";
import { Work } from "../common/api/ApiModels";

export function Read() {
  // 0 means all
  const [currentFollowedId, setCurrentFollowedId] = useState(0);
  const [priorKeyset, _setPriorKeyset] = useState(0); // todo: need to build this out
  const [works, setWorks] = useState<JSX.Element[] | undefined>();
  const [profile, _setProfile] = useProfile();

  const getCurrentSelectedFollowedId = (id: number) => {
    setCurrentFollowedId(id);
  };

  useEffect(() => {
    if (currentFollowedId === 0) {
      kwilApi
        .getWorksByAllFollowed(profile?.id || 0, priorKeyset, 20)
        .then((works) => {
          setWorks(setWorkElements(works));
        })
        .catch((e) => console.log(e));
    } else {
      kwilApi
        .getWorksByOneFollowed(
          profile?.id || 0,
          currentFollowedId,
          priorKeyset,
          20
        )
        .then((works) => {
          setWorks(setWorkElements(works));
        })
        .catch((e) => console.log(e));
    }
  }, [currentFollowedId, profile, priorKeyset]);

  return (
    <Layout>
      <div className="home-single">
        <div style={{ marginBottom: "2em", width: "100%" }}>
          <FollowedList
            getCurrentSelectedFollowedId={getCurrentSelectedFollowedId}
          />
        </div>
        <div style={{ marginTop: "1.5em", width: "100%" }}>{works}</div>
      </div>
    </Layout>
  );
}

function setWorkElements(works: Work[] | null) {
  if (!works) {
    return undefined;
  }
  const workElements: JSX.Element[] = [];
  for (let i = 0; i < works.length; i++) {
    workElements.push(
      <div key={`work-${works[i].id}`} style={{ marginBottom: "4em" }}>
        <span className="work-title">{works[i].title}</span>
        <MarkdownEditor
          readOnly={true}
          markdown={works[i].content.substring(0, 500)}
        />
      </div>
    );
  }
  return workElements;
}
