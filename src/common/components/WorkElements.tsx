import { useEffect, useState } from "react";
import { Work } from "../api/ApiModels";
import { MarkdownEditor } from "./MarkdownEditor";

interface WorkElementsProps {
  works: Work[] | null;
}

export function WorkElements({ works }: WorkElementsProps) {
  const [workElements, setWorkElements] = useState<JSX.Element[] | null>();

  useEffect(() => {
    if (!works) {
      return undefined;
    }

    const workElements: JSX.Element[] = [];
    for (let i = 0; i < works.length; i++) {
      workElements.push(
        <li key={`work-${works[i].id}`} style={{ marginBottom: "4em" }}>
          <span className="work-title">{works[i].title}</span>
          <MarkdownEditor
            readOnly={true}
            markdown={works[i].content.substring(0, 500)}
          />
        </li>
      );
    }

    setWorkElements(workElements);
  }, [works]);

  return <ul className="stories-list">{workElements}</ul>;
}
