import MDEditor, { ContextStore } from "@uiw/react-md-editor";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import rehypeSanitize from "rehype-sanitize";
import { addProfile, addWork, txInfo } from "../common/api/KwilApi";

/// Multipart page
/// 1. Register
/// 2. Ask user what topics they like, must choose at least one
/// 3. Show latest most popular content tabbed by those topics
export function Explorer() {
  const [title, setTitle] = useState("Hello world");
  const [content, setContent] = useState("");
  const setEditorValue = (
    value: string | undefined,
    _event: ChangeEvent<HTMLTextAreaElement> | undefined,
    _state: ContextStore | undefined
  ) => {
    setContent(value || "");
  };
  const submitValue = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await addWork(title, content, 1);
  };

  const createProfile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const tx = await addProfile(
      "dave",
      "Dave Choi",
      "I am a programmer",
      "",
      ""
    );
    console.log("tx info:", await txInfo(tx || ""));
  };

  useEffect(() => {
    console.log("value:", content);
  }, [content]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <MDEditor
        value={content}
        onChange={setEditorValue}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
      <div style={{ marginTop: "1em" }}>
        <button onClick={createProfile} className="primary-btn">
          Create Profile
        </button>
        <button onClick={submitValue} className="primary-btn">
          Submit
        </button>
      </div>
    </div>
  );
}
