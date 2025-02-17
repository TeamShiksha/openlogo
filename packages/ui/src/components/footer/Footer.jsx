import { FOOTER_ITEMS } from "../../utils/Constants";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className={`container ${styles.block}`}>
      <footer className={styles["footer-container"]}>
        <div className={styles["footer-logo"]}>
          <img alt="Logo Icon" src="openlogo.svg" width={30} height={30} />
          <h4>Openlogo</h4>
        </div>
        <div className={styles["footer-items"]}>
          {FOOTER_ITEMS.map((item) => (
            <Link
              key={item.name}
              className={styles["footer-item"]}
              to={item.url}
            >
              {item.title}
            </Link>
          ))}
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
