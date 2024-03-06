import { MouseEvent, useEffect, useState } from "react";
import { kwilApi } from "../../api/KwilApiInstance";
import { useProfile } from "../../zustand/Store";
import { ProfileConcentractedDesc } from "../ProfileConcentratedDesc";

interface FollowModalProps {
  followedId: number;
  followedUsername: string;
  followedFullname: string;
  isOpen: boolean;
  toggleIsOpen: () => void;
  topPosition: number;
  leftPosition: number;
}

export function FollowTooltip({
  followedId,
  followedUsername,
  followedFullname,
  isOpen,
  toggleIsOpen,
  topPosition,
  leftPosition,
}: FollowModalProps) {
  const profile = useProfile((state) => state.profile);
  const [isAlreadyFollowing, setIsAlreadyFollowing] = useState(false);
  const [followBtn, setFollowBtn] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (profile) {
      confirmFollowed();
    } else {
      setIsAlreadyFollowing(false);
    }
  }, [profile]);

  useEffect(() => {
    if (isAlreadyFollowing) {
      setFollowBtn(<span>Following</span>);
    } else {
      setFollowBtn(
        <button
          className="primary-btn"
          onClick={async (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();

            if (profile) {
              const tx = await kwilApi.addFollow(profile.id || 0, followedId);
              await kwilApi.testWaitAndGetId(tx, "follows");
              await confirmFollowed();
            } else {
              console.log("Cannot follow not logged in!");
            }
          }}
        >
          Follow
        </button>
      );
    }
  }, [isAlreadyFollowing, profile]);

  const confirmFollowed = async () => {
    if (profile) {
      // todo: consider replacing with direct check call
      const follows = await kwilApi.getFollwedProfiles(profile.id || 0);

      if (follows) {
        if (follows.find((follow) => follow.id === followedId)) {
          setIsAlreadyFollowing(true);
        } else {
          setIsAlreadyFollowing(false);
        }
      } else {
        setIsAlreadyFollowing(false);
      }
    }
  };

  const onExitClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    toggleIsOpen();
  };

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
        <div
          style={{
            position: "absolute",
            fontSize: "1.1em",
            top: 10,
            left: 272,
          }}
          onClick={onExitClick}
        >
          x
        </div>
        <ProfileConcentractedDesc
          fullName={followedFullname}
          userName={followedUsername}
          style={{ marginBottom: "1em" }}
        />
        <div className="follow-tooltip-item" style={{ marginLeft: ".5em" }}>
          {profile ? (
            followBtn
          ) : (
            <span>Please connect your wallet in order to follow</span>
          )}
        </div>
      </div>
    );
  } else {
    null;
  }
}
