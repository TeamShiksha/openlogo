import { useState } from "react";
import { HEADER_ITEMS } from "../../utils/constants";
import Button from "../common/button/Button";
import Signup from "../signup/Signup";
import { Link } from "react-router-dom";
import styles from "./MobileHeaderMenu.module.css";

const MobileHeaderMenu = () => {
  const [signupModal, setSignupModal] = useState(false);

  const closeSignupModal = () => {
    setSignupModal(false);
  };

  return (
    <div className={styles["mobile-header-menu-items"]}>
      <div className={styles["header-items"]}>
        {HEADER_ITEMS.map((item) => (
          <Link key={item.name} className={styles["header-item"]} to={item.url}>
            {item.title}
          </Link>
        ))}
        <div className={styles["get-started-button"]}>
          <Button variant="secondary" onClick={() => setSignupModal(true)}>
            Get started
          </Button>
          <Signup isOpen={signupModal} onClose={closeSignupModal} />
        </div>
      </div>
    </div>
  );
};

export default MobileHeaderMenu;
