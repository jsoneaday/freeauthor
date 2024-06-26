import { MouseEvent, ReactNode } from "react";
import { useProfile } from "../zustand/Store";
import profileIcon from "../../theme/assets/profiles/mrglasses.jpg"; // todo: replace with user avatar when ready
import { NavAnchor } from "./NavAnchor";
import { ConnectCreateProfile } from "./ConnectCreateProfile";
import { useNotification } from "../zustand/Store";
import { Link } from "react-router-dom";

export interface LayoutProps {
  children: ReactNode;
}

/** todo: add button for editable modal **/
export function Layout({ children }: LayoutProps) {
  const profile = useProfile((state) => state.profile);
  const notificationIsOpen = useNotification((state) => state.isOpen);
  const toggleNotification = useNotification(
    (state) => state.toggleNotification
  );

  const toggleNotificationState = () => {
    toggleNotification();
  };

  const onClickConnect = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleNotificationState();
  };

  return (
    <div className="layout-container">
      <nav className="layout-nav">
        <a href="/" className="layout-title">
          FREE-AUTHOR
        </a>
        <span className="layout-links">
          <NavAnchor path="/write/new" label="WRITE" />
          <NavAnchor path="/read/followed" label="READ" />
          <NavAnchor path="/explorer" label="EXPLORE" />
        </span>
        <span style={{ display: "flex", alignItems: "center" }}>
          {profile ? (
            <Link to={`/profile/${profile.id}`}>
              <img src={profileIcon} className="profile-avatar" />
            </Link>
          ) : (
            <>
              <button onClick={onClickConnect}>CONNECT</button>
              <ConnectCreateProfile
                notificationState={notificationIsOpen}
                toggleNotificationState={toggleNotificationState}
              />
            </>
          )}
        </span>
      </nav>
      {children}
    </div>
  );
}
