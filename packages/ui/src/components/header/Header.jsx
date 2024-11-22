import { headerItems } from "../../utils/constants";
import Button from "../common/button/Button";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles["header-container"]}>
      <div className={styles["header-logo"]}>
        <img src="openlogo.svg" alt="Logo" width={30} height={30} />
        <h4>Openlogo</h4>
      </div>
      <div className={styles["header-items"]}>
        {headerItems.map((item) => (
          <a key={item.name} className={styles["header-item"]} href={item.url}>
            {item.title}
          </a>
        ))}
      </div>
      <div className={styles["header-button"]}>
        <Button variant="primary">Get started for free</Button>
      </div>
    </header>
  );
};

export default Header;
