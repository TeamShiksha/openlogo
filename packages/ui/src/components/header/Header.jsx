import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/Contexts";
import { Link, useNavigate } from "react-router-dom";
import MobileHeaderMenu from "./MobileHeaderMenu";
import Button from "../common/button/Button";
import {
  HEADER_ITEMS,
  HAMBURGER,
  CROSS,
  buttonText,
  branding,
} from "../../utils/Constants";
import styles from "./Header.module.css";
import { handleSectionClick } from "../../utils/Helpers.js";

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { setSignupModal } = useContext(AuthContext);
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
          {HEADER_ITEMS.map((item) =>
            item.url.startsWith("#") ? (
              <Link
                key={item.name}
                className={styles.nav}
                to="/"
                onClick={(e) => handleSectionClick(e, item.url, navigate)}
              >
                {item.title}
              </Link>
            ) : (
              <Link key={item.name} className={styles.nav} to={item.url}>
                {item.title}
              </Link>
            )
          )}
          <Button
            variant="primary"
            className={styles.ml}
            onClick={() => setSignupModal(true)}
          >
            {buttonText.getStarted}
          </Button>
        </div>
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
