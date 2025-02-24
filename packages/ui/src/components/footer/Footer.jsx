import { FOOTER_ITEMS } from "../../utils/Constants";
import styles from "./Footer.module.css";
import { Link, useNavigate } from "react-router-dom";
import { handleSectionClick } from "../../utils/Helpers.js";

function Footer() {
  const navigate = useNavigate();

  return (
    <div data-testid="footer" className={`container ${styles.block}`}>
      <footer className={styles["footer-container"]}>
        <div className={styles["footer-logo"]}>
          <img alt="Logo Icon" src="openlogo.svg" width={30} height={30} />
          <h4>Openlogo</h4>
        </div>
        <div className={styles["footer-items"]}>
          {FOOTER_ITEMS.map((item) =>
            item.url.startsWith("#") ? (
              <Link
                key={item.name}
                className={styles["footer-item"]}
                to="/"
                onClick={(e) => handleSectionClick(e, item.url, navigate)}
              >
                {item.title}
              </Link>
            ) : (
              <Link
                key={item.name}
                className={styles["footer-item"]}
                to={item.url}
              >
                {item.title}
              </Link>
            )
          )}
        </div>
        <div className={styles["footer-copyright"]}>
          © Openlogo 2025 |&nbsp;
          <a
            href="https://team.shiksha"
            target="_blank"
            rel="noopener noreferrer"
            className={styles["footer-powered"]}
          >
            Powered by TeamShiksha
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
