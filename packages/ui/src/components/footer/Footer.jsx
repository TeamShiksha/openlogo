import { BRANDING, FOOTER_SECTIONS } from "../../utils/Constants";
import styles from "./Footer.module.css";
import { Link, useNavigate } from "react-router-dom";
import { handleNavigation } from "../../utils/Helpers";
import { Twitter, Github } from "lucide-react";

function Footer() {
  const navigate = useNavigate();

  return (
    <div data-testid="footer" className={styles.block}>
      <footer className={`container ${styles["footer-container"]}`}>
        <div className={styles["footer-top"]}>
          <div className={styles["footer-brand-section"]}>
            <button
              className={styles["footer-logo"]}
              data-testid="footer-logo-button"
              onClick={() => navigate("/")}
            >
              <img
                alt={BRANDING.imageSrc}
                src={BRANDING.imageSrc}
                width={30}
                height={30}
              />
              <h4>{BRANDING.brandName}</h4>
            </button>
            <p className={styles["footer-description"]}>
              The premium, open-source library for exceptionally crisp,
              developer-ready SVG brand logos. Free forever.
            </p>
          </div>
          <div className={styles["footer-links-wrapper"]}>
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className={styles["footer-section"]}>
                <h4 className={styles["footer-section-title"]}>
                  {section.title}
                </h4>
                <div className={styles["footer-items"]}>
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      className={styles["footer-item"]}
                      to={item.url}
                      onClick={(event) =>
                        handleNavigation(event, item.url, navigate)
                      }
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles["footer-bottom"]}>
          <div className={styles["footer-copyright"]}>
            © {new Date().getFullYear()} {BRANDING.brandName}. All rights
            reserved. Powered by{" "}
            <a
              href={BRANDING.poweredByLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["footer-powered"]}
            >
              {BRANDING.poweredByText}
            </a>
            .
          </div>
          <div className={styles["footer-social"]}>
            <a href="#" aria-label="Twitter">
              <Twitter size={18} color="var(--description)" />
            </a>
            <a href="#" aria-label="GitHub">
              <Github size={18} color="var(--description)" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
