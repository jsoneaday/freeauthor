import { ReactNode } from "react";
import { useProfile } from "../redux/profile/ProfileHooks";
import profileIcon from "../../theme/assets/businessman.png"; // todo: replace with user avatar when ready
import { kwilApi } from "../api/KwilApi";
import { NavAnchor } from "./NavAnchor";

export interface LayoutProps {
  children: ReactNode;
}

/** todo: add button for editable modal **/
export function Layout({ children }: LayoutProps) {
  const [profile, _setProfile] = useProfile();

  return (
    <div className="layout-container">
      <nav className="layout-nav">
        <a href="/" className="layout-title">
          FREE-AUTHOR
        </a>
        <span className="layout-links">
          <NavAnchor path="/write" label="WRITE" />
          <NavAnchor path="/read" label="READ" />
          <NavAnchor path="/explore" label="EXPLORE" />
        </span>
        <span style={{ display: "flex", alignItems: "center" }}>
          <button
            style={{ marginRight: "1.5em" }}
            onClick={async () => await kwilApi.cleanDb()}
          >
            (Clean DB)
          </button>
          {profile ? (
            <img src={profileIcon} className="profile-avatar" />
          ) : (
            <button>CONNECT</button>
          )}
        </span>
      </nav>
      {children}
    </div>
  );
}
