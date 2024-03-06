import { MouseEvent, useState, useRef } from "react";
import { RandomImg } from "./RandomImage";
import { FollowTooltip } from "./modals/FollowTooltip";
import { Link } from "react-router-dom";

interface ResponseResponderDetailProps {
  showAuthor: boolean;
  workId: number;
  workTitle: string;
  responderId: number;
  responseUpdatedAt: string;
  userName: string;
  fullName: string;
}

export function ResponseResponderDetail({
  showAuthor,
  workId,
  workTitle,
  responderId,
  responseUpdatedAt,
  userName,
  fullName,
}: ResponseResponderDetailProps) {
  const [showFollowTooltip, setShowFollowTooltip] = useState(false);
  const [followTooltipTop, setFollowTooltipTop] = useState(0);
  const [followTooltipLeft, setFollowTooltipLeft] = useState(0);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const onMouseEnterFullname = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (!showFollowTooltip) {
      setShowFollowTooltip(true);
    }

    if (spanRef.current) {
      setFollowTooltipLeft(e.clientX + 16);
      setFollowTooltipTop(e.clientY);
    }
  };

  const onMouseEnterUsername = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (!showFollowTooltip) {
      setShowFollowTooltip(true);
    }

    if (spanRef.current) {
      setFollowTooltipLeft(e.clientX + 16);
      setFollowTooltipTop(e.clientY);
    }
  };

  const toggleShowFollowTooltip = () => {
    setShowFollowTooltip(!showFollowTooltip);
  };

  return (
    <>
      <FollowTooltip
        followedId={responderId}
        followedUsername={userName}
        followedFullname={fullName}
        isOpen={showFollowTooltip}
        toggleIsOpen={toggleShowFollowTooltip}
        topPosition={followTooltipTop}
        leftPosition={followTooltipLeft}
      />
      <div
        className="story-detail-top"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Link to={`/read/${workId}`}>
          <h2>{workTitle}</h2>
        </Link>
        {showAuthor ? (
          <>
            <span
              ref={spanRef}
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
                <span onMouseEnter={onMouseEnterFullname}>
                  <b>{fullName}</b>
                </span>{" "}
                <span
                  onMouseEnter={onMouseEnterUsername}
                >{`@${userName}`}</span>
              </div>
            </span>
          </>
        ) : null}
        <span style={{ fontSize: ".75em", color: "var(--tertiary-cl)" }}>
          {responseUpdatedAt}
        </span>
      </div>
    </>
  );
}
