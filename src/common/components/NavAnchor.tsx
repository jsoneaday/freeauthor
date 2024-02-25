import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SELECTED_COLOR = "var(--primary-cl)";
const NON_SELECTED_COLOR = "var(--tertiary-cl)";

interface NavAnchorProps {
  label: string;
  path: string;
}

export function NavAnchor({ label, path }: NavAnchorProps) {
  const [color, setColor] = useState(SELECTED_COLOR);
  const location = useLocation();

  useEffect(() => {
    console.log("pathname", location.pathname, path);
    if (location.pathname === path) {
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
