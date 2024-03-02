import { FollowedList } from "../../common/components/FollowedList";
import { Layout } from "../../common/components/Layout";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

export function Read() {
  const [currentFollowedId, setCurrentFollowedId] = useState(0); // 0 means all
  const [priorKeyset, setPriorKeyset] = useState(0);
  const [refreshWorksList, setRefreshWorksList] = useState(true);
  const [showFollowedList, setShowFollowedList] = useState(true);

  const getCurrentSelectedFollowedId = (id: number) => {
    setRefreshWorksList(true);
    setCurrentFollowedId(id);
    setPriorKeyset(0);
  };

  return (
    <Layout>
      <div className="home-single">
        {showFollowedList ? (
          <div style={{ marginBottom: "2em", width: "100%" }}>
            <FollowedList
              getCurrentSelectedFollowedId={getCurrentSelectedFollowedId}
            />
          </div>
        ) : null}

        <Outlet
          context={{
            currentFollowedId,
            priorKeysetState: [priorKeyset, setPriorKeyset],
            refreshWorksListState: [
              refreshWorksList,
              (refresh: boolean) => {
                setRefreshWorksList(refresh);
                if (refresh) setPriorKeyset(0);
              },
            ],
            setShowFollowedList,
          }}
        />
      </div>
    </Layout>
  );
}

export type ReadOutletType = {
  currentFollowedId: number;
  priorKeysetState: [
    priorKeyset: number,
    setPriorKeyset: Dispatch<SetStateAction<number>>
  ];
  refreshWorksListState: [
    refreshWorksList: boolean,
    setRefreshWorksList: (refresh: boolean) => void
  ];
  setShowFollowedList: Dispatch<SetStateAction<boolean>>;
};
