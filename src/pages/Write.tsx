import { MouseEvent, useEffect, useRef, useState } from "react";
import { Layout } from "../common/components/Layout";
import { useProfile } from "../common/redux/profile/ProfileHooks";
import { kwilApi } from "../common/api/KwilApi";
import { PrimaryButton } from "../common/components/Buttons";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { MarkdownEditor } from "../common/components/MarkdownEditor";
import { NavAnchor } from "../common/components/NavAnchor";
import useNotificationState from "../common/redux/notification/NotificationStateHooks";

export function Write() {
  const mdRef = useRef<MDXEditorMethods>(null);
  const [txOutputMsg, _setTxOutputMsg] = useState("");
  const [profile, _setProfile] = useProfile();
  const [title, _setTitle] = useState("Hello world");
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
            <NavAnchor path="/write" label="New Story" />
          </span>
        </nav>
        <div className="home-content">
          <MarkdownEditor mdRef={mdRef} />
          <div className="btn-span-align" style={{ marginTop: "1em" }}>
            <span style={{ marginRight: "2em" }}>{txOutputMsg}</span>
            <PrimaryButton
              label="Submit"
              onClick={submitValue}
              style={{ width: "80px" }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
