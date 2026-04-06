import { useState } from "react";
import Table from "../../components/common/table/Table.jsx";
import { DOCUMENTATION } from "../../utils/Constants";
import styles from "./Documentation.module.css";
import CodeBlock from "./CodeBlock.jsx";
import ContactForm from "../../components/contact/ContactForm.jsx";
import { getBaseApiUrl } from "../../utils/Helpers.js";

const Documentation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentDomain =
    typeof window !== "undefined" ? window.location.origin : "";
  const baseAPI = getBaseApiUrl(currentDomain);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [selectedLanguages, setSelectedLanguages] = useState({});

  const getSelectedLanguage = (featureHeading) =>
    selectedLanguages[featureHeading] || "javascript";

  const handleLanguageChange = (featureHeading, language) => {
    setSelectedLanguages((prev) => ({
      ...prev,
      [featureHeading]: language,
    }));
  };

  const endpointCount = DOCUMENTATION.apiDocs.length;
  const languageCount = Object.keys(
    DOCUMENTATION.apiDocs[0].codeExample
  ).length;
  const quickActions = [
    {
      label: "Start Building",
      href: "/dashboard",
      variant: "primary",
    },
    {
      label: "Release Notes",
      href: "/release",
      variant: "secondary",
    },
  ];
  const sampleEndpoint = DOCUMENTATION.apiDocs[0];
  const sampleResponse = `{
  "logo_url": "https://cdn.openlogo.fyi/logos/google.png",
  "domain": "google.com"
}`;
  const quickStartSteps = [
    "Pick an endpoint below and review required params.",
    "Copy the code sample in your preferred language.",
    "Send a request with your API key from dashboard.",
  ];

  return (
    <section className={`container ${styles.documentationShell}`}>
      <header className={styles.heroCard}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroMain}>
          <p className={styles.kicker}>OpenLogo API</p>
          <h1 className={styles.heroHeading}>
            {DOCUMENTATION.introduction.heading}
          </h1>
          <p className={styles.text}>{DOCUMENTATION.introduction.text}</p>
          <p className={styles.baseInfo}>{baseAPI}</p>

          <div className={styles.heroActions}>
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={`${styles.heroButton} ${
                  action.variant === "primary"
                    ? styles.heroButtonPrimary
                    : styles.heroButtonSecondary
                }`}
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>

        <aside className={styles.quickStart} aria-label="Quickstart">
          <h2 className={styles.quickStartHeading}>Quickstart</h2>
          <ol className={styles.quickStartList}>
            {quickStartSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className={styles.metricsRow}>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>{endpointCount}</span>
              <span className={styles.metricLabel}>Endpoints</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>{languageCount}</span>
              <span className={styles.metricLabel}>Languages</span>
            </div>
          </div>
        </aside>

        <div className={styles.previewPanel}>
          <div className={styles.previewHeader}>
            <p className={styles.previewTitle}>Sample Request</p>
            <p className={styles.previewSubtitle}>GET /logo with API key</p>
          </div>
          <pre className={styles.previewCode}>
            <code>{sampleEndpoint.codeExample.javascript}</code>
          </pre>

          <div className={styles.previewResponseWrap}>
            <p className={styles.previewTitle}>Response</p>
            <pre className={styles.previewResponseCode}>
              <code>{sampleResponse}</code>
            </pre>
          </div>
        </div>
      </header>

      {DOCUMENTATION.apiDocs.map((feature) => {
        return (
          <article key={feature.heading} className={styles.endpointSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleWrap}>
                <h2 className={styles.cardHeading}>{feature.heading}</h2>
                <span className={styles.endpointBadge}>REST</span>
              </div>
              <p className={styles.text}>{feature.text}</p>
              <p className={styles.baseInfo}>{feature.endPoint}</p>
            </div>

            <div className={styles.contentGrid}>
              <div className={styles.tableWrapper}>
                <Table
                  headers={DOCUMENTATION.tableDataHeaders}
                  rows={feature.tableDataContent}
                  emptyMessage="No data available"
                  isGuest={false}
                />
              </div>

              <CodeBlock
                id={feature.heading}
                codeExamples={feature.codeExample}
                selectedLanguage={getSelectedLanguage(feature.heading)}
                setSelectedLanguage={(language) =>
                  handleLanguageChange(feature.heading, language)
                }
              />
            </div>
          </article>
        );
      })}

      <div className={styles.supportCard}>
        <p className={styles.text}>
          {DOCUMENTATION.customerSupportText[0]}
          <button
            type="button"
            className={styles.linkButton}
            onClick={openModal}
          >
            contact us
          </button>
          {DOCUMENTATION.customerSupportText[1]}
        </p>
      </div>
      {isModalOpen && <ContactForm closeModal={closeModal} />}
    </section>
  );
};

export default Documentation;
