import { MouseEvent, useEffect, useState } from "react";
import { kwilApi } from "../api/KwilApiInstance";
import longhair from "../../theme/assets/profiles/longhair.jpg";
import mrglasses from "../../theme/assets/profiles/mrglasses.jpg";
import mylady from "../../theme/assets/profiles/mylady.jpg";
import allFollow from "../../theme/assets/profiles/l-all.png";
import { useProfile } from "../redux/profile/ProfileHooks";
/// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

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
            console.log("Got followed profiles", profiles);
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
                key={`followed-${profile.username}`}
                className="followed-list-item"
                style={{ marginLeft: "1em", marginRight: "1em" }}
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
            console.log("followed elements", followed);
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

const profileImages = [
  {
    id: 1,
    src: longhair,
  },
  {
    id: 2,
    src: mrglasses,
  },
  {
    id: 3,
    src: mylady,
  },
];
/// todo: remove when ready
function RandomImg() {
  const [src, setSrc] = useState(longhair);

  useEffect(() => {
    const id = faker.number.int({ min: 1, max: 3 });
    setSrc(profileImages.find((img) => img.id === id)?.src || longhair);
  }, []);

  return <img src={src} className="profile-avatar" />;
}
