import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { HEADER_ITEMS, LOGGEDIN_ITEMS } from "../../utils/Constants";
import styles from "./MobileHeaderMenu.module.css";
import { handleNavigation } from "../../utils/Helpers";
import { AuthContext } from "../../contexts/Contexts";

const MobileHeaderMenu = ({ closeMenu, isOpen }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

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

  const NAVBAR_ITEMS = isAuthenticated ? LOGGEDIN_ITEMS : HEADER_ITEMS;
  const items = NAVBAR_ITEMS.map((item) => ({
    ...item,
    url: item.url.replace(/^\//, ""),
  }));

  if (!isOpen) return null;

  return (
    <div data-testid="mobile-menu" className={styles["mobile-header"]}>
      <div className={styles.navbar}>
        {items.map((item) => (
          <Link
            key={item.name}
            className={styles.nav}
            to={item.url}
            onClick={(event) => {
              handleNavigation(event, item.url, navigate);
              closeMenu(false);
            }}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

MobileHeaderMenu.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default MobileHeaderMenu;
