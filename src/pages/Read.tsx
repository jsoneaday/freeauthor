import { MDXEditorMethods } from "@mdxeditor/editor";
import { FollowedList } from "../common/components/FollowedList";
import { Layout } from "../common/components/Layout";
import { MarkdownEditor } from "../common/components/MarkdownEditor";
import { useRef } from "react";

export function Read() {
  const mdRef = useRef<MDXEditorMethods>(null);
  return (
    <Layout>
      <div className="home-single">
        <FollowedList />
        <div style={{ marginTop: "1.5em", width: "100%" }}>
          <MarkdownEditor mdRef={mdRef} readOnly={true} />
        </div>
      </div>
    </Layout>
  );
}
