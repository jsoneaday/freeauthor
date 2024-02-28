import { useEffect, useState } from "react";
import { MarkdownEditor } from "./MarkdownEditor";
import { WorkWithAuthor } from "./models/UIModels";
import { RandomImg } from "./RandomImage";
/// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

interface WorkElementsProps {
  works: WorkWithAuthor[] | null;
  refresh: boolean; // reset all data, do not append
  showAuthor?: boolean;
  showContent?: boolean;
  twoColumn?: boolean;
}

export function WorkElements({
  works,
  refresh,
  showAuthor = true,
  showContent = true,
  twoColumn = false,
}: WorkElementsProps) {
  const [workElements, setWorkElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!works) {
      return undefined;
    }
    console.log("WorkElements works updated", works);
    const localWorkElements: JSX.Element[] = [];
    for (let i = 0; i < works.length; i++) {
      localWorkElements.push(
        <li
          key={`work-${uuidv4()}`}
          style={{ display: "flex", width: twoColumn ? "49%" : "100%" }}
        >
          <RandomImg
            isProfile={false}
            style={{ height: "6em", marginRight: "1em" }}
          />
          <Link to={`/write/edit/${works[i].id}`} className="stories-list-item">
            <span
              className={`story-title ${twoColumn ? "story-title-small" : ""}`}
            >
              {works[i].title}
            </span>
            <span
              className={`story-desc ${twoColumn ? "story-desc-small" : ""}`}
            >
              {works[i].description}
            </span>
            {showAuthor ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginBottom: ".5em",
                }}
              >
                <RandomImg
                  style={{
                    width: "1.5em",
                    height: "1.5em",
                    marginRight: ".5em",
                  }}
                />
                <div className="story-title-item">
                  <b>{works[i].fullName}</b> {`@${works[i].userName}`}
                </div>
              </span>
            ) : null}
            <span style={{ fontSize: ".75em", color: "var(--tertiary-cl)" }}>
              {works[i].updatedAt}
            </span>
            {showContent ? (
              <MarkdownEditor
                readOnly={true}
                markdown={works[i].content.substring(0, 500)}
              />
            ) : null}
          </Link>
        </li>
      );
    }

    if (!refresh) {
      setWorkElements([...workElements, ...localWorkElements]);
    } else {
      setWorkElements(localWorkElements);
    }
  }, [works]);

  return (
    <>
      <div>
        <ul className="stories-list">{workElements}</ul>
      </div>
    </>
  );
}
