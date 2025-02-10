import styles from "./Documentation.module.css";
import { Link } from "react-router-dom";
import Table from "../../components/common/table/Table.jsx";
import { codeExamples, tableData } from "../../utils/Constants.js";
import CodeBlock from "./CodeBlock.jsx";

const Documentation = () => {
  return (
    <div className="container">
      <div className={styles.card}>
        <p>
          The documentation provides a comprehensive guide to our logo retrieval
          API, detailing endpoints for fetching company logos by domain name and
          searching logo URLs by domain prefixes. We offer features like bulk
          logo retrieval, high-resolution logos, and easy integration. Whether
          you need a logo for branding or marketing, we’re here to help. Contact
          us anytime!
          <p>
            <strong>Base URL:</strong>
            <span>https://api-logoexecutive.vercel.app/api/business</span>
          </p>
        </p>

        <h3>Logo Retrieval</h3>
        <p>
          Our logo retrieval service is a simple yet powerful API that fetches
          the logo of a specific company using its domain name. The logo
          returned is in PNG format.
        </p>
        <p>
          <strong>Endpoint: </strong>
          <span>
            {"BASE_URL"}/logo?domain={"domain"}&API_KEY={"api_key"}
          </span>
        </p>
        <div className={styles.tableWrapper}>
          <Table
            headers={tableData.headers}
            rows={tableData.logoRows}
            emptyMessage="No data available"
          />
        </div>
        <CodeBlock id="logo-example" codeExamples={codeExamples} />

        <h3>Search (Now Available)</h3>
        <p>
          The logo search API allows users to fetch a list of logo URLs that
          start with the specified characters. This is particularly useful for
          identifying logos based on a domain name&#39;s prefix.
        </p>
        <p>
          <strong>Endpoint: </strong>
          <span>
            {"BASE_URL"}/search?domain={"domain"}&API_KEY={"api_key"}
          </span>
        </p>
        <p>
          <strong>Access: </strong>Free for now, Flexible paid options arriving
          soon.
        </p>
        <div className={styles.tableWrapper}>
          <Table
            headers={tableData.headers}
            rows={tableData.searchRows}
            emptyMessage="No data available"
          />
        </div>
        <CodeBlock id="search-example" codeExamples={codeExamples} />
        <p>
          If you cannot find the desired logo, feel free to{" "}
          <Link to="/contact">contact us</Link>, and we&#39;ll be happy to help.
          For additional support, please refer to the provided examples or reach
          out to our support team for assistance.
        </p>
      </div>
    </div>
  );
};

export default Documentation;
