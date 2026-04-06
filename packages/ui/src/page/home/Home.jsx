import { useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/button/Button";
import { AuthContext, UserContext } from "../../contexts/Contexts";
import {
  ABOUT,
  BUTTON_TEXT,
  FEATURES,
  FAQ,
  PRICING,
} from "../../utils/Constants";
import styles from "./Home.module.css";

const Home = ({ openAuthModal }) => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const { isAuthenticated } = useContext(AuthContext);

  const onPrimaryButtonClick = () =>
    isAuthenticated ? navigate("/dashboard") : openAuthModal();

  const heroCode = `// use fetch to send GET request\nfetch("/api/logo?key={domain}&API_KEY={YOUR_API_KEY}", {\n  method: "GET",\n  headers: {\n    "Content-Type": "application/json",\n  },\n})`;

  const heroResponse = `RESPONSE\n{\n  "logo_url": "https://cdn.openlogo.fyi/logos/google.png",\n  "domain": "google.com"\n}`;

  const capabilityItems = [
    "Standardized logo formats",
    "Transparent backgrounds",
    "High-resolution assets",
  ];

  return (
    <main className={`container ${styles.page}`}>
      <section className={styles.heroSection}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>OpenLogo API</p>
          <h1>Perfect company logos for your next project.</h1>
          <p className={styles.heroSummary}>
            Access hundreds of high-quality company logos instantly through our
            simple API. Built for developers, trusted by designers. Stop
            searching Google Images.
          </p>
          <div className={styles.heroActions}>
            <Button
              type="button"
              variant="primary"
              onClick={onPrimaryButtonClick}
              className={styles.heroPrimaryButton}
            >
              {isAuthenticated
                ? BUTTON_TEXT.gotoDashboard
                : BUTTON_TEXT.getStarted}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/docs")}
              className={styles.heroSecondaryButton}
            >
              View {BUTTON_TEXT.documentation}
            </Button>
          </div>
        </div>

        <div className={styles.codeSurface}>
          <p className={styles.surfaceLabel}>Sample Request</p>
          <pre className={styles.requestBlock}>
            <code>{heroCode}</code>
          </pre>
          <p className={styles.surfaceLabel}>Response</p>
          <pre className={styles.responseBlock}>
            <code>{heroResponse}</code>
          </pre>
        </div>
      </section>

      <section className={styles.trySection}>
        <div className={styles.tryCopy}>
          <p className={styles.kicker}>Try it yourself</p>
          <h2>Instant logo retrieval.</h2>
          <p>
            Search for any company domain to find the best available brand
            assets. Get high-quality transparent logos ready for your products.
          </p>
          <div className={styles.searchMock}>
            <span className={styles.searchIcon} aria-hidden="true">
              ⌕
            </span>
            <span>google.com</span>
            <span className={styles.searchMeta}>PNG / SVG</span>
          </div>
        </div>

        <div className={styles.capabilityGrid}>
          {capabilityItems.map((item) => (
            <article key={item} className={styles.capabilityCard}>
              <span className={styles.capabilityDot} aria-hidden="true" />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="features"
        data-testid="features"
        className={styles.featuresSection}
      >
        <p className={styles.kicker}>Why OpenLogo</p>
        <h2>{FEATURES.heading}</h2>
        <p className={styles.sectionSummary}>{FEATURES.summary}</p>
        <div className={styles.featureCards}>
          {FEATURES.items.map((item) => (
            <article key={item.title} className={styles.featureCard}>
              <img src={item.icon} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.content}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="pricing"
        data-testid="pricing"
        className={styles.pricingSection}
      >
        <p className={styles.kicker}>Pricing</p>
        <h2>{PRICING.heading}</h2>
        <p className={styles.sectionSummary}>{PRICING.summary}</p>
        <div className={styles.planGrid}>
          {PRICING.plans.map((plan) => (
            <article key={plan.name} className={styles.planCard}>
              <h3>{plan.name}</h3>
              <p className={styles.planTagline}>{plan.tagline}</p>
              <p className={styles.planPrice}>₹{plan.pricing}/mo</p>
              <ul>
                {plan.keypoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Button
                type="button"
                variant={
                  userData?.subscription?.type === plan.name
                    ? "secondary"
                    : "primary"
                }
                onClick={onPrimaryButtonClick}
                className={styles.planButton}
              >
                {userData?.subscription?.type === plan.name
                  ? BUTTON_TEXT.active
                  : BUTTON_TEXT.getStarted}
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section id="about" data-testid="about" className={styles.trustSection}>
        <p className={styles.kicker}>Trusted by teams</p>
        <h2>{ABOUT.TITLE}</h2>
        <p className={styles.sectionSummary}>{ABOUT.DESCRIPTION}</p>
        <div className={styles.logoRail}>
          {ABOUT.INTEGRATIONS.slice(0, 12).map((brand) => (
            <div key={brand.id} className={styles.logoItem}>
              <img src={brand.src} alt={brand.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.faqSection}>
        <p className={styles.kicker}>FAQs</p>
        <h2>{FAQ.TITLE}</h2>
        <div className={styles.faqGrid}>
          {FAQ.QAS.slice(0, 4).map((qa) => (
            <article key={qa.question} className={styles.faqCard}>
              <h3>{qa.question}</h3>
              <p>{qa.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2>Need something specific?</h2>
        <p>
          If you cannot find a logo, open a request and our team will add it to
          the catalog.
        </p>
        <div className={styles.heroActions}>
          <Button
            type="button"
            variant="primary"
            onClick={onPrimaryButtonClick}
          >
            {isAuthenticated ? BUTTON_TEXT.requestLogo : BUTTON_TEXT.getStarted}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/docs")}
          >
            {BUTTON_TEXT.documentation}
          </Button>
        </div>
      </section>
    </main>
  );
};

Home.propTypes = {
  openAuthModal: PropTypes.func.isRequired,
};

export default Home;
