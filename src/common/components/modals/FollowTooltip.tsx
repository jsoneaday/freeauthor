import { Profile } from "../../api/ApiModels";
import { MouseEvent } from "react";

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
        <span className="follow-tooltip-item">
          {`${profile.fullname} ${profile.username}`}
        </span>
      </div>
    );
  } else {
    null;
  }
}
