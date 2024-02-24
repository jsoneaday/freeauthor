import { MouseEvent, ReactNode } from "react";
import { useProfile } from "../redux/profile/ProfileHooks";
import profileIcon from "../../theme/assets/profiles/mrglasses.jpg"; // todo: replace with user avatar when ready
import { kwilApi } from "../api/KwilApi";
import { NavAnchor } from "./NavAnchor";
import { ConnectCreateProfile } from "./ConnectCreateProfile";
import useNotificationState from "../redux/notification/NotificationStateHooks";

export interface LayoutProps {
  children: ReactNode;
}

/** todo: add button for editable modal **/
export function Layout({ children }: LayoutProps) {
  const [profile, _setProfile] = useProfile();
  const [notificationState, setNotificationState] = useNotificationState();

  const toggleNotificationState = () => {
    const newNotificationState = {
      ...notificationState,
      isOpen: !notificationState.isOpen,
    };

    setNotificationState(newNotificationState);
  };

  const onClickConnect = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleNotificationState();
  };

  return (
    <div className="layout-container">
      <nav className="layout-nav" style={{ marginBottom: "1em" }}>
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
          <button style={{ marginRight: "1.5em" }} onClick={async () => {}}>
            (Add Test Data)
          </button>
          {profile ? (
            <img src={profileIcon} className="profile-avatar" />
          ) : (
            <>
              <button onClick={onClickConnect}>CONNECT</button>
              <ConnectCreateProfile
                notificationState={notificationState}
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