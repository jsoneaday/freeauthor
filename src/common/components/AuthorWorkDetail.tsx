import { RandomImg } from "./RandomImage";
import { TipsResponses } from "./TipsResponses";
import { WorkWithAuthor } from "./models/UIModels";

interface AuthorWorkDetailProps {
  showAuthor: boolean;
  work: WorkWithAuthor | null;
}

export function AuthorWorkDetail({ showAuthor, work }: AuthorWorkDetailProps) {
  return (
    <>
      <div className="story-detail-top">
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
              <b>{work?.fullName}</b> {`@${work?.userName}`}
            </div>
          </span>
        ) : null}
        <span style={{ fontSize: ".75em", color: "var(--tertiary-cl)" }}>
          {work?.updatedAt}
        </span>
      </div>
      <TipsResponses workId={work?.id || 0} />
    </>
  );
}
