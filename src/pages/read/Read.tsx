import { FollowedList } from "../../common/components/FollowedList";
import { Layout } from "../../common/components/Layout";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export function Read() {
  const [currentFollowedId, setCurrentFollowedId] = useState(0); // 0 means all
  const [priorKeyset, setPriorKeyset] = useState(0);
  const [refreshWorksList, setRefreshWorksList] = useState(true);

  const getCurrentSelectedFollowedId = (id: number) => {
    setRefreshWorksList(true);
    setCurrentFollowedId(id);
    setPriorKeyset(0);
  };

  return (
    <Layout>
      <div className="home-single">
        <div style={{ marginBottom: "2em", width: "100%" }}>
          <FollowedList
            getCurrentSelectedFollowedId={getCurrentSelectedFollowedId}
          />
        </div>
        <Outlet
          context={{
            currentFollowedId,
            priorKeysetState: [priorKeyset, setPriorKeyset],
            refreshWorksListState: [refreshWorksList, setRefreshWorksList],
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
    setPriorKeyset: React.Dispatch<React.SetStateAction<number>>
  ];
  refreshWorksListState: [
    refreshWorksList: boolean,
    setRefreshWorksList: React.Dispatch<React.SetStateAction<boolean>>
  ];
};
