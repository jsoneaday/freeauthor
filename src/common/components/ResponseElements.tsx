import { memo, useEffect, useState } from "react";
import { ResponseWithResponder } from "./models/UIModels";
/// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { ResponseResponderDetail } from "./ResponseResponderDetail";
import { TabHeader } from "./TabHeader";

/// @works is named such do to sharing with PagedWorkElements component
interface ResponseElementsProps {
  works: ResponseWithResponder[] | null;
  showAuthor?: boolean;
}

function ResponseElementsComponent({
  works,
  showAuthor = true,
}: ResponseElementsProps) {
  const [workElements, setWorkElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!works || works.length === 0) {
      return undefined;
    }

    let itemWidth = "100%";

    const localWorkElements: JSX.Element[] = [];
    for (let i = 0; i < works.length; i++) {
      localWorkElements.push(
        <li
          key={`work-${uuidv4()}`}
          style={{
            display: "flex",
            flexDirection: "column",
            width: itemWidth,
            marginBottom: "2.5em",
          }}
        >
          <ResponseResponderDetail
            showAuthor={showAuthor}
            responderId={works[i].responderId}
            responseUpdatedAt={works[i].updatedAt}
            userName={works[i].responderUserName}
            fullName={works[i].responderFullName}
          />
          <span>{works[i].content}</span>
        </li>
      );
    }
    setWorkElements(localWorkElements);
  }, [works]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TabHeader headerName="Responses" />
        <ul className="stories-list" style={{ marginTop: "1.5em" }}>
          {workElements}
        </ul>
      </div>
    </>
  );
}

export const ResponseElements = memo(ResponseElementsComponent);
