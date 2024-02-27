import { MouseEvent, useEffect, useState } from "react";
import { kwilApi } from "../api/KwilApiInstance";
import allFollow from "../../theme/assets/profiles/l-all.png";
import { useProfile } from "../redux/profile/ProfileHooks";
/// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { RandomImg } from "./RandomImage";

interface FollowedListProps {
  getCurrentSelectedFollowedId: (id: number) => void;
}

export function FollowedList({
  getCurrentSelectedFollowedId,
}: FollowedListProps) {
  const [followedProfiles, setFollowedProfiles] = useState<
    JSX.Element[] | string
  >([]);
  const [profile, _setProfile] = useProfile();

  const onClickSelectProfile = (e: MouseEvent<HTMLDivElement>) => {
    getCurrentSelectedFollowedId(
      Number(e.currentTarget.dataset.profileId || 0)
    );
  };

  useEffect(() => {
    if (profile) {
      kwilApi
        .getFollwedProfiles(profile.id)
        .then((profiles) => {
          if (!profiles || profiles.length === 0) {
            setFollowedProfiles(
              "You are not following anyone. Use the Explore tab to find writers to follow"
            );
          } else {
            // todo: use images from chain when ready
            const followed = profiles?.map((profile) => (
              <div
                data-profile-id={profile.id}
                key={`followed-${profile.username}`}
                className="followed-list-item"
                onClick={onClickSelectProfile}
              >
                <RandomImg />
                <div className="followed-list-font-items">
                  <b>{`${profile.id} ${profile.fullname}`}</b>
                  <div>
                    {profile.username.includes("@")
                      ? profile.username
                      : `@${profile.username}`}
                  </div>
                </div>
              </div>
            ));
            followed.splice(
              0,
              0,
              <div
                data-profile-id={0}
                key={`followed-${profile.username}`}
                className="followed-list-item"
                style={{ marginLeft: "1em", marginRight: "1em" }}
                onClick={onClickSelectProfile}
              >
                <img src={allFollow} className="profile-avatar" />
                <div
                  className="followed-list-font-items"
                  style={{ alignItems: "center" }}
                >
                  <b>ALL</b>
                </div>
              </div>
            );
            setFollowedProfiles(followed);
          }
        })
        .catch((e) => console.log(e));
    }
  }, [profile]);

  return (
    <div className="followed-list followed-list-scrollable">
      {followedProfiles}
    </div>
  );
}
