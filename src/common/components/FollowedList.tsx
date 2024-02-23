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
            profiles?.map((_profile) => <img key={uuidv4()} src={longhair} />)
          );
        })
        .catch((e) => console.log(e));
    }
  }, [profile]);

  return (
    <div>
      <ul>{followedProfiles}</ul>
    </div>
  );
}
