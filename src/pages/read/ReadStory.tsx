import { useEffect, useState } from "react";
import { MarkdownEditor } from "../../common/components/MarkdownEditor";
import {
  WorkWithAuthor,
  getResponseWithResponder,
  getWorkWithAuthor,
} from "../../common/components/models/UIModels";
import { useParams } from "react-router-dom";
import { kwilApi } from "../../common/api/KwilApiInstance";
import { AuthorWorkDetail } from "../../common/components/AuthorWorkDetail";
import { Layout } from "../../common/components/Layout";
import { ResponseElements } from "../../common/components/ResponseElements";
import { PagedWorkElements } from "../../common/components/PagedWorkElements";
import { PAGE_SIZE } from "../../common/utils/StandardValues";

export function ReadStory() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>("");
  const [work, setWork] = useState<WorkWithAuthor | null>();
  const { work_id } = useParams<{ work_id: string }>();
  const [refreshWorksData, setRefreshWorksData] = useState(false);

  useEffect(() => {
    if (work) setRefreshWorksData(true);
  }, [work]);

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

  const getData = async (priorKeyset: number) => {
    const responses = await kwilApi.getWorkResponses(
      Number(work_id),
      priorKeyset,
      PAGE_SIZE
    );
    if (!responses || responses.length === 0) {
      return null;
    }

    const responsesWithResponder = await getResponseWithResponder(responses);
    console.log("responsesWithResponder and total", responsesWithResponder);
    return responsesWithResponder || null;
  };

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
            {work ? (
              <AuthorWorkDetail
                showAuthor={true}
                workId={work.id}
                authorId={work.authorId}
                workUpdatedAt={work.updatedAt}
                userName={work.userName}
                fullName={work.fullName}
              />
            ) : null}
          </div>
          {work ? (
            <MarkdownEditor readOnly={true} markdown={work.content} />
          ) : null}
          <PagedWorkElements
            getNextData={getData}
            refreshWorksData={refreshWorksData}
            setRefreshWorksData={setRefreshWorksData}
            payload={{}}
          >
            <ResponseElements works={[]} />
          </PagedWorkElements>
        </div>
      </div>
    </Layout>
  );
}
