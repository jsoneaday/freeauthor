import { FollowedList } from "../common/components/FollowedList";
import { Layout } from "../common/components/Layout";

export function Read() {
  return (
    <Layout>
      <FollowedList />
      <div className="home-single">Read</div>
    </Layout>
  );
}
