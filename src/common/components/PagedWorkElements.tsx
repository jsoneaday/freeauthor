import { CSSProperties, memo, useEffect, useRef, useState } from "react";
import { WorkElements } from "./WorkElements";
import { Spinner } from "./Spinner";
import { WorkWithAuthor } from "./models/UIModels";
import { PAGE_SIZE } from "../utils/StandardValues";

export enum PagingState {
  Start = "Start",
  Continue = "Continue",
  Finish = "Finish",
}

interface PagedWorkElementsProps {
  getNextData: (priorKeyset: number) => Promise<WorkWithAuthor[] | null>;
  refreshWorksData: boolean;
  setRefreshWorksData: React.Dispatch<React.SetStateAction<boolean>>;
  showContent: boolean;
  showAuthor: boolean;
  readOnly: boolean;
  columnCount: number;
  style?: CSSProperties;
}

function PagedWorkElementsComponent({
  getNextData,
  refreshWorksData,
  setRefreshWorksData,
  showContent,
  showAuthor,
  readOnly,
  columnCount,
  style,
}: PagedWorkElementsProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const readWorkListRef = useRef<HTMLDivElement>(null);
  const [priorKeyset, setPriorKeyset] = useState(0);
  const [currentPagingState, setCurrentPagingState] = useState(
    PagingState.Start
  );
  const [pagedWorks, setPagedWorks] = useState<WorkWithAuthor[] | null>([]);

  useEffect(() => {
    if (refreshWorksData) {
      setPriorKeyset(0);
      setCurrentPagingState(PagingState.Start);
      setData(0, PagingState.Start);
    }
  }, [refreshWorksData]);

  useEffect(() => {
    readWorkListRef.current?.addEventListener("scroll", scrollEventHandler);

    return () => {
      readWorkListRef.current?.removeEventListener(
        "scroll",
        scrollEventHandler
      );
    };
  }, [
    readWorkListRef.current,
    targetRef.current,
    priorKeyset,
    currentPagingState,
  ]);

  const scrollEventHandler = async () => {
    console.log("Scroll, current PagingState", currentPagingState);
    if (currentPagingState === PagingState.Finish) return;

    const targetBounds = targetRef.current?.getBoundingClientRect();
    const readWorkListBounds = readWorkListRef.current?.getBoundingClientRect();

    const inView =
      Math.floor(targetBounds?.bottom || 0) ===
      Math.floor(readWorkListBounds?.bottom || 0) - 1;

    if (inView) {
      console.log("scrolling");
      setData(priorKeyset, currentPagingState);
    }
  };

  const setData = async (priorKeyset: number, pagingState: PagingState) => {
    const works = await getNextData(priorKeyset);
    // use current paging state to determine whether to append or start fresh
    if (pagingState === PagingState.Start) {
      const worksNotNull = works || [];
      setPagedWorks(worksNotNull);
    } else {
      const pagedWorksNotNull = pagedWorks || [];
      const worksNotNull = works || [];
      setPagedWorks([...pagedWorksNotNull, ...worksNotNull]);
    }

    // once data is set reset the paging state to correct new value
    if (!works || works.length === 0) {
      console.log("no more works data, state Finished");
      setCurrentPagingState(PagingState.Finish);
    } else if (works.length < PAGE_SIZE) {
      console.log("works length less than page size, state Finished");
      setCurrentPagingState(PagingState.Finish);
    } else {
      console.log("more works found, state Continue");
      setCurrentPagingState(PagingState.Continue);
    }

    if (works && works.length > 0) {
      setPriorKeyset(works[works.length - 1].id);
    }

    setRefreshWorksData(false);
  };

  return (
    <div ref={readWorkListRef} className="read-work-list" style={{ ...style }}>
      <WorkElements
        works={pagedWorks}
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
        {pagedWorks && pagedWorks.length > 0 ? <Spinner size={15} /> : null}
      </div>
    </div>
  );
}

export const PagedWorkElements = memo(PagedWorkElementsComponent);
