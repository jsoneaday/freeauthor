import {
  MDXEditor,
  MDXEditorMethods,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { MouseEvent, Suspense, useCallback, useRef, useState } from "react";
import {
  addProfile,
  addWork,
  getTxEntityId,
  txInfo,
} from "../common/api/KwilApi";
import { Layout } from "../common/components/Layout";

export function Write() {
  const mdRef = useRef<MDXEditorMethods>(null);
  const [txOutputMsg, setTxOutputMsg] = useState("");
  const [currentProfileId, setCurrentProfileId] = useState(0);
  const [title, _setTitle] = useState("Hello world");
  const setEditorValue = (markdownStr: string) => {
    console.log("editor updated value", markdownStr);
  };
  const submitValue = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (currentProfileId === 0)
      throw new Error("First register a profile and connect");

    const tx = await addWork(
      title,
      mdRef.current?.getMarkdown() || "",
      currentProfileId
    );
    await waitAndGetId(tx);
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

    const id = await waitAndGetId(tx);
    setCurrentProfileId(id);
  };

  const waitAndGetId = useCallback(async (tx: string | null | undefined) => {
    console.log("tx info:", await txInfo(tx || ""));
    let id = 0;
    let iterations = 0;
    while (id === 0) {
      if (iterations > 5)
        throw new Error("Transaction failed to process within time alotted");

      id = await getTxEntityId(tx || "");

      await new Promise((r) => setTimeout(r, 3000));
      iterations += 1;
    }

    setTxOutputMsg(`New Profile created, id: ${id}`);
    return id;
  }, []);

  return (
    <Layout>
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
        <div
          style={{
            marginTop: "1em",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <button
            onClick={createProfile}
            className="primary-btn"
            style={{ width: "120px" }}
          >
            Create Profile
          </button>
          <button
            onClick={submitValue}
            className="primary-btn"
            style={{ width: "80px" }}
          >
            Submit
          </button>
          <Suspense
            fallback={<div>Please wait. Your request is processing ...</div>}
          >
            {txOutputMsg}
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}
