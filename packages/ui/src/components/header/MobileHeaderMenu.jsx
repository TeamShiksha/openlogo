import { useEffect, useContext, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { HEADER_ITEMS, LOGGEDIN_ITEMS } from "../../utils/Constants";
import styles from "./MobileHeaderMenu.module.css";
import {
  handleNavigation,
  observeActiveSectionOnScroll,
  extractSectionIds,
} from "../../utils/Helpers";
import { AuthContext } from "../../contexts/Contexts";

const MobileHeaderMenu = ({ closeMenu, isOpen }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const NAVBAR_ITEMS = isAuthenticated ? LOGGEDIN_ITEMS : HEADER_ITEMS;
  const sectionIds = useMemo(() => extractSectionIds(NAVBAR_ITEMS));

  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const currentPath = location.pathname;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        closeMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cleanup = observeActiveSectionOnScroll(sectionIds, setActiveSection);
    return cleanup;
  }, [sectionIds]);

  if (!isOpen) return null;

  return (
    <div data-testid="mobile-menu" className={styles["mobile-header"]}>
      <div className={styles.navbar}>
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
      </div>
    </div>
  );
};

MobileHeaderMenu.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default MobileHeaderMenu;
