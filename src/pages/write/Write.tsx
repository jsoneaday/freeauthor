import { Layout } from "../../common/components/Layout";
import { NavAnchor } from "../../common/components/NavAnchor";
import { Outlet } from "react-router-dom";
import { useProfile } from "../../common/zustand/Store";
import { useNotification } from "../../common/zustand/Store";
import { useEffect } from "react";

export function Write() {
  const profile = useProfile((state) => state.profile);
  const toggleNotification = useNotification(
    (state) => state.toggleNotification
  );

  useEffect(() => {
    if (!profile) {
      toggleNotification();
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
