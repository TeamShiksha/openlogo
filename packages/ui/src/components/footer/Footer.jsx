import { BRANDING, FOOTER_ITEMS } from "../../utils/Constants";
import styles from "./Footer.module.css";
import { Link, useNavigate } from "react-router-dom";
import { handleNavigation } from "../../utils/Helpers";

function Footer() {
  const navigate = useNavigate();

  return (
    <div data-testid="footer" className={`container ${styles.block}`}>
      <footer className={styles["footer-container"]}>
        <div>
          <Link
            to="/"
            className={styles["footer-logo"]}
            data-testid="footer-logo-link"
          >
            <img
              alt={BRANDING.imageSrc}
              src={BRANDING.imageSrc}
              width={30}
              height={30}
            />
            <h4>{BRANDING.brandName}</h4>
          </Link>
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
          © 2025 |&nbsp;
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
