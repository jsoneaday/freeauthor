import { FollowedList } from "../common/components/FollowedList";
import { Layout } from "../common/components/Layout";
import { useEffect, useState } from "react";
import { kwilApi } from "../common/api/KwilApiInstance";
import { useProfile } from "../common/redux/profile/ProfileHooks";
import { WorkElements } from "../common/components/WorkElements";
import { PAGE_SIZE } from "../common/utils/StandardValues";
import {
  WorkWithAuthor,
  getWorkWithAuthor,
} from "../common/components/models/UIModels";

export function Read() {
  // 0 means all
  const [currentFollowedId, setCurrentFollowedId] = useState(0);
  const [priorKeyset, _setPriorKeyset] = useState(0); // todo: need to build this out
  const [works, setWorks] = useState<WorkWithAuthor[] | null>(null);
  const [profile, _setProfile] = useProfile();

  const getCurrentSelectedFollowedId = (id: number) => {
    setCurrentFollowedId(id);
  };

  useEffect(() => {
    // todo: need to test these calls each
    if (currentFollowedId === 0) {
      kwilApi
        .getWorksByAllFollowed(profile?.id || 0, priorKeyset, PAGE_SIZE)
        .then((works) => {
          if (!works) {
            setWorks(null);
            return;
          }
          getWorkWithAuthor(works)
            .then((works) => setWorks(works))
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    } else {
      kwilApi
        .getWorksByOneFollowed(
          profile?.id || 0,
          currentFollowedId,
          priorKeyset,
          PAGE_SIZE
        )
        .then((works) => {
          if (!works) {
            setWorks(null);
            return;
          }
          getWorkWithAuthor(works)
            .then((works) => setWorks(works))
            .catch((e) => console.log(e));
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
        <div style={{ marginTop: "1.5em", width: "100%" }}>
          <WorkElements works={works} />
        </div>
      </div>
    </Layout>
  );
}
