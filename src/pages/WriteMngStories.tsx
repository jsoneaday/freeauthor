import { Layout } from "../common/components/Layout";
import { NavAnchor } from "../common/components/NavAnchor";
import { Outlet } from "react-router-dom";
import { useProfile } from "../common/redux/profile/ProfileHooks";
import useNotificationState from "../common/redux/notification/NotificationStateHooks";
import { useEffect } from "react";

export function WriteMngStories() {
  const [profile] = useProfile();
  const [notificationState, setNotificationState] = useNotificationState();

  useEffect(() => {
    if (!profile) {
      const newNotificationState = {
        ...notificationState,
        isOpen: !notificationState.isOpen,
      };

      setNotificationState(newNotificationState);
    }
  }, [profile]);

  return (
    <Layout>
      <div className="home-double" style={{ marginTop: "1em" }}>
        <nav className="home-menu" style={{ marginTop: "1em" }}>
          <span
            className="standard-header"
            style={{ fontSize: "20px", marginBottom: "1em" }}
          >
            Manage Content
          </span>
          <span className="vertical-links">
            <span style={{ marginBottom: ".5em" }}>
              <NavAnchor path="/write/manage" label="Manage Stories" />
            </span>
            <NavAnchor path="/write/new" label="New Story" />
          </span>
        </nav>
        <Outlet />
      </div>
    </Layout>
  );
}
