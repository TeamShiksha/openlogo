import { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/common/table/Table.jsx";
import { DOCUMENTATION } from "../../utils/Constants";
import styles from "./Documentation.module.css";
import CodeBlock from "./CodeBlock.jsx";
import ContactForm from "../../components/contact/ContactForm.jsx";
import { getBaseApiUrl } from "../../utils/Helpers.js";

const Documentation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentDomain = window.location.origin;
  const baseAPI = getBaseApiUrl(currentDomain);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
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
        <p className={styles["base-info"]}>{baseAPI}</p>
      </div>
      {DOCUMENTATION["apiDocs"].map((feature) => {
        return (
          <div key={feature.heading}>
            <div className={styles.card}>
              <h3 className={styles["card-heading"]}>{feature.heading}</h3>
              <p className={styles.text}>{feature.text}</p>
              <p className={styles["base-info"]}>{feature.endPoint}</p>
            </div>
            <div className={styles["table-wrapper"]}>
              <Table
                headers={DOCUMENTATION.tableDataHeaders}
                rows={feature.tableDataContent}
                emptyMessage="No data available"
              />
            </div>
            <CodeBlock
              id="logo-example"
              codeExamples={feature.codeExample}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
            />
          </div>
        );
      })}
      <div className={styles.card} style={{ marginTop: "2rem" }}>
        <p className={styles.text}>
          {DOCUMENTATION.customerSupportText[0]}
          <Link className={styles.link} onClick={openModal}>
            contact us
          </Link>
          {DOCUMENTATION.customerSupportText[1]}
        </p>
      </div>
      {isModalOpen && <ContactForm closeModal={closeModal} />}
    </section>
  );
};

export default Documentation;
