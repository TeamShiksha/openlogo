import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MobileHeaderMenu from "./MobileHeaderMenu";
import AuthModal from "../auth/Auth";
import Button from "../common/button/Button";
import {
  HEADER_ITEMS,
  HAMBURGER,
  CROSS,
  buttonText,
  branding,
} from "../../utils/Constants";
import styles from "./Header.module.css";
import { handleNavigation } from "../../utils/Helpers.js";

const Header = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const menuIcon = showMenu ? CROSS : HAMBURGER;

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  return (
    <div data-testid="header" className={`container ${styles.block}`}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.brand}
          onClick={() => navigate("/")}
        >
          <img
            className={styles["brand-img"]}
            alt={branding.imageSrc}
            src={branding.imageSrc}
          />
          <span className={styles["brand-name"]}>{branding.brandName}</span>
        </button>
        <div className={styles["nav-bar"]}>
          {HEADER_ITEMS.map((item) => (
            <Link
              key={item.name}
              className={styles.nav}
              to={item.url}
              onClick={(event) => handleNavigation(event, item.url, navigate)}
            >
              {item.title}
            </Link>
          ))}
          <Button
            variant="primary"
            className={styles.ml}
            onClick={() => {
              setSignupModal(true);
            }}
          >
            {buttonText.getStarted}
          </Button>
        </div>
        <AuthModal
          isOpen={signupModal}
          onClose={() => {
            setSignupModal(false);
          }}
        />
        <button className={styles.hamburger} onClick={toggleMenu}>
          <img
            className={styles["hamburger-img"]}
            src={menuIcon.src}
            alt={menuIcon.alt}
          />
        </button>
        <MobileHeaderMenu isOpen={showMenu} closeMenu={setShowMenu} />
      </header>
    </div>
  );
};

export default Header;
