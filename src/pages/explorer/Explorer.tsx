import { ChangeEvent, useEffect, useState } from "react";
import { Layout } from "../../common/components/Layout";
import { kwilApi } from "../../common/api/KwilApiInstance";
import { Topic } from "../../common/components/Topic";
import searchIcon from "../../theme/assets/search1.png";
import {
  WorkWithAuthor,
  getWorkWithAuthor,
} from "../../common/components/models/UIModels";
import { PAGE_SIZE } from "../../common/utils/StandardValues";
import { useParams } from "react-router-dom";
import { upperCaseFirstLetterOfWords } from "../../common/utils/CharacterUtils";
import { PagedWorkElements } from "../../common/components/PagedWorkElements";

export function Explorer() {
  const [searchTxt, setSearchTxt] = useState("");
  const [topics, setTopics] = useState<JSX.Element[]>([]);
  const [priorKeyset, setPriorKeyset] = useState(0);
  const [topicWorks, setTopicWorks] = useState<WorkWithAuthor[] | null>(null);
  const [topicName, setTopicName] = useState("");
  const { topic_id } = useParams<{ topic_id: string | undefined }>();

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setSearchTxt(e.target.value);
  };

  useEffect(() => {
    let topicId = 1;
    if (topic_id) {
      topicId = Number(topic_id);
    }

    kwilApi.getAllTopics().then((topics) => {
      setTopicName(
        upperCaseFirstLetterOfWords(
          topics.find((topic) => topic.id === topicId)?.name || ""
        )
      );

      const topicItems: JSX.Element[] = [];
      for (let i = 0; i < topics.length; i++) {
        topicItems.push(
          <Topic
            key={`explorer-topic-${topics[i].id}`}
            topic_id={topics[i].id}
            name={topics[i].name}
          />
        );
      }

      setTopics(topicItems);
      getData(false);
    });
  }, [topic_id]);

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
            console.log("works", works);

            setTopicWorks(works);
            setPriorKeyset(works[works.length - 1].id);
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
        <div className="topic-item-list">{topics}</div>

        <div className="explorer-container">
          <span className="explorer-header">{topicName}</span>

          <PagedWorkElements
            getData={getData}
            works={topicWorks}
            refreshWorksList={false}
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
