import { MouseEvent, useState, useEffect, useRef } from "react";
import { RandomImg } from "./RandomImage";
import { TipsResponses } from "./TipsResponses";
import { WorkWithAuthor } from "./models/UIModels";
import { FollowTooltip } from "./modals/FollowTooltip";
import { kwilApi } from "../api/KwilApiInstance";
import { ProfileModel } from "../api/ApiModels";

interface AuthorWorkDetailProps {
  showAuthor: boolean;
  work: WorkWithAuthor | null;
}

export function AuthorWorkDetail({ showAuthor, work }: AuthorWorkDetailProps) {
  const [showFollowTooltip, setShowFollowTooltip] = useState(false);
  const [followTooltipTop, setFollowTooltipTop] = useState(0);
  const [followTooltipLeft, setFollowTooltipLeft] = useState(0);
  const [currentProfile, setCurrentProfile] = useState<ProfileModel | null>(
    null
  );
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const onMouseEnterFullname = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (!showFollowTooltip) {
      setShowFollowTooltip(true);
    }
    console.log(
      "x, y:",
      spanRef.current?.offsetLeft,
      spanRef.current?.offsetTop
    );
    if (spanRef.current) {
      setFollowTooltipLeft(spanRef.current?.offsetLeft);
      setFollowTooltipTop(spanRef.current?.offsetTop);
    }
  };

  const onMouseEnterUsername = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (!showFollowTooltip) {
      setShowFollowTooltip(true);
    }
    console.log(
      "x, y:",
      spanRef.current?.offsetLeft,
      spanRef.current?.offsetTop
    );
    if (spanRef.current) {
      setFollowTooltipLeft(spanRef.current?.offsetLeft);
      setFollowTooltipTop(spanRef.current?.offsetTop);
    }
  };

  const toggleShowFollowTooltip = () => {
    setShowFollowTooltip(!showFollowTooltip);
  };

  useEffect(() => {
    if (work) {
      kwilApi.getProfile(work.authorId).then((profile) => {
        setCurrentProfile(profile);
      });
    }
  }, [work]);

  return (
    <>
      {currentProfile ? (
        <FollowTooltip
          followed={currentProfile}
          isOpen={showFollowTooltip}
          toggleIsOpen={toggleShowFollowTooltip}
          topPosition={followTooltipTop}
          leftPosition={followTooltipLeft}
        />
      ) : null}
      <div className="story-detail-top">
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
                  <b>{work?.fullName}</b>
                </span>{" "}
                <span
                  onMouseEnter={onMouseEnterUsername}
                >{`@${work?.userName}`}</span>
              </div>
            </span>
          </>
        ) : null}
        <span style={{ fontSize: ".75em", color: "var(--tertiary-cl)" }}>
          {work?.updatedAt}
        </span>
      </div>
      <TipsResponses workId={work?.id || 0} />
    </>
  );
}
