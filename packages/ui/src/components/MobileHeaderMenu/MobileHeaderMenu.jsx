import { headerItems } from "../../utils/constants";
import Button from "../common/button/Button";
import styles from "./MobileHeaderMenu.module.css";
const MobileHeaderMenu = () => {
  return (
    <div className={styles["mobile-header-menu-items"]}>
      <div className={styles["header-items"]}>
        {headerItems.map((item) => (
          <a key={item.name} className={styles["header-item"]} href={item.url}>
            {item.title}
          </a>
        ))}
        <div className={styles["get-started-button"]}>
          <Button variant="secondary">Get started</Button>
        </div>
      </div>
    </div>
  );
};

export default MobileHeaderMenu;
