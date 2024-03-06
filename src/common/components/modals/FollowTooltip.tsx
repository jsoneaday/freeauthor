import { MouseEvent } from "react";
import { ProfileConcentractedDesc } from "../ProfileConcentratedDesc";

interface FollowModalProps {
  followedId: number;
  followedUsername: string;
  followedFullname: string;
  followedDesc: string;
  followingCount: number;
  followerCount: number;
  isOpen: boolean;
  topPosition: number;
  leftPosition: number;
}

export function FollowTooltip({
  followedId,
  followedUsername,
  followedFullname,
  followedDesc,
  followingCount,
  followerCount,
  isOpen,
  topPosition,
  leftPosition,
}: FollowModalProps) {
  const onRootClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  if (isOpen) {
    return (
      <div
        onClick={onRootClick}
        className="follow-tooltip"
        style={{
          top: topPosition,
          left: leftPosition,
        }}
      >
        <ProfileConcentractedDesc
          profileId={followedId}
          fullName={followedFullname}
          userName={followedUsername}
          profileDesc={followedDesc}
          followingCount={followingCount}
          followerCount={followerCount}
          style={{ width: "280px" }}
        />
      </div>
    );
  } else {
    null;
  }
}
