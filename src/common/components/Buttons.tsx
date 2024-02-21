import { MouseEvent, CSSProperties } from "react";

export interface PrimaryButtonProps {
  label: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  style: CSSProperties;
  isDisabled?: boolean;
}

export function PrimaryButton({
  label,
  onClick,
  style,
  isDisabled = false,
}: PrimaryButtonProps) {
  return (
    <button
      disabled={isDisabled}
      className="primary-btn"
      style={{ ...style, cursor: isDisabled ? "not-allowed" : "pointer" }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
