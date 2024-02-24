import { ReactNode, useEffect, useState } from "react";
import { Layout } from "../common/components/Layout";
import { kwilApi } from "../common/api/KwilApiInstance";
import { useProfile } from "../common/redux/profile/ProfileHooks";

export function ManageStories() {
  const [stories, setStories] = useState<ReactNode[]>();
  const [lastKeyset, setLastKeyset] = useState(0);
  const [profile, setProfile] = useProfile();

  useEffect(() => {
    if (profile) {
      kwilApi
        .getAuthorWorks(profile.id, lastKeyset, 20)
        .then((results) => {
          console.log("stories", results);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [profile]);

  return (
    <Layout>
      <div className="home-single">
        <ul className="stories-list"></ul>
      </div>
    </Layout>
  );
}
