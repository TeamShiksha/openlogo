import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { HEADER_ITEMS } from "../../utils/Constants";
import styles from "./MobileHeaderMenu.module.css";
import { handleNavigation } from "../../utils/Helpers";

const MobileHeaderMenu = ({ closeMenu, isOpen }) => {
  const navigate = useNavigate();

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

  if (!isOpen) return null;

  return (
    <div data-testid="mobile-menu" className={styles["mobile-header"]}>
      <div className={styles.navbar}>
        {HEADER_ITEMS.map((item) => (
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
