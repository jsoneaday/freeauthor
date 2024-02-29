import { MouseEvent, ReactNode } from "react";
import { useProfile } from "../zustand/store";
import profileIcon from "../../theme/assets/profiles/mrglasses.jpg"; // todo: replace with user avatar when ready
import { kwilApi } from "../api/KwilApiInstance";
import { NavAnchor } from "./NavAnchor";
import { ConnectCreateProfile } from "./ConnectCreateProfile";
import useNotificationState from "../redux/notification/NotificationStateHooks";

export interface LayoutProps {
  children: ReactNode;
}

/** todo: add button for editable modal **/
export function Layout({ children }: LayoutProps) {
  const profile = useProfile((state) => state.profile);
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
      <nav className="layout-nav">
        <a href="/" className="layout-title">
          FREE-AUTHOR
        </a>
        <span className="layout-links">
          <NavAnchor path="/write/new" label="WRITE" />
          <NavAnchor path="/read/followed" label="READ" />
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
