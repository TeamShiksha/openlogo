import { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/common/table/Table.jsx";
import { DOCUMENTATION, TABLE_DATA } from "../../utils/Constants";
import styles from "./Documentation.module.css";
import CodeBlock from "./CodeBlock.jsx";
import ContactForm from "../../components/contact/ContactForm.jsx";

const Documentation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const currentDomain = window.location.origin;

  function getBASE_API_URL(domain) {
    if (domain.includes("localhost")) {
      return DOCUMENTATION.localUrl;
    } else if (domain.includes("stage")) {
      return DOCUMENTATION.baseStageUrl;
    } else {
      return DOCUMENTATION.baseProdUrl;
    }
  }
  const baseAPI = getBASE_API_URL(currentDomain);

  return (
    <section
      className="container"
      style={{ marginTop: "1rem", marginBottom: "3rem" }}
    >
      <div className={styles.card}>
        <h3 className={styles["card-heading"]}>
          {DOCUMENTATION.introduction.heading}
        </h3>
        <p className={styles.text}>{DOCUMENTATION.introduction.text}</p>
        <p className={styles["base-info"]}>
          Base URL: <span>{`${baseAPI}/api`}</span>
        </p>
      </div>
      <div className={styles.card}>
        <h3 className={styles["card-heading"]}>
          {DOCUMENTATION.logoRetrieval.heading}
        </h3>
        <p className={styles.text}>{DOCUMENTATION.logoRetrieval.text}</p>
        <p className={styles["base-info"]}>
          Endpoint: <span>/logo?key=google&API_KEY={"YOUR_API_KEY"}</span>
        </p>
      </div>
      <div className={styles["table-wrapper"]}>
        <Table
          headers={TABLE_DATA.headers}
          rows={TABLE_DATA.logoRows}
          emptyMessage="No data available"
        />
      </div>
      <CodeBlock
        id="logo-example"
        codeExamples={DOCUMENTATION.logoRetrieval.codeExample}
      />
      <div className={styles.card}>
        <h3 className={styles["card-heading"]}>
          {DOCUMENTATION.search.heading}
        </h3>
        <p className={styles.text}>{DOCUMENTATION.search.texts[0]}</p>
        <p className={styles["base-info"]}>
          Endpoint: <span>/logo/search?key=go&API_KEY={"YOUR_API_KEY"}</span>
        </p>
      </div>
      <div className={styles["table-wrapper"]}>
        <Table
          headers={TABLE_DATA.headers}
          rows={TABLE_DATA.searchRows}
          emptyMessage="No data available"
        />
      </div>
      <CodeBlock
        id="search-example"
        codeExamples={DOCUMENTATION.search.codeExample}
      />
      <div className={styles.card} style={{ marginTop: "2rem" }}>
        <p className={styles.text}>
          {DOCUMENTATION.search.texts[1]}
          <Link className={styles.link} onClick={openModal}>
            contact us
          </Link>
          {DOCUMENTATION.search.texts[2]}
        </p>
      </div>
      {isModalOpen && <ContactForm closeModal={closeModal} />}
    </section>
  );
};

export default Documentation;
