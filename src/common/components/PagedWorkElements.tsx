import { CSSProperties, useEffect, useRef } from "react";
import { WorkElements } from "./WorkElements";
import { Spinner } from "./Spinner";
import { WorkWithAuthor } from "./models/UIModels";

interface PagedWorkElementsProps {
  getData: (refreshWorksList: boolean) => void;
  refreshWorksList: boolean;
  works: WorkWithAuthor[] | null;
  showContent: boolean;
  showAuthor: boolean;
  readOnly: boolean;
  columnCount: number;
  style?: CSSProperties;
  /// setRefreshWorksList means to reset or start paging from beginning, this function should also reset the priorKeyset
  setRefreshWorksList?: (refresh: boolean) => void;
}

export function PagedWorkElements({
  getData,
  refreshWorksList,
  setRefreshWorksList,
  works,
  showContent,
  showAuthor,
  readOnly,
  columnCount,
  style,
}: PagedWorkElementsProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const readWorkListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    readWorkListRef.current?.addEventListener("scroll", scrollEventHandler);

    return () => {
      readWorkListRef.current?.removeEventListener(
        "scroll",
        scrollEventHandler
      );
    };
  }, [targetRef.current, readWorkListRef.current, works, refreshWorksList]);

  const scrollEventHandler = () => {
    const targetBounds = targetRef.current?.getBoundingClientRect();
    const readWorkListBounds = readWorkListRef.current?.getBoundingClientRect();

    const inView =
      Math.floor(targetBounds?.bottom || 0) ===
      Math.floor(readWorkListBounds?.bottom || 0);

    if (inView) {
      setRefreshWorksList && setRefreshWorksList(false);
      getData(false);

      console.log("scrolling");
    }
  };

  return (
    <div ref={readWorkListRef} className="read-work-list" style={{ ...style }}>
      <WorkElements
        works={works}
        refresh={refreshWorksList}
        readOnly={readOnly}
        showContent={showContent}
        showAuthor={showAuthor}
        columnCount={columnCount}
      />
      <div
        ref={targetRef}
        style={{
          bottom: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {works && works.length > 0 ? <Spinner size={15} /> : null}
      </div>
    </div>
  );
}
