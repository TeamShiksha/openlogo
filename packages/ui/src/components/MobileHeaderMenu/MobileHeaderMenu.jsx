import { useState } from "react";
import { headerItems } from "../../utils/constants";
import Button from "../common/button/Button";
import styles from "./MobileHeaderMenu.module.css";
import Signup from "../../Pages/signup/Signup";

const MobileHeaderMenu = () => {
  const [signupModal, setSignupModal] = useState(false);

  const closeSignupModal = () => {
    setSignupModal(false);
  };

  return (
    <div className={styles["mobile-header-menu-items"]}>
      <div className={styles["header-items"]}>
        {headerItems.map((item) => (
          <a key={item.name} className={styles["header-item"]} href={item.url}>
            {item.title}
          </a>
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
