import React from "react";
import { headerItems } from "../../utils/constants";
import Button from "../common/button/Button";
import styles from "./MobileHeaderMenu.module.css";
import { Link } from "react-router-dom";

const MobileHeaderMenu = () => {
  return (
    <div className={styles["mobile-header-menu-items"]}>
      <div className={styles["header-items"]}>
        {headerItems.map((item) => (
          <Link key={item.name} className={styles["header-item"]} to={item.url}>
            {item.title}
          </Link>
        ))}
        <div className={styles["get-started-button"]}>
          <Button variant="secondary">Get started</Button>
        </div>
      </div>
    </div>
  );
};

export default MobileHeaderMenu;
