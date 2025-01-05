import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeaderMenu from "./MobileHeaderMenu";
import Signup from "../signup/Signup";
import Button from "../common/button/Button";
import { HEADER_ITEMS } from "../../utils/constants";
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [signupModal, setSignupModal] = useState(false);

  useEffect(() => {
    if (signupModal) {
      document.body.classList.add(styles.activemodal);
    } else {
      document.body.classList.remove(styles.activemodal);
    }

    return () => {
      document.body.classList.remove(styles.activemodal);
    };
  }, [signupModal]);

  const hamburgerIcon = {
    src: "hamburger.svg",
    alt: "Hamburger Icon",
  };

  const closeIcon = {
    src: "close-icon.svg",
    alt: "Close Icon",
  };

  const menuIcon = showMenu ? closeIcon : hamburgerIcon;

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const openSignupModal = () => {
    setSignupModal(true);
  };

  const closeSignupModal = () => {
    setSignupModal(false);
  };

  return (
    <header className={styles["header-container"]}>
      <div className={styles["header-logo"]} onClick={() => navigate("/")}>
        <img alt="Logo Icon" src="openlogo.svg" width={36} height={36} />
        <h4>Openlogo</h4>
      </div>
      <div className={styles["header-items"]}>
        {HEADER_ITEMS.map((item) => (
          <a key={item.name} className={styles["header-item"]} href={item.url}>
            {item.title}
          </a>
        ))}
      </div>
      <div className={styles["header-button"]}>
        <Button variant="primary" onClick={openSignupModal}>
          Get started for free
        </Button>
        <Signup isOpen={signupModal} onClose={closeSignupModal} />
      </div>

      <button className={styles["header-hamburger"]} onClick={toggleMenu}>
        <img src={menuIcon.src} alt={menuIcon.alt} height={16} width={21.33} />
      </button>
      {showMenu && <MobileHeaderMenu onSignupClick={openSignupModal} />}
    </header>
  );
};

export default Header;
