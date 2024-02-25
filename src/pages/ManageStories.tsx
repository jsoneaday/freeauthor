import { useEffect, useState } from "react";
import { kwilApi } from "../common/api/KwilApiInstance";
import { useProfile } from "../common/redux/profile/ProfileHooks";
import { WorkElements } from "../common/components/WorkElements";
import { PAGE_SIZE } from "../common/utils/StandardValues";
import {
  WorkWithAuthor,
  getWorkWithAuthor,
} from "../common/components/models/UIModels";

export function ManageStories() {
  const [works, setWorks] = useState<WorkWithAuthor[] | null>(null);
  const [lastKeyset, _setLastKeyset] = useState(0);
  const [profile, _setProfile] = useProfile();

  useEffect(() => {
    if (profile) {
      kwilApi
        .getAuthorWorks(profile.id, lastKeyset, PAGE_SIZE)
        .then((works) => {
          if (!works) {
            setWorks(null);
            return;
          }
          console.log("got works", works);
          getWorkWithAuthor(works)
            .then((works) => setWorks(works))
            .catch((e) => console.log(e));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [profile]);

  return (
    <div className="home-content" style={{ marginTop: "1.5em" }}>
      <WorkElements works={works} />
    </div>
  );
}
