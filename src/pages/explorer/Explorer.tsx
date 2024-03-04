import { ChangeEvent, useEffect, useState } from "react";
import { Layout } from "../../common/components/Layout";
import { kwilApi } from "../../common/api/KwilApiInstance";
import { TopicElement } from "../../common/components/TopicElement";
import searchIcon from "../../theme/assets/app-icons/search1.png";
import { getWorkWithAuthor } from "../../common/components/models/UIModels";
import { PAGE_SIZE } from "../../common/utils/StandardValues";
import { useParams } from "react-router-dom";
import { upperCaseFirstLetterOfWords } from "../../common/utils/CharacterUtils";
import { PagedWorkElements } from "../../common/components/PagedWorkElements";
import { Topic } from "../../common/api/ApiModels";
import { TabHeader } from "../../common/components/TabHeader";

export function Explorer() {
  const [searchTxt, setSearchTxt] = useState("");
  const [topicElements, setTopicElements] = useState<JSX.Element[]>([]);
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [topicName, setTopicName] = useState("");
  const { topic_id } = useParams<{ topic_id: string | undefined }>();
  const [refreshWorksData, setRefreshWorksData] = useState(false);

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTxt(e.target.value);
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
  };

  return (
    <Layout>
      <div className="home-single">
        <div className="explorer-item" style={{ marginBottom: "2em" }}>
          <input
            type="search"
            placeholder="Search ..."
            id="search"
            name=""
            className="profile-form-item"
            style={{ paddingLeft: "1em", paddingRight: "1em" }}
            value={searchTxt}
            onChange={onChangeSearch}
          />
          <img
            src={searchIcon}
            style={{ width: "1.5em", zIndex: "10", marginLeft: "-2em" }}
          />
        </div>
        <div className="topic-item-list">{topicElements}</div>

        <div className="explorer-container">
          <TabHeader headerName={topicName} />

          <PagedWorkElements
            getNextData={getData}
            refreshWorksData={refreshWorksData}
            setRefreshWorksData={setRefreshWorksData}
            readOnly={true}
            showContent={false}
            showAuthor={true}
            columnCount={2}
            style={{ height: "70vh" }}
          />
        </div>
      </div>
    </Layout>
  );
}
