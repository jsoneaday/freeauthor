import { MouseEvent, useState, useRef } from "react";
import { RandomImg } from "./RandomImage";
import { TipsResponses } from "./TipsResponses";
import { FollowTooltip } from "./modals/FollowTooltip";

interface AuthorWorkDetailProps {
  showAuthor: boolean;
  workId: number;
  authorId: number;
  workUpdatedAt: string;
  userName: string;
  fullName: string;
}

export function AuthorWorkDetail({
  showAuthor,
  workId,
  authorId,
  workUpdatedAt,
  userName,
  fullName,
}: AuthorWorkDetailProps) {
  const [showFollowTooltip, setShowFollowTooltip] = useState(false);
  const [followTooltipTop, setFollowTooltipTop] = useState(0);
  const [followTooltipLeft, setFollowTooltipLeft] = useState(0);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const onMouseEnter = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (!showFollowTooltip) {
      setShowFollowTooltip(true);
    }

    if (spanRef.current) {
      setFollowTooltipLeft(e.clientX);
      setFollowTooltipTop(e.clientY);
    }
  };

  const toggleShowFollowTooltip = () => {
    setShowFollowTooltip(!showFollowTooltip);
  };

  const onMouseLeave = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    toggleShowFollowTooltip();
  };

  return (
    <>
      <div className="story-detail-top">
        {showAuthor ? (
          <>
            <span
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              ref={spanRef}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                marginBottom: ".5em",
              }}
            >
              <FollowTooltip
                followedId={authorId}
                followedUsername={userName}
                followedFullname={fullName}
                isOpen={showFollowTooltip}
                toggleIsOpen={toggleShowFollowTooltip}
                topPosition={followTooltipTop}
                leftPosition={followTooltipLeft}
              />
              <RandomImg
                style={{
                  width: "1.5em",
                  height: "1.5em",
                  marginRight: ".5em",
                }}
              />
              <div className="story-title-item">
                <span>
                  <b>{fullName}</b>
                </span>{" "}
                <span>{`@${userName}`}</span>
              </div>
            </span>
          </>
        ) : null}
        <span style={{ fontSize: ".75em", color: "var(--tertiary-cl)" }}>
          {workUpdatedAt}
        </span>
      </div>
      <TipsResponses workId={workId || 0} />
    </>
  );
}
