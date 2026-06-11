import { useEffect, useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { HEADER_ITEMS, LOGGEDIN_MOBILE_ITEMS } from "../../utils/Constants";
import styles from "./MobileHeaderMenu.module.css";
import {
  handleNavigation,
  observeActiveSectionOnScroll,
  extractSectionIds,
} from "../../utils/Helpers";
import { AuthContext, UserContext } from "../../contexts/Contexts";

const MobileHeaderMenu = ({ closeMenu, isOpen }) => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useContext(AuthContext);
  const { setUserData } = useContext(UserContext);
  const NAVBAR_ITEMS = isAuthenticated ? LOGGEDIN_MOBILE_ITEMS : HEADER_ITEMS;

  const sectionIds = extractSectionIds(NAVBAR_ITEMS);

  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    setUserData(null);
    closeMenu(false);
    navigate("/");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) closeMenu(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cleanup = observeActiveSectionOnScroll(sectionIds, setActiveSection);
    return cleanup;
  }, [sectionIds]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      data-testid="mobile-menu"
      className={styles.overlay}
      onClick={() => closeMenu(false)}
    >
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          className={styles["close-btn"]}
          onClick={() => closeMenu(false)}
          aria-label="Close menu"
        >
          ✕
        </button>

        <nav className={styles.navbar}>
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
                onClick={(event) => {
                  handleNavigation(event, item.url, navigate, setActiveSection);
                  closeMenu(false);
                }}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {isAuthenticated && (
          <div className={styles.footer}>
            <button className={styles["logout-btn"]} onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

MobileHeaderMenu.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default MobileHeaderMenu;
