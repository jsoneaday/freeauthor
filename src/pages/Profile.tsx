import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../common/components/Layout";

export function Profile() {
  const { profile_id } = useParams<{ profile_id: string }>();

  useEffect(() => {}, [profile_id]);

  return (
    <Layout>
      <div>
        Profile
        <div>Stories</div>
        <div>Responses</div>
        <div>Followed</div>
        <div>Followers</div>
      </div>
    </Layout>
  );
}
