import { useEffect, useState } from "react";
import { MarkdownEditor } from "../../common/components/MarkdownEditor";
import {
  WorkWithAuthor,
  getWorkWithAuthor,
} from "../../common/components/models/UIModels";
import { useParams } from "react-router-dom";
import { kwilApi } from "../../common/api/KwilApiInstance";
import { AuthorWorkDetail } from "../../common/components/AuthorWorkDetail";
import { Layout } from "../../common/components/Layout";

export function ReadStory() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>("");
  const [work, setWork] = useState<WorkWithAuthor | null>();
  const { work_id } = useParams<{ work_id: string }>();

  useEffect(() => {
    kwilApi
      .getWork(Number(work_id))
      .then((work) => {
        if (!work) {
          setWork(null);
          return;
        }

        getWorkWithAuthor([work])
          .then((work) => {
            setTitle(work[0].title);
            setDescription(work[0].description);
            setWork(work[0]);
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  }, [work_id]);

  return (
    <Layout>
      <div className="home-single" style={{ marginBottom: "2em" }}>
        <div>
          <h1 className="story-title" style={{ marginBottom: "1.25em" }}>
            {title}
          </h1>
          <h2 className="story-desc" style={{ marginBottom: "2em" }}>
            {description}
          </h2>
          <div className="story-detail">
            <AuthorWorkDetail showAuthor={true} work={work ? work : null} />
          </div>
          {work ? (
            <MarkdownEditor readOnly={true} markdown={work.content} />
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
