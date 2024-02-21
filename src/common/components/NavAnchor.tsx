import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavAnchorProps {
  label: string;
  path: string;
}

const SELECTED_COLOR = "var(--primary-cl)";
const NON_SELECTED_COLOR = "var(--tertiary-cl)";
export function NavAnchor({ label, path }: NavAnchorProps) {
  const [color, setColor] = useState(SELECTED_COLOR);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes(path)) {
      setColor(SELECTED_COLOR);
    } else {
      setColor(NON_SELECTED_COLOR);
    }
  }, [location]);

  return (
    <Link to={path} style={{ color }}>
      {label}
    </Link>
  );
}
