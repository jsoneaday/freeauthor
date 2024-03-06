import { MouseEvent, useState, useRef, useEffect } from "react";
import { RandomImg } from "./RandomImage";
import { TipsResponses } from "./TipsResponses";
import { FollowTooltip } from "./modals/FollowTooltip";
import { WorkWithAuthor } from "./models/UIModels";
import { kwilApi } from "../api/KwilApiInstance";

interface AuthorWorkDetailProps {
  showAuthor: boolean;
  work: WorkWithAuthor;
}

export function AuthorWorkDetail({ showAuthor, work }: AuthorWorkDetailProps) {
  const [showFollowTooltip, setShowFollowTooltip] = useState(false);
  const [followTooltipTop, setFollowTooltipTop] = useState(0);
  const [followTooltipLeft, setFollowTooltipLeft] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    kwilApi
      .getFollowedCount(work.authorId)
      .then((followingCount) => {
        kwilApi
          .getFollowerCount(work.authorId)
          .then((followerCount) => {
            setFollowingCount(followingCount);
            setFollowerCount(followerCount);
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  }, [work]);

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
                followedId={work.authorId}
                followedUsername={work.userName}
                followedFullname={work.fullName}
                followedDesc={work.profileDesc}
                followingCount={followingCount}
                followerCount={followerCount}
                isOpen={showFollowTooltip}
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
                  <b>{work.fullName}</b>
                </span>{" "}
                <span>{`@${work.userName}`}</span>
              </div>
            </span>
          </>
        ) : null}
        <span style={{ fontSize: ".75em", color: "var(--tertiary-cl)" }}>
          {work.updatedAt}
        </span>
      </div>
      <TipsResponses workId={work.id || 0} />
    </>
  );
}
