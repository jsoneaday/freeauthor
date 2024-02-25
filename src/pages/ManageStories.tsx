import { useEffect, useState } from "react";
import { kwilApi } from "../common/api/KwilApiInstance";
import { useProfile } from "../common/redux/profile/ProfileHooks";
import { Work } from "../common/api/ApiModels";
import { WorkElements } from "../common/components/WorkElements";

export function ManageStories() {
  const [works, setWorks] = useState<Work[] | null>(null);
  const [lastKeyset, _setLastKeyset] = useState(0);
  const [profile, _setProfile] = useProfile();

  useEffect(() => {
    if (profile) {
      kwilApi
        .getAuthorWorks(profile.id, lastKeyset, 20)
        .then((works) => {
          setWorks(works);
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
