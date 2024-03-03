import { ChangeEvent, useEffect, useState } from "react";
import { Layout } from "../../common/components/Layout";
import { kwilApi } from "../../common/api/KwilApiInstance";
import { TopicElement } from "../../common/components/TopicElement";
import searchIcon from "../../theme/assets/app-icons/search1.png";
import {
  WorkWithAuthor,
  getWorkWithAuthor,
} from "../../common/components/models/UIModels";
import { PAGE_SIZE } from "../../common/utils/StandardValues";
import { useParams } from "react-router-dom";
import { upperCaseFirstLetterOfWords } from "../../common/utils/CharacterUtils";
import { PagedWorkElements } from "../../common/components/PagedWorkElements";
import { Topic } from "../../common/api/ApiModels";

export function Explorer() {
  const [searchTxt, setSearchTxt] = useState("");
  const [topicElements, setTopicElements] = useState<JSX.Element[]>([]);
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [priorKeyset, setPriorKeyset] = useState(0);
  const [topicWorks, setTopicWorks] = useState<WorkWithAuthor[] | null>(null);
  const [topicName, setTopicName] = useState("");
  const { topic_id } = useParams<{ topic_id: string | undefined }>();
  const [refreshWorksList, setRefreshWorksList] = useState(false);

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setSearchTxt(e.target.value);
  };

  const resetRefreshWorksList = (refresh: boolean) => {
    setRefreshWorksList(refresh);
    if (refresh) setPriorKeyset(0);
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
          setRefreshWorksList={resetRefreshWorksList}
        />
      );
    }

    setTopicElements(topicItems);
    getData(refreshWorksList);
  }, [topic_id, topics]);

  const getData = (_refreshWorksList: boolean) => {
    let topicId = 1;
    if (topic_id) {
      topicId = Number(topic_id);
    }

    console.log("priorKeyset", priorKeyset);
    kwilApi
      .getWorksByTopic(topicId, priorKeyset, PAGE_SIZE)
      .then((works) => {
        if (!works) {
          setTopicWorks(null);
          return;
        }

        getWorkWithAuthor(works)
          .then((works) => {
            console.log("updated topics works");

            setTopicWorks(works);
            setPriorKeyset(works.length === 0 ? 0 : works[works.length - 1].id);
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
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
          <span className="explorer-header">{topicName}</span>

          <PagedWorkElements
            getData={getData}
            works={topicWorks}
            refreshWorksList={refreshWorksList}
            setRefreshWorksList={resetRefreshWorksList}
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
