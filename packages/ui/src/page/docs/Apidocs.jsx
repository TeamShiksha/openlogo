import { useState } from "react";
import styles from "./ApiDocs.module.css";
import pythonLogo from "../../assets/python.png";
import { Link } from "react-router-dom";
import jsLogo from "../../assets/js.png";
import javaLogo from "../../assets/java.png";
import copycodeicon from "../../assets/copy-code-icon.png";
import tick from "../../assets/tick.png";
import Table from "../../components/common/table/Table.jsx";

const codeExamples = {
  javascript: `// Initialize API request to fetch company logo
fetch('/api/business/logo?domain={domain}&API_KEY={api_key}',
{
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',  // Set content type for JSON response
  },
}
)`,

  python: `# Import requests library for making HTTP requests
import requests
# Send GET request to fetch company logo
response = requests.get('api/business/logo',
  params={
      'domain': 'domain',    # Company domain name
      'API_KEY': 'api_key'   # Your API authentication key
  },
  headers={
      'Content-Type': 'application/json'  # Set content type for JSON response
  }
)`,

  java: `// Create HTTP client instance
HttpClient client = HttpClient.newHttpClient();
// Build HTTP request with required parameters
HttpRequest request = HttpRequest.newBuilder()
  .uri(URI.create("/api/business/logo?domain=domain&API_KEY=api_key"))
  .header("Content-Type", "application/json")  // Set content type for JSON response
  .GET()
  .build();  
// Send request and get response as String
HttpResponse<String> response = client.send(request, 
HttpResponse.BodyHandlers.ofString());`,
};
const CodeBlock = ({ id, codeExamples }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [copyMessage, setCopyMessage] = useState("");

  const copyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopyMessage("Copied!");
        setTimeout(() => setCopyMessage(""), 2000);
      })
      .catch(() => {
        setCopyMessage("Copy failed!");
        setTimeout(() => setCopyMessage(""), 2000);
      });
  };
  const logos = {
    javascript: jsLogo,
    python: pythonLogo,
    java: javaLogo,
  };

  return (
    <div className={styles.codeBlockWrapper}>
      <div className={styles.codeBlockHeader}>
        <div className={styles.languageSelector}>
          {Object.keys(codeExamples).map((lang) => (
            <button
              key={`${id}-${lang}`}
              onClick={() => {
                setSelectedLanguage(lang);
              }}
              className={`${styles.languageButton} ${
                selectedLanguage === lang ? styles.languageButtonActive : ""
              }`}
            >
              <img
                src={logos[lang]}
                alt={`${lang} logo`}
                style={{ width: "32px", height: "32px" }}
              />
            </button>
          ))}
        </div>
      </div>
      <pre className={styles.codeBlock}>
        <div className={styles.copyinside}>
          <code>{codeExamples[selectedLanguage]}</code>
          {copyMessage ? (
            <img
              src={tick}
              alt="tick"
              style={{ width: "24px", height: "24px" }}
            />
          ) : (
            <img
              src={copycodeicon}
              alt="Copy code"
              style={{ width: "24px", height: "24px", cursor: "pointer" }}
            />
          )}
        </div>
      </pre>
    </div>
  );
};

const ApiDocs = () => {
  const tableData = {
    headers: ["Parameter", "Type", "Description", "Required"],
    logoRows: [
      ["domain", "string", "The domain name of the company.", "Yes"],
      ["API_KEY", "string", "The API Key generated from the dashboard.", "Yes"],
    ],
    searchRows: [
      [
        "domainKey",
        "string",
        "The starting prefix of the domain name to filter logo URLs.",
        "Yes",
      ],
      ["API_KEY", "string", "The API Key generated from the dashboard.", "Yes"],
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={`${styles.card} ${styles.cardWrapper}`}>
          <div className={styles.introduction}>
            <p className={styles.paragraph}>
              The Documentation provides a comprehensive guide to our Logo
              Retrieval API, detailing endpoints for fetching company logos by
              domain name and searching logo URLs by domain prefixes. We offer
              features like bulk logo retrieval, high-resolution logos, and easy
              integration. Whether you need a logo for branding or marketing,
              we’re here to help.Contact us anytime!
            </p>
          </div>

          <h3 className={`${styles.heading2} ${styles.underline}`}>
            Logo Retrieval
          </h3>
          <p className={styles.paragraph}>
            Our Logo Retrieval service is a simple yet powerful API that fetches
            the logo of a specific company using its domain name. The logo
            returned is in PNG format.
          </p>

          <p className={styles.paragraph}>
            <strong className={styles.heading4}>Endpoint: </strong>
            <span className={styles.bgGrey}>
              https://api-logoexecutive.vercel.app/api/business/logo?domain=
              {"domain"}&API_KEY={"api_key"}
            </span>
          </p>

          <div className={styles.tableWrapper}>
            <Table
              headers={tableData.headers}
              rows={tableData.logoRows}
              emptyMessage="No data available"
            />
          </div>

          {/* <h3 className={styles.heading3}>Example Call:</h3> */}
          <CodeBlock id="logo-example" codeExamples={codeExamples} />

          <h3 className={`${styles.heading2} ${styles.underline}`}>
            Search (Now Available)
          </h3>

          <p className={styles.paragraph}>
            The Logo Search API allows users to fetch a list of logo URLs that
            start with the specified characters. This is particularly useful for
            identifying logos based on a domain name's prefix.
          </p>

          <p className={styles.paragraph}>
            <strong className={styles.heading4}>Endpoint: </strong>
            <span className={styles.bgGrey}>
              https://api-logoexecutive.vercel.app/api/business/search?domain=
              {"domain"}&API_KEY={"api_key"}
            </span>
          </p>
          <p className={styles.paragraph}>
            <strong className={styles.heading4}>Access: </strong>Free for now,
            Flexible paid options arriving soon.
          </p>

          <div className={styles.tableWrapper}>
            <Table
              headers={tableData.headers}
              rows={tableData.searchRows}
              emptyMessage="No data available"
            />
          </div>

          {/* <h3 className={styles.heading3}>Example Call:</h3> */}
          <CodeBlock id="search-example" codeExamples={codeExamples} />
          <p>
            If you cannot find the desired logo, feel free to{" "}
            {/* <a href="/contact-us">contact us</a> */}
            <Link to="/contact">contact us</Link>, and we'll be happy to help.
            For additional support, please refer to the provided examples or
            reach out to our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
