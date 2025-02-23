import { Link } from "react-router-dom";
import Table from "../../components/common/table/Table.jsx";
import {
  codeExamples,
  codeExamplesSearch,
  tableData,
} from "../../utils/Constants.js";
import styles from "./Documentation.module.css";
import CodeBlock from "./CodeBlock.jsx";

const Documentation = () => {
  return (
    <section
      className="container"
      style={{ marginTop: "1rem", marginBottom: "3rem" }}
    >
      <div className={styles.card}>
        <h3 className={styles["card-heading"]}>Introduction</h3>
        <p className={styles.text}>
          The documentation provides a comprehensive guide to our logo retrieval
          API, detailing endpoints for fetching company logos by domain name and
          searching logos by domain prefixes. We offer features like exact
          search, bulk logo retrieval, high-resolution logos, request logo with
          easy integration. Whether you need a logo for branding or marketing,
          we’re here to help. Contact us anytime!
        </p>
        <p className={styles["base-info"]}>
          Base URL: <span>https://api-openlogo.fyi/api</span>
        </p>
      </div>
      <div className={styles.card}>
        <h3 className={styles["card-heading"]}>Logo Retrieval</h3>
        <p className={styles.text}>
          Integrate this API for precise logo searches using a company&apos;s
          domain name. This free API allows up to 500 calls per month and
          returns logos in PNG format. Support for additional formats will be
          available in the future.
        </p>
        <p className={styles["base-info"]}>
          Endpoint: <span>/logo?key=google&API_KEY={"YOUR_API_KEY"}</span>
        </p>
      </div>
      <div className={styles["table-wrapper"]}>
        <Table
          headers={tableData.headers}
          rows={tableData.logoRows}
          emptyMessage="No data available"
        />
      </div>
      <CodeBlock id="logo-example" codeExamples={codeExamples} />
      <div className={styles.card}>
        <h3 className={styles["card-heading"]}>Search (Now Available)</h3>
        <p className={styles.text}>
          The Logo Search API allows users to retrieve a list of logo URLs that
          begin with specified characters, making it useful for identifying
          logos based on a domain name&apos;s prefix. This service is currently
          free but will be subject to charges in the future. The API has a
          monthly usage limit of 5000 requests.
        </p>
        <p className={styles["base-info"]}>
          Endpoint: <span>/logo/search?key=go&API_KEY={"YOUR_API_KEY"}</span>
        </p>
      </div>
      <div className={styles["table-wrapper"]}>
        <Table
          headers={tableData.headers}
          rows={tableData.searchRows}
          emptyMessage="No data available"
        />
      </div>
      <CodeBlock id="search-example" codeExamples={codeExamplesSearch} />
      <div className={styles.card} style={{ marginTop: "2rem" }}>
        <p className={styles.text}>
          If you&apos;re unable to find the logo you need, please don&apos;t
          hesitate to{" "}
          <Link className={styles.link} to="#about">
            contact us
          </Link>
          . Our team will be happy to assist you in locating the appropriate
          logo. Additionally, you can refer to the provided examples for
          guidance. If you still require further support, our dedicated support
          team is available to help with any additional questions or concerns.
        </p>
      </div>
    </section>
  );
};

export default Documentation;
