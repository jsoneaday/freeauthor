import { memo, useEffect, useState } from "react";
import { MarkdownEditor } from "../MarkdownEditor";
import { WorkWithAuthor } from "../models/UIModels";
import { RandomImg } from "../RandomImage";
/// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { AuthorWorkDetail } from "../AuthorWorkDetail";

/// @startFresh stop appending and create new element list
interface WorkElementsProps {
  works: WorkWithAuthor[] | null;
  readOnly?: boolean;
  showAuthor?: boolean;
  showContent?: boolean;
  columnCount?: number;
}

function WorkElementsComponent({
  works,
  readOnly,
  showAuthor = true,
  showContent = true,
  columnCount = 1,
}: WorkElementsProps) {
  const [workElements, setWorkElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!works || works.length === 0) {
      return undefined;
    }

    let itemWidth = "100%";
    if (columnCount === 2) {
      itemWidth = "49%";
    } else if (columnCount === 3) {
      itemWidth = "33%";
    }

    const localWorkElements: JSX.Element[] = [];
    for (let i = 0; i < works.length; i++) {
      localWorkElements.push(
        <li
          key={`work-${uuidv4()}`}
          style={{ display: "flex", width: itemWidth }}
        >
          <RandomImg
            isProfile={false}
            style={{ height: "6em", marginRight: "1em" }}
          />
          <Link
            to={
              !readOnly ? `/write/edit/${works[i].id}` : `/read/${works[i].id}`
            }
            className="stories-list-item"
          >
            <span
              className={`story-title ${
                columnCount > 1 ? "story-title-small" : ""
              }`}
            >
              {works[i].title}
            </span>
            <span
              className={`story-desc ${
                columnCount > 1 ? "story-desc-small" : ""
              }`}
            >
              {works[i].description}
            </span>
            <AuthorWorkDetail showAuthor={showAuthor} work={works[i]} />
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
    setWorkElements(localWorkElements);
  }, [works]);

  return (
    <>
      <div>
        <ul className="stories-list">{workElements}</ul>
      </div>
    </>
  );
}

export const WorkElements = memo(WorkElementsComponent);