import {
  MDXEditor,
  MDXEditorMethods,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  toolbarPlugin,
  codeMirrorPlugin,
  codeBlockPlugin,
  listsPlugin,
  headingsPlugin,
  ListsToggle,
  ConditionalContents,
  InsertCodeBlock,
  ChangeCodeMirrorLanguage,
  markdown$,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useCallback } from "react";

interface MarkdownEditorProps {
  readOnly: boolean;
  markdown?: string;
  mdRef?: React.RefObject<MDXEditorMethods>;
}

export function MarkdownEditor({
  mdRef,
  markdown,
  readOnly,
}: MarkdownEditorProps) {
  const setEditorValue = useCallback((markdownStr: string) => {
    console.log("editor updated value", markdownStr);
  }, []);

  if (readOnly) {
    return (
      <ReadonlyEditor markdown={markdown} setEditorValue={setEditorValue} />
    );
  } else {
    return <WritableEditor mdRef={mdRef} setEditorValue={setEditorValue} />;
  }
}

interface EditorProps {
  setEditorValue: (markdownStr: string) => void;
  markdown?: string;
  mdRef?: React.RefObject<MDXEditorMethods>;
}

function ReadonlyEditor({ markdown, setEditorValue }: EditorProps) {
  console.log("markdown:", markdown);
  return (
    <MDXEditor
      className="mdx-container"
      markdown={markdown || ""}
      onChange={setEditorValue}
      readOnly={true}
    />
  );
}

/// Needed to do this because plugins cannot be set dynamically
function WritableEditor({ mdRef, setEditorValue }: EditorProps) {
  return (
    <MDXEditor
      className="mdx-container"
      ref={mdRef}
      markdown="Type your article"
      onChange={setEditorValue}
      plugins={Plugins}
    />
  );
}

const Plugins = [
  codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      c: "C",
      cplusplus: "C++",
      csharp: "C#",
      css: "CSS",
      erlang: "Erlang",
      go: "Go",
      groovy: "Groovy",
      haskell: "Haskell",
      html: "HTML",
      java: "Java",
      js: "Javascript",
      lua: "Lua",
      python: "Python",
      r: "R",
      ruby: "Ruby",
      sass: "SASS",
      scala: "Scala",
      smalltalk: "Smalltalk",
      sql: "SQL",
      ts: "Typescript",
    },
  }),
  listsPlugin(),
  headingsPlugin(),
  toolbarPlugin({
    toolbarContents: () => (
      <>
        {" "}
        <BlockTypeSelect />
        <UndoRedo />
        <BoldItalicUnderlineToggles />
        <ListsToggle />
        <ConditionalContents
          options={[
            {
              when: (editor) => editor?.editorType === "codeblock",
              contents: () => <ChangeCodeMirrorLanguage />,
            },
            {
              fallback: () => (
                <>
                  <InsertCodeBlock />
                </>
              ),
            },
          ]}
        />
      </>
    ),
  }),
];
