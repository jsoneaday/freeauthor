import { useEffect, useRef } from "react";
import { WorkElements } from "./WorkElements";
import { Spinner } from "./Spinner";
import { WorkWithAuthor } from "./models/UIModels";

interface PagedWorkElementsProps {
  getData: (refreshWorksList: boolean) => void;
  refreshWorksList: boolean;
  works: WorkWithAuthor[] | null;
}

export function PagedWorkElements({
  getData,
  refreshWorksList,
  works,
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
      (targetBounds?.bottom || 0) === (readWorkListBounds?.bottom || 0) - 1;

    if (inView) {
      getData(false);
      console.log("scrolling");
    }
  };

  return (
    <div ref={readWorkListRef} className="read-work-list">
      <WorkElements
        works={works}
        refresh={refreshWorksList}
        readOnly={true}
        showContent={false}
        columnCount={2}
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
