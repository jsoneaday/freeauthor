import { useEffect, useState } from "react";
import { MarkdownEditor } from "../../common/components/MarkdownEditor";
import {
  WorkWithAuthor,
  getWorkWithAuthor,
} from "../../common/components/models/UIModels";
import { useOutletContext, useParams } from "react-router-dom";
import { kwilApi } from "../../common/api/KwilApiInstance";
import { ReadOutletType } from "./Read";
import { RandomImg } from "../../common/components/RandomImage";

export function ReadStory() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>("");
  const [work, setWork] = useState<WorkWithAuthor | null>();
  const { work_id } = useParams<{ work_id: string }>();
  const { setShowFollowedList } = useOutletContext<ReadOutletType>();

  useEffect(() => {
    setShowFollowedList(false);

    kwilApi
      .getWork(Number(work_id))
      .then((work) => {
        if (!work) {
          setWork(null);
          return;
        }

        getWorkWithAuthor([work])
          .then((work) => {
            setTitle(work[0].title);
            setDescription(work[0].description);
            setWork(work[0]);
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  }, [work_id]);

  return (
    <div>
      <h1 className="story-title">{title}</h1>
      <h2 className="story-desc">{description}</h2>
      <div
        style={{
          marginLeft: ".5em",
          paddingBlock: "1em",
          borderBottom: "solid 1px var(--header-border-cl)",
        }}
      >
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
            <b>{work?.fullName}</b> {`@${work?.userName}`}
          </div>
        </span>
        <span style={{ fontSize: ".75em", color: "var(--tertiary-cl)" }}>
          {work?.updatedAt}
        </span>
      </div>
      {work ? (
        <MarkdownEditor
          readOnly={true}
          markdown={work.content.substring(0, 500)}
        />
      ) : null}
    </div>
  );
}
