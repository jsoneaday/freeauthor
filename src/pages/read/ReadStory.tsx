import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
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
import { TabHeader } from "../../common/components/TabHeader";
import { ReturnEnabledInput } from "../../common/components/ReturnEnabledInput";
import { useProfile } from "../../common/zustand/Store";

enum ValidationStates {
  ResponseValueIsEmpty = "Response must have a value",
  ResponseValueTooShort = "Response must have at least 5 characters",
  ResponseValueTooLong = "Response value cannot be greater than 400 characters",
  ProfileMustBeConnected = "Profile must be connected before submitting a response",
  FieldIsValid = "",
}

export function ReadStory() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>("");
  const [work, setWork] = useState<WorkWithAuthor | null>();
  const { work_id } = useParams<{ work_id: string }>();
  const [refreshWorksData, setRefreshWorksData] = useState(false);
  const [responseValue, setResponseValue] = useState("");
  const [validationMsg, setValidationMsg] = useState(
    ValidationStates.FieldIsValid
  );
  const profile = useProfile((state) => state.profile);

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

  const onChangeResponse = (e: ChangeEvent<HTMLInputElement>) => {
    setResponseValue(e.target.value);
  };

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

  const validateResponse = (value: string) => {
    if (!value || value.length === 0) {
      return ValidationStates.ResponseValueIsEmpty;
    } else if (value.length < 5) {
      return ValidationStates.ResponseValueTooShort;
    } else if (value.length > 400) {
      return ValidationStates.ResponseValueTooLong;
    }
    return ValidationStates.FieldIsValid;
  };

  const submitResponse = async (value: string) => {
    const validationResult = validateResponse(value);
    if (validationResult !== ValidationStates.FieldIsValid) {
      setValidationMsg(validationResult);
      return;
    }

    if (!profile) {
      setValidationMsg(ValidationStates.ProfileMustBeConnected);
      return;
    }

    await kwilApi.addWorkResponse(value, Number(work_id), profile.id || 0);
    setRefreshWorksData(true);
  };

  const onBlurResponseInput = async (e: FocusEvent<HTMLInputElement>) => {
    setValidationMsg(ValidationStates.FieldIsValid);
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "2em",
            }}
          >
            <TabHeader headerName="Responses" style={{ marginBottom: "1em" }} />
            <ReturnEnabledInput
              value={responseValue}
              onChange={onChangeResponse}
              placeholder="Enter your response ..."
              submit={submitResponse}
              onBlur={onBlurResponseInput}
            />
            <span style={{ marginTop: ".5em", color: "var(--warning-cl)" }}>
              {validationMsg}
            </span>
            <PagedWorkElements
              getNextData={getData}
              refreshWorksData={refreshWorksData}
              setRefreshWorksData={setRefreshWorksData}
              payload={{}}
            >
              <ResponseElements works={[]} showWorkTitle={false} />
            </PagedWorkElements>
          </div>
        </div>
      </div>
    </Layout>
  );
}
