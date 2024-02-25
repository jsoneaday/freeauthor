import { useEffect, useState } from "react";
import { MarkdownEditor } from "./MarkdownEditor";
import { WorkWithAuthor } from "./models/UIModels";

interface WorkElementsProps {
  works: WorkWithAuthor[] | null;
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
        <li key={`work-${works[i].id}`} className="stories-list-item">
          <span className="story-title">{works[i].title}</span>
          <span className="story-desc">{works[i].description}</span>
          <span className="story-title-item">{`${works[i].fullName} @${works[i].userName}`}</span>
          <span>{works[i].updatedAt}</span>
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
