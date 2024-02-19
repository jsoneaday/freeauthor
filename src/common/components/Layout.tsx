import { ReactNode, MouseEvent } from "react";
//import { addProfile, waitAndGetId } from "../api/KwilApi";

export interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  //   const createProfile = async (e: MouseEvent<HTMLButtonElement>) => {
  //     e.preventDefault();

  //     const tx = await addProfile(
  //       "dave",
  //       "Dave Choi",
  //       "I am a programmer",
  //       "",
  //       ""
  //     );

  //     const id = await waitAndGetId(tx);
  //   };

  return (
    <div className="layout-container">
      <nav className="layout-nav">
        <a href="/" className="layout-title">
          FREE-AUTHOR
        </a>
        <span className="layout-links">
          <a href="/write">WRITE</a>
          <a href="/read">READ</a>
          <a href="/explore">EXPLORE</a>
        </span>
        <button>CONNECT</button>
      </nav>
      {children}
    </div>
  );
}
