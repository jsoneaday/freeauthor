import {
  MDXEditor,
  MDXEditorMethods,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  toolbarPlugin,
  codeMirrorPlugin,
  codeBlockPlugin,
  ConditionalContents,
  InsertCodeBlock,
  ChangeCodeMirrorLanguage,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useCallback } from "react";

interface MarkdownEditorProps {
  mdRef: React.RefObject<MDXEditorMethods>;
}

export function MarkdownEditor({ mdRef }: MarkdownEditorProps) {
  const setEditorValue = useCallback((markdownStr: string) => {
    console.log("editor updated value", markdownStr);
  }, []);

  return (
    <MDXEditor
      className="mdx-container"
      ref={mdRef}
      markdown="Type your article"
      onChange={setEditorValue}
      plugins={[
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
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {" "}
              <BlockTypeSelect />
              <UndoRedo />
              <BoldItalicUnderlineToggles />
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
      ]}
    />
  );
}
