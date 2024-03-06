import { CSSProperties } from "react";
import { RandomImg } from "./RandomImage";

interface ProfileConcentractedDescProps {
  fullName: string;
  userName: string;
  style?: CSSProperties;
}

/// A concentrated description of most relevant profile info
export function ProfileConcentractedDesc({
  fullName,
  userName,
  style,
}: ProfileConcentractedDescProps) {
  return (
    <div className="profile-concentrated-item" style={{ ...style }}>
      <RandomImg
        style={{ width: "4em", height: "4em", marginRight: "1.5em" }}
      />
      <div className="profile-concentrated-names">
        <span>{fullName}</span>
        <span>{`@${userName}`}</span>
      </div>
    </div>
  );
}
