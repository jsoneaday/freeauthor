import { FollowedList } from "../common/components/FollowedList";
import { Layout } from "../common/components/Layout";

export function Read() {
  return (
    <Layout>
      <div className="home-single">
        <FollowedList />
        <div style={{ marginTop: "1.5em" }}>Read body</div>
      </div>
    </Layout>
  );
}
