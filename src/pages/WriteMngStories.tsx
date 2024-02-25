import { Layout } from "../common/components/Layout";
import { NavAnchor } from "../common/components/NavAnchor";
import { Outlet } from "react-router-dom";

export function WriteMngStories() {
  return (
    <Layout>
      <div className="home-double">
        <nav className="home-menu" style={{ marginTop: ".1em" }}>
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
