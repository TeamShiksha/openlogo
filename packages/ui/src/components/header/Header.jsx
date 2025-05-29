import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import MobileHeaderMenu from "./MobileHeaderMenu";
import Button from "../common/button/Button";
import {
  HEADER_ITEMS,
  HAMBURGER,
  CROSS,
  BUTTON_TEXT,
  BRANDING,
  LOGGEDIN_ITEMS,
} from "../../utils/Constants";
import styles from "./Header.module.css";
import { handleNavigation } from "../../utils/Helpers";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/Contexts";

const Header = ({ openAuthModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const currentPath = location.pathname;
  const [showMenu, setShowMenu] = useState(false);
  const menuIcon = showMenu ? CROSS : HAMBURGER;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { isAuthenticated } = useContext(AuthContext);
  const NAVBAR_ITEMS = isAuthenticated ? LOGGEDIN_ITEMS : HEADER_ITEMS;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
            alt={BRANDING.imageSrc}
            src={BRANDING.imageSrc}
          />
          <span className={styles["brand-name"]}>{BRANDING.brandName}</span>
        </button>
        <div className={styles["nav-bar"]}>
          {NAVBAR_ITEMS.map((item) => {
            const [itemPath, itemSection] = item.url.split("#");
            const isActive =
              item.type === "route"
                ? currentPath === item.url
                : currentPath === itemPath && activeSection === itemSection;

            return (
              <Link
                key={item.name}
                className={`${styles.nav} ${isActive ? styles.active : ""}`}
                to={item.url}
                onClick={(event) =>
                  handleNavigation(event, item.url, navigate, setActiveSection)
                }
              >
                {item.title}
              </Link>
            );
          })}

          {!isAuthenticated && (
            <Button
              variant="primary"
              className={styles.ml}
              onClick={openAuthModal}
            >
              {BUTTON_TEXT.getStarted}
            </Button>
          )}
        </div>
        {isMobile && (
          <button className={styles.hamburger} onClick={toggleMenu}>
            <img
              className={styles["hamburger-img"]}
              src={menuIcon.src}
              alt={menuIcon.alt}
            />
          </button>
        )}
        <MobileHeaderMenu isOpen={showMenu} closeMenu={setShowMenu} />
      </header>
    </div>
  );
};

Header.propTypes = {
  openAuthModal: PropTypes.func.isRequired,
};

export default Header;
