import { BRANDING, FOOTER_ITEMS } from "../../utils/Constants";
import styles from "./Footer.module.css";
import { Link, useNavigate } from "react-router-dom";
import { handleNavigation } from "../../utils/Helpers";
import { useTheme } from "../../hooks/useTheme";

function Footer() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div data-testid="footer" className={`container ${styles.block}`}>
      <footer className={styles["footer-container"]}>
        <div>
          <button
            className={styles["footer-logo"]}
            data-testid="footer-logo-button"
            onClick={() => navigate("/")}
          >
            <img
              alt={BRANDING.imageAlt}
              src={isDarkMode ? BRANDING.imageSrcDark : BRANDING.imageSrc}
              width={30}
              height={30}
            />
            <h4>{BRANDING.brandName}</h4>
          </button>
        </div>
        <div className={styles["footer-items"]}>
          {FOOTER_ITEMS.map((item) => (
            <Link
              key={item.name}
              className={styles["footer-item"]}
              to={item.url}
              onClick={(event) => handleNavigation(event, item.url, navigate)}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className={styles["footer-copyright"]}>
          © {new Date().getFullYear()} |&nbsp;
          <a
            href={BRANDING.poweredByLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles["footer-powered"]}
          >
            {BRANDING.poweredByText}
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
