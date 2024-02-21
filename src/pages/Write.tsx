import {
  MDXEditor,
  MDXEditorMethods,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { Layout } from "../common/components/Layout";
import { useProfile } from "../common/redux/profile/ProfileHooks";
import { kwilApi } from "../common/api/KwilApi";
import { NotificationType } from "../common/components/modals/Notification";
import Notification from "../common/components/modals/Notification";
import useNotificationState from "../common/redux/notification/NotificationStateHooks";
import { ProfileForm } from "../common/components/ProfileForm";
import { PrimaryButton } from "../common/components/Buttons";

const SMALL_NOTIFICATION_HEIGHT = "170px";
const LARGE_NOTIFICATION_HEIGHT = "580px";

export function Write() {
  const mdRef = useRef<MDXEditorMethods>(null);
  const [txOutputMsg, _setTxOutputMsg] = useState("");
  const [profile, setProfile] = useProfile();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [title, _setTitle] = useState("Hello world");
  const [notificationState, setNotificationState] = useNotificationState();
  const [notificationHeight, setNotificationHeight] = useState(
    SMALL_NOTIFICATION_HEIGHT
  );
  const [connectValidationMsg, setConnectValidationMsg] = useState("");
  const setEditorValue = useCallback((markdownStr: string) => {
    console.log("editor updated value", markdownStr);
  }, []);

  const submitValue = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!profile || profile?.id === 0)
      throw new Error("First register a profile and connect");

    const tx = await kwilApi.addWork(
      title,
      mdRef.current?.getMarkdown() || "",
      profile.id
    );
    await kwilApi.waitAndGetId(tx);
  };

  const toggleProfileNotification = () => {
    const newNotificationState = {
      ...notificationState,
      isOpen: !notificationState.isOpen,
    };

    setNotificationState(newNotificationState);
  };

  const onClickConnectWallet = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!profile) {
      await kwilApi.connect();
      const ownersProfile = await kwilApi.getOwnersProfile();
      if (!ownersProfile) {
        setShowProfileForm(true);
        setNotificationHeight(LARGE_NOTIFICATION_HEIGHT);
        setConnectValidationMsg(
          "You must create a profile before you can create content"
        );
      } else {
        // if profile already exits just allow writing
        toggleProfileNotification();
        setProfile({
          id: ownersProfile?.id,
          updatedAt: ownersProfile.updated_at,
          username: ownersProfile.username,
          fullname: ownersProfile.fullname,
          description: ownersProfile.description,
          ownerAddress: ownersProfile.owner_address,
          socialLinkPrimary: ownersProfile.social_link_primary,
          socialLinkSecond: ownersProfile.social_link_second,
        });
        setShowProfileForm(false);
        setNotificationHeight(SMALL_NOTIFICATION_HEIGHT);
        setConnectValidationMsg("");
      }
    }
  };

  useEffect(() => {
    if (!profile) {
      toggleProfileNotification();
    }
  }, [profile]);

  return (
    <Layout>
      <Notification
        title="Notification"
        notiType={NotificationType.Warning}
        isOpen={notificationState.isOpen}
        toggleIsOpen={toggleProfileNotification}
        width="25%"
        height={notificationHeight}
      >
        <span className="write-connect-header">
          Please connect your wallet {/* todo: need supported wallets button */}
        </span>
        <span className="btn-span-align" style={{ marginTop: "1em" }}>
          <div style={{ marginTop: "1.25em", color: "var(--error-cl)" }}>
            {connectValidationMsg}
          </div>
          <PrimaryButton
            label="Connect"
            style={{ marginTop: "1em" }}
            onClick={onClickConnectWallet}
          />
        </span>
        {showProfileForm ? (
          <div className="profile-form-parent">
            <ProfileForm profileCreatedCallback={toggleProfileNotification} />
          </div>
        ) : null}
      </Notification>
      <div className="home">
        <MDXEditor
          className="mdx-container"
          ref={mdRef}
          markdown="Type your article"
          onChange={setEditorValue}
          plugins={[
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  {" "}
                  <BlockTypeSelect />
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                </>
              ),
            }),
          ]}
        />
        <div className="btn-span-align" style={{ marginTop: "1em" }}>
          <span style={{ marginRight: "2em" }}>{txOutputMsg}</span>
          <PrimaryButton
            label="Submit"
            onClick={submitValue}
            style={{ width: "80px" }}
          />
        </div>
      </div>
    </Layout>
  );
}
