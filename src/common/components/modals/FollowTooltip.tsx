import { Profile } from "../../api/ApiModels";
import { MouseEvent } from "react";
import { RandomImg } from "../RandomImage";

interface FollowModalProps {
  profile: Profile;
  isOpen: boolean;
  toggleIsOpen: () => void;
  topPosition: number;
  leftPosition: number;
}

export function FollowTooltip({
  profile,
  isOpen,
  toggleIsOpen,
  topPosition,
  leftPosition,
}: FollowModalProps) {
  const onMouseLeaveFullname = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    toggleIsOpen();
  };

  if (isOpen) {
    return (
      <div
        onMouseLeave={onMouseLeaveFullname}
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
          onClick={() => toggleIsOpen()}
        >
          x
        </div>
        <div className="follow-tooltip-item" style={{ marginBottom: "1em" }}>
          <RandomImg
            style={{ width: "4em", height: "4em", marginRight: "1.5em" }}
          />
          <div className="follow-tooltip-names">
            <span>{profile.fullname}</span>
            <span>{`@${profile.username}`}</span>
          </div>
        </div>
        <div className="follow-tooltip-item" style={{ marginLeft: ".5em" }}>
          <button className="primary-btn">Follow</button>
        </div>
      </div>
    );
  } else {
    null;
  }
}
