import { CSSProperties, useEffect, useState, MouseEvent } from "react";
import { RandomImg } from "./RandomImage";
import { useProfile } from "../zustand/Store";
import { kwilApi } from "../api/KwilApiInstance";
import { PrimaryButton } from "./Buttons";

interface ProfileConcentractedDescProps {
  profileId: number;
  fullName: string;
  userName: string;
  profileDesc: string;
  followingCount?: number;
  followerCount?: number;
  style?: CSSProperties;
}

/// A concentrated description of most relevant profile info
export function ProfileConcentractedDesc({
  profileId,
  fullName,
  userName,
  profileDesc,
  followingCount,
  followerCount,
  style,
}: ProfileConcentractedDescProps) {
  const profile = useProfile((state) => state.profile);
  const [isAlreadyFollowing, setIsAlreadyFollowing] = useState(false);
  const [followBtn, setFollowBtn] = useState<JSX.Element | null>(null);
  const [followingBtn, setFollowingBtn] = useState<JSX.Element | null>(null);
  const [followerBtn, setFollowerBtn] = useState<JSX.Element | null>(null);

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
        <PrimaryButton
          label="Follow"
          isDisabled={profile ? false : true}
          onClick={async (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();

            if (profile) {
              const tx = await kwilApi.addFollow(profile.id || 0, profileId);
              await kwilApi.testWaitAndGetId(tx, "follows");
              await confirmFollowed();
            } else {
              console.log("Cannot follow not logged in!");
            }
          }}
        />
      );
    }
  }, [isAlreadyFollowing, profile]);

  useEffect(() => {
    if (!followingCount || followingCount === 0) {
      setFollowingBtn(<span>Following</span>);
    } else {
      setFollowingBtn(
        <PrimaryButton
          label="Following"
          isDisabled={profile ? false : true}
          onClick={async (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();

            // todo: go to list of following
          }}
        />
      );
    }
  }, [followingCount]);

  useEffect(() => {
    if (!followerCount || followerCount === 0) {
      setFollowerBtn(<span>Follower</span>);
    } else {
      setFollowerBtn(
        <PrimaryButton
          label="Following"
          isDisabled={profile ? false : true}
          onClick={async (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();

            // todo: go to list of followers
          }}
        />
      );
    }
  }, [followerCount]);

  const confirmFollowed = async () => {
    if (profile) {
      // todo: consider replacing with direct check call
      const follows = await kwilApi.getFollowedProfiles(profile.id || 0);

      if (follows) {
        if (follows.find((follow) => follow.id === profileId)) {
          setIsAlreadyFollowing(true);
        } else {
          setIsAlreadyFollowing(false);
        }
      } else {
        setIsAlreadyFollowing(false);
      }
    }
  };
  return (
    <div className="profile-concentrated-container" style={{ ...style }}>
      <div
        className="profile-concentrated-item"
        style={{ marginBottom: "1em" }}
      >
        <RandomImg
          style={{ width: "4em", height: "4em", marginRight: "1em" }}
        />
        <div className="profile-concentrated-names">
          <span>{fullName}</span>
          <span>{`@${userName}`}</span>
        </div>
        <div className="follow-tooltip-item" style={{ marginLeft: "1.25em" }}>
          {followBtn}
        </div>
      </div>
      <div
        className="profile-concentrated-desc"
        style={{ marginBottom: "1em" }}
      >
        <span>{profileDesc}</span>
      </div>
      <div className="profile-concentrated-follow">
        {followingCount ? (
          <span>
            {followingBtn} {followingCount}
          </span>
        ) : null}
        {followerCount ? (
          <span>
            {followerBtn} {followerCount}
          </span>
        ) : null}
      </div>
    </div>
  );
}