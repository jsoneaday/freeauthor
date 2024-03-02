import { Link } from "react-router-dom";

interface Topic {
  topic_id: number;
  name: string;
}

export function Topic({ topic_id, name }: Topic) {
  return (
    <Link to={`/explorer/topic/${topic_id}`}>
      <div className="topic-item">{name}</div>
    </Link>
  );
}
