import {
  ChangeEvent,
  useEffect,
  useState,
  KeyboardEvent,
  FocusEvent,
  MouseEvent,
} from "react";
import { Layout } from "../../common/components/Layout";
import { kwilApi } from "../../common/api/KwilApiInstance";
import { TopicElement } from "../../common/components/TopicElement";
import searchIcon from "../../theme/assets/app-icons/search1.png";
import { getWorkWithAuthor } from "../../common/components/models/UIModels";
import { PAGE_SIZE } from "../../common/utils/StandardValues";
import { useParams } from "react-router-dom";
import { upperCaseFirstLetterOfWords } from "../../common/utils/CharacterUtils";
import { PagedWorkElements } from "../../common/components/display-elements/PagedWorkElements";
import { Topic } from "../../common/api/ApiModels";
import { TabHeader } from "../../common/components/TabHeader";
import { WorkElements } from "../../common/components/display-elements/WorkElements";

enum ValidationStates {
  SearchTxtTooShort = "Search string must be at least 3 characters",
  SearchTxtTooLong = "Search string must be less than 250 characters",
  FieldIsValid = "",
}

export function Explorer() {
  const [searchTxt, setSearchTxt] = useState("");
  const [topicElements, setTopicElements] = useState<JSX.Element[]>([]);
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [topicName, setTopicName] = useState("");
  const { topic_id } = useParams<{ topic_id: string | undefined }>();
  const [refreshWorksData, setRefreshWorksData] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setValidationMsg(ValidationStates.FieldIsValid);

    setSearchTxt(e.target.value);
  };

  const validateSearchTxt = (searchTxt: string) => {
    if (!searchTxt || searchTxt.length < 3) {
      return ValidationStates.SearchTxtTooShort;
    } else if (searchTxt.length > 250) {
      return ValidationStates.SearchTxtTooShort;
    }
    return ValidationStates.FieldIsValid;
  };

  const resetPagingState = () => {
    setRefreshWorksData(true);
  };

  useEffect(() => {
    kwilApi.getAllTopics().then((topics) => {
      setTopics(topics);
    });
  }, []);

  useEffect(() => {
    console.log("topic_id", topic_id);
    if (!topics) return;

    let topicId = 1;
    if (topic_id) {
      topicId = Number(topic_id);
    }

    setTopicName(
      upperCaseFirstLetterOfWords(
        topics.find((topic) => topic.id === topicId)?.name || ""
      )
    );

    const topicItems: JSX.Element[] = [];
    for (let i = 0; i < topics.length; i++) {
      topicItems.push(
        <TopicElement
          key={`explorer-topic-${topics[i].id}`}
          topic_id={topics[i].id}
          name={topics[i].name}
          isSelected={topics[i].id === topicId ? true : false}
          resetPagingState={resetPagingState}
        />
      );
    }

    setTopicElements(topicItems);
    setRefreshWorksData(true);
  }, [topic_id, topics]);

  const getData = async (priorKeyset: number) => {
    if (searchTxt && searchTxt.length > 0) {
      if (validateSearchTxt(searchTxt) !== ValidationStates.FieldIsValid) {
        setValidationMsg(validateSearchTxt(searchTxt));
        return null;
      }

      const works = await kwilApi.searchWorks(
        searchTxt,
        priorKeyset,
        PAGE_SIZE
      );
      if (!works || works.length === 0) {
        return null;
      }

      const worksWithAuthor = await getWorkWithAuthor(works);
      console.log("works", worksWithAuthor);
      return worksWithAuthor;
    } else {
      let topicId = 1;
      if (topic_id) {
        topicId = Number(topic_id);
      }

      const works = await kwilApi.getWorksByTopic(
        topicId,
        priorKeyset,
        PAGE_SIZE
      );
      if (!works || works.length === 0) {
        return null;
      }

      const worksWithAuthor = await getWorkWithAuthor(works);
      console.log("works", worksWithAuthor);
      return worksWithAuthor;
    }
  };

  const onKeyUpSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.key === "Enter") {
      setRefreshWorksData(true);
    }
  };

  const onClickSearchBtn = (e: MouseEvent<HTMLImageElement>) => {
    e.preventDefault();

    setRefreshWorksData(true);
  };

  const onBlurSearchInput = async (_e: FocusEvent<HTMLInputElement>) => {
    setValidationMsg(ValidationStates.FieldIsValid);
  };

  return (
    <Layout>
      <div className="home-single">
        <div className="explorer-item" style={{ marginBottom: ".5em" }}>
          <input
            type="search"
            placeholder="Search ..."
            id="search"
            name=""
            className="profile-form-item"
            style={{ paddingLeft: "1em", paddingRight: "1em" }}
            value={searchTxt}
            onChange={onChangeSearch}
            onKeyUp={onKeyUpSearch}
            onBlur={onBlurSearchInput}
          />
          <img
            src={searchIcon}
            style={{ width: "1.5em", zIndex: "10", marginLeft: "-4em" }}
            onClick={onClickSearchBtn}
          />
        </div>
        <span
          style={{
            marginBottom: "1.5em",
            alignSelf: "flex-start",
            color: "var(--warning-cl)",
          }}
        >
          {validationMsg}
        </span>

        <div className="topic-item-list">{topicElements}</div>

        <div className="explorer-container">
          <TabHeader headerName={topicName} />

          <PagedWorkElements
            getNextData={getData}
            refreshWorksData={refreshWorksData}
            setRefreshWorksData={setRefreshWorksData}
            payload={{
              readOnly: true,
              showContent: false,
              showAuthor: true,
              columnCount: 2,
            }}
            style={{ height: "70vh" }}
          >
            <WorkElements works={[]} />
          </PagedWorkElements>
        </div>
      </div>
    </Layout>
  );
}
