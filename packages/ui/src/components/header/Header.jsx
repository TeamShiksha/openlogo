import { headerItems } from "../../utils/constants";
import Button from "../common/button/Button";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles["header-container"]}>
      <div className={styles["header-logo"]}>
        <img alt="Logo Icon" src="openlogo.svg" width={30} height={30} />
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
      <div className={styles["header-hamburger"]}>
        <img
          alt="Hamburger Icon"
          src="hamburger.svg"
          height={16}
          width={21.33}
        />
      </div>
    </header>
  );
};

export default Header;
