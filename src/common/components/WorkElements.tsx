import { useEffect, useState } from "react";
import { MarkdownEditor } from "./MarkdownEditor";
import { WorkWithAuthor } from "./models/UIModels";
import { RandomImg } from "./FollowedList";
/// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

interface WorkElementsProps {
  works: WorkWithAuthor[] | null;
  showAuthor?: boolean;
  showContent?: boolean;
  twoColumn?: boolean;
}

export function WorkElements({
  works,
  showAuthor = true,
  showContent = true,
  twoColumn = false,
}: WorkElementsProps) {
  const [workElements, setWorkElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!works) {
      return undefined;
    }

    const localWorkElements: JSX.Element[] = [];
    for (let i = 0; i < works.length; i++) {
      localWorkElements.push(
        <Link to={`/write/edit/${works[i].id}`} key={`work-${uuidv4()}`}>
          <li
            className="stories-list-item"
            style={{ width: twoColumn ? "45%" : "100%" }}
          >
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
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <RandomImg
                  style={{
                    width: "1.5em",
                    height: "1.5em",
                    marginRight: ".5em",
                  }}
                />
                <span className="story-title-item">
                  <b>{works[i].fullName}</b> {`@${works[i].userName}`}
                </span>
              </span>
            ) : null}
            <span style={{ fontSize: ".8em" }}>{works[i].updatedAt}</span>
            {showContent ? (
              <MarkdownEditor
                readOnly={true}
                markdown={works[i].content.substring(0, 500)}
              />
            ) : null}
          </li>
        </Link>
      );
    }

    setWorkElements([...workElements, ...localWorkElements]);
  }, [works]);

  return (
    <>
      <div>
        <ul className="stories-list">{workElements}</ul>
      </div>
    </>
  );
}
