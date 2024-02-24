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
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useCallback } from "react";

interface MarkdownEditorProps {
  mdRef: React.RefObject<MDXEditorMethods>;
  readOnly: boolean;
}

export function MarkdownEditor({ mdRef, readOnly }: MarkdownEditorProps) {
  const setEditorValue = useCallback((markdownStr: string) => {
    console.log("editor updated value", markdownStr);
  }, []);

  if (readOnly) {
    return <ReadonlyEditor mdRef={mdRef} setEditorValue={setEditorValue} />;
  } else {
    return <WritableEditor mdRef={mdRef} setEditorValue={setEditorValue} />;
  }
}

interface EditorProps {
  mdRef: React.RefObject<MDXEditorMethods>;
  setEditorValue: (markdownStr: string) => void;
}

function ReadonlyEditor({ mdRef, setEditorValue }: EditorProps) {
  return (
    <MDXEditor
      className="mdx-container"
      ref={mdRef}
      markdown="Type your article"
      onChange={setEditorValue}
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
