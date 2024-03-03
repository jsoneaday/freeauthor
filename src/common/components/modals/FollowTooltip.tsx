import { ProfileModel } from "../../api/ApiModels";
import { Profile } from "../../zustand/Profile";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { RandomImg } from "../RandomImage";
import { kwilApi } from "../../api/KwilApiInstance";
import { useProfile } from "../../zustand/Store";

interface FollowModalProps {
  followed: ProfileModel;
  isOpen: boolean;
  toggleIsOpen: () => void;
  topPosition: number;
  leftPosition: number;
}

export function FollowTooltip({
  followed,
  isOpen,
  toggleIsOpen,
  topPosition,
  leftPosition,
}: FollowModalProps) {
  const profile = useProfile((state) => state.profile);
  const [isAlreadyFollowing, setIsAlreadyFollowing] = useState(false);
  const [followBtn, setFollowBtn] = useState<JSX.Element | null>(null);
  const followTooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      confirmFollowed(profile);
    } else {
      setIsAlreadyFollowing(false);
    }
  }, [profile]);

  useEffect(() => {
    if (isAlreadyFollowing) {
      setFollowBtn(<span>Following</span>);
    } else {
      setFollowBtn(
        <button className="primary-btn" onClick={onClickFollow}>
          Follow
        </button>
      );
    }
  }, [isAlreadyFollowing]);

  const confirmFollowed = (profile: Profile) => {
    kwilApi
      .getFollwedProfiles(profile.id)
      .then((follows) => {
        console.log("follows");
        if (follows) {
          if (follows.find((follow) => follow.id === followed.id)) {
            setIsAlreadyFollowing(true);
          }
        } else {
          setIsAlreadyFollowing(false);
        }
      })
      .catch((e) => console.log(e));
  };

  const onMouseLeave = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    toggleIsOpen();
  };

  const onExitClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    toggleIsOpen();
  };

  const onRootClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onClickFollow = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const tx = await kwilApi.addFollow(profile?.id || 0, followed.id);
    console.log("tx", tx);
    await kwilApi.testWaitAndGetId(tx, "follows");
    confirmFollowed(profile!);
  };

  if (isOpen) {
    return (
      <div
        ref={followTooltipRef}
        onMouseLeave={onMouseLeave}
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
        <div className="follow-tooltip-item" style={{ marginBottom: "1em" }}>
          <RandomImg
            style={{ width: "4em", height: "4em", marginRight: "1.5em" }}
          />
          <div className="follow-tooltip-names">
            <span>{followed.fullname}</span>
            <span>{`@${followed.username}`}</span>
          </div>
        </div>
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
