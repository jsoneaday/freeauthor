import { MouseEvent, useEffect, useState } from "react";
import { kwilApi } from "../api/KwilApiInstance";
import allFollow from "../../theme/assets/profiles/l-all.png";
import { useProfile } from "../redux/profile/ProfileHooks";
/// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { RandomImg } from "./RandomImage";

const SELECTED_CLASS = "followed-list-selected";

interface FollowedListProps {
  getCurrentSelectedFollowedId: (id: number) => void;
}

export function FollowedList({
  getCurrentSelectedFollowedId,
}: FollowedListProps) {
  const [followedProfiles, setFollowedProfiles] = useState<JSX.Element[]>([]);
  const [profile, _setProfile] = useProfile();

  const onClickSelectProfile = (e: MouseEvent<HTMLDivElement>) => {
    const currentElementProfileId = e.currentTarget.dataset.profileId || 0;
    getCurrentSelectedFollowedId(Number(currentElementProfileId));

    let lastForwardSibling: Element | null = e.currentTarget.nextElementSibling;
    let lastPreviousSibling: Element | null =
      e.currentTarget.previousElementSibling;
    while (true) {
      const nextSiblingProfileId =
        lastForwardSibling?.getAttribute("data-profile-id");

      if (!lastForwardSibling) break;

      if (nextSiblingProfileId != currentElementProfileId) {
        lastForwardSibling.children[0].classList.remove(SELECTED_CLASS);
      } else {
        break;
      }

      lastForwardSibling = lastForwardSibling.nextElementSibling;
    }
    while (true) {
      const previousSiblingProfileId =
        lastPreviousSibling?.getAttribute("data-profile-id");

      if (!lastPreviousSibling) break;

      if (previousSiblingProfileId != currentElementProfileId) {
        lastPreviousSibling.children[0].classList.remove(SELECTED_CLASS);
      } else {
        break;
      }

      lastPreviousSibling = lastPreviousSibling.previousElementSibling;
    }

    e.currentTarget.children[0].classList.remove(SELECTED_CLASS);
    e.currentTarget.children[0].classList.add(SELECTED_CLASS);
  };

  useEffect(() => {
    if (profile) {
      kwilApi
        .getFollwedProfiles(profile.id)
        .then((profiles) => {
          if (!profiles || profiles.length === 0) {
            setFollowedProfiles([
              <span key={1}>
                You are not following anyone. Use the Explore tab to find
                writers to follow
              </span>,
            ]);
          } else {
            // todo: use images from chain when ready
            const followed = profiles?.map((profile) => (
              <div
                data-profile-id={profile.id}
                key={`followed-${profile.username}`}
                className="followed-list-item"
                onClick={onClickSelectProfile}
              >
                <div>
                  <RandomImg />
                </div>
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
                <div className={SELECTED_CLASS}>
                  <img src={allFollow} className="profile-avatar" />
                </div>
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
    } else {
      setFollowedProfiles([
        <span key={1}>
          You must create a profile and follow users in order to view their
          stories. You can view people to follow in the Explore section
        </span>,
      ]);
    }
  }, [profile]);

  return (
    <div className="followed-list followed-list-scrollable">
      {followedProfiles}
    </div>
  );
}
