import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Topic {
  topic_id: number;
  name: string;
  isSelected: boolean;
  setRefreshWorksList: (refresh: boolean) => void;
}

export function TopicElement({
  topic_id,
  name,
  isSelected,
  setRefreshWorksList,
}: Topic) {
  const [localIsSelected, setLocalIsSelected] = useState(true);

  useEffect(() => {
    setLocalIsSelected(isSelected);
  }, [isSelected]);

  const onClickLinkTopic = () => {
    setLocalIsSelected(true);
    setRefreshWorksList(true);
  };

  return (
    <Link to={`/explorer/${topic_id}`} onClick={onClickLinkTopic}>
      {localIsSelected ? (
        <div className="topic-item-selected">
          <div className="topic-item">{name}</div>
        </div>
      ) : (
        <div className="topic-item" style={{ margin: ".75em" }}>
          {name}
        </div>
      )}
    </Link>
  );
}
