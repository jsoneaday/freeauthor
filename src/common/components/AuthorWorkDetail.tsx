import { MouseEvent, useState, useEffect } from "react";
import { RandomImg } from "./RandomImage";
import { TipsResponses } from "./TipsResponses";
import { WorkWithAuthor } from "./models/UIModels";
import { FollowTooltip } from "./modals/FollowTooltip";
import { kwilApi } from "../api/KwilApiInstance";
import { Profile } from "../api/ApiModels";

const TOP_DIFF = 240;

interface AuthorWorkDetailProps {
  showAuthor: boolean;
  work: WorkWithAuthor | null;
}

export function AuthorWorkDetail({ showAuthor, work }: AuthorWorkDetailProps) {
  const [showFollowTooltip, setShowFollowTooltip] = useState(false);
  const [followTooltipTop, setFollowTooltipTop] = useState(0);
  const [followTooltipLeft, setFollowTooltipLeft] = useState(0);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  const onMouseEnterFullname = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (!showFollowTooltip) {
      setShowFollowTooltip(true);
    }

    setFollowTooltipLeft(e.clientX - 200);
    setFollowTooltipTop(e.clientY - TOP_DIFF);
  };

  const onMouseEnterUsername = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (!showFollowTooltip) {
      setShowFollowTooltip(true);
    }

    setFollowTooltipLeft(e.clientX + 40);
    setFollowTooltipTop(e.clientY - TOP_DIFF);
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
      <div className="story-detail-top">
        {showAuthor ? (
          <>
            {currentProfile ? (
              <FollowTooltip
                profile={currentProfile}
                isOpen={showFollowTooltip}
                toggleIsOpen={toggleShowFollowTooltip}
                topPosition={followTooltipTop}
                leftPosition={followTooltipLeft}
              />
            ) : null}

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
