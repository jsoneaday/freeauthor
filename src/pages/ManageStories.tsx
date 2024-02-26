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
  const [priorKeyset, setPriorKeyset] = useState(0);
  const [profile, _setProfile] = useProfile();

  useEffect(() => {
    if (!profile) return;

    if (priorKeyset === 1) return;

    kwilApi
      .getAuthorWorks(profile.id, priorKeyset, PAGE_SIZE)
      .then((works) => {
        if (!works) {
          setWorks(null);
          return;
        }

        if (works.length > 0) {
          const keyset = works[works.length - 1].id - PAGE_SIZE;
          console.log(
            "reset priorKeyset:",
            keyset <= 0 ? 1 : keyset,
            works[works.length - 1].id
          );
          setPriorKeyset(keyset <= 0 ? 1 : keyset);
        }
        getWorkWithAuthor(works)
          .then((works) => setWorks(works))
          .catch((e) => console.log(e));
      })
      .catch((e) => {
        console.log(e);
      });
  }, [profile]);

  return (
    <div className="home-content" style={{ marginTop: "1.5em" }}>
      <WorkElements works={works} showAuthor={false} showContent={false} />
    </div>
  );
}
