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
import { formatLikeCount } from "../../common/utils/DetailInfoFormatter";
import likeImg from "../../theme/assets/app-icons/l-like-100.png";

export function ReadStory() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>("");
  const [work, setWork] = useState<WorkWithAuthor | null>();
  const { work_id } = useParams<{ work_id: string }>();
  const [likeCount, setLikeCount] = useState(0);
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

        kwilApi
          .getWorksLikeCount(work.id)
          .then((count) => {
            setLikeCount(count);
          })
          .catch((e) => console.log(e));

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
      <div className="story-detail">
        <div className="story-detail-top">
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
        <div className="story-detail-bottom">
          <img
            src={likeImg}
            style={{ width: "1.55em", marginRight: ".25em" }}
          />
          <span
            style={{
              fontSize: ".75em",
              color: "var(--tertiary-cl)",
              marginTop: ".1em",
            }}
          >
            {formatLikeCount(likeCount)}
          </span>
        </div>
      </div>
      {work ? <MarkdownEditor readOnly={true} markdown={work.content} /> : null}
    </div>
  );
}
