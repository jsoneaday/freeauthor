import { MouseEvent, useState, useRef, useEffect } from "react";
import { RandomImg } from "./RandomImage";
import { FollowTooltip } from "./modals/FollowTooltip";
import { Link } from "react-router-dom";
import { ResponseWithResponder } from "./models/UIModels";
import { kwilApi } from "../api/KwilApiInstance";

interface ResponseResponderDetailProps {
  showAuthor: boolean;
  work: ResponseWithResponder;
  showWorkTitle?: boolean;
}

export function ResponseResponderDetail({
  showAuthor,
  work,
  showWorkTitle = true,
}: ResponseResponderDetailProps) {
  const [showFollowTooltip, setShowFollowTooltip] = useState(false);
  const [followTooltipTop, setFollowTooltipTop] = useState(0);
  const [followTooltipLeft, setFollowTooltipLeft] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    kwilApi
      .getFollowedCount(work.responderId)
      .then((followingCount) => {
        kwilApi
          .getFollowerCount(work.responderId)
          .then((followerCount) => {
            setFollowingCount(followingCount);
            setFollowerCount(followerCount);
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  }, [work]);

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

  return (
    <>
      <FollowTooltip
        followedId={work.responderId}
        followedUsername={work.userName}
        followedFullname={work.fullName}
        followedDesc={work.profileDesc}
        followingCount={followingCount}
        followerCount={followerCount}
        isOpen={showFollowTooltip}
        topPosition={followTooltipTop}
        leftPosition={followTooltipLeft}
      />
      <div
        className="story-detail-top"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {showWorkTitle ? (
          <Link to={`/read/${work.id}`}>
            <h2>{work.workTitle}</h2>
          </Link>
        ) : null}
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
                  <b>{work.fullName}</b>
                </span>{" "}
                <span
                  onMouseEnter={onMouseEnterUsername}
                >{`@${work.userName}`}</span>
              </div>
            </span>
          </>
        ) : null}
        <span style={{ fontSize: ".75em", color: "var(--tertiary-cl)" }}>
          {work.updatedAt}
        </span>
      </div>
    </>
  );
}
