import { useEffect, useState } from "react";
import { kwilApi } from "../api/KwilApi";
import longhair from "../../theme/assets/profiles/longhair.jpg";
import { useProfile } from "../redux/profile/ProfileHooks";
/// @ts-ignore
import { v4 as uuidv4 } from "uuid";

export function FollowedList() {
  const [followedProfiles, setFollowedProfiles] = useState<
    JSX.Element[] | undefined
  >([]);
  const [profile, _setProfile] = useProfile();

  useEffect(() => {
    if (profile) {
      kwilApi
        .getFollwedProfiles(profile.id)
        .then((profiles) => {
          // todo: update this matching image when ready
          setFollowedProfiles(
            profiles?.map((profile) => (
              <div>
                <img key={uuidv4()} src={longhair} className="profile-avatar" />
                <div className="followed-list-font-items">
                  <b>{profile.fullname}</b>
                  <div>
                    {profile.username.includes("@")
                      ? profile.username
                      : `@${profile.username}`}
                  </div>
                </div>
              </div>
            ))
          );
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
