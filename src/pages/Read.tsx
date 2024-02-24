import { MDXEditorMethods } from "@mdxeditor/editor";
import { FollowedList } from "../common/components/FollowedList";
import { Layout } from "../common/components/Layout";
import { MarkdownEditor } from "../common/components/MarkdownEditor";
import { useRef, useState } from "react";

export function Read() {
  // 0 means all
  const [currentFollowedId, setCurrentFollowedId] = useState(0);
  const mdRef = useRef<MDXEditorMethods>(null);

  const getCurrentSelectedFollowedId = (id: number) => {
    console.log("profile id", id);
    setCurrentFollowedId(id);
  };

  return (
    <Layout>
      <div className="home-single">
        <FollowedList
          getCurrentSelectedFollowedId={getCurrentSelectedFollowedId}
        />
        <div style={{ marginTop: "1.5em", width: "100%" }}>
          <MarkdownEditor mdRef={mdRef} readOnly={true} />
        </div>
      </div>
    </Layout>
  );
}
