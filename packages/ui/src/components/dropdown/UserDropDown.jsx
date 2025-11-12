import { useState, useContext, useEffect, useRef } from "react";
import styles from "./UserDropDown.module.css";
import { AuthContext, UserContext } from "../../contexts/Contexts";
import { BUTTON_TEXT } from "../../utils/Constants";
import { Link } from "react-router-dom";

export default function UserDropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { logout, isAuthenticated } = useContext(AuthContext);
  const { userData, setUserData, fetchUserData } = useContext(UserContext);
  const dropdownRef = useRef(null);

  const initial = userData?.email ? userData?.email[0].toUpperCase() : "U";
  const isActive = window.location.pathname === "/dashboard";

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setIsLoading(true);
    logout();
    setUserData(null);
    setIsLoading(false);
    setIsOpen(false);   // ✅ close dropdown
  };

  useEffect(() => {
    if (isAuthenticated && !userData) {
      fetchUserData();
    }
  }, [userData, isAuthenticated, fetchUserData]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <button className={styles["profile-button"]} onClick={toggleDropdown}>
        {initial}
      </button>

      {isOpen && (
        <div className={styles["dropdown-menu"]}>
          <div>
            <Link
              className={`${styles.items} ${isActive ? styles.active : ""}`}
              to="/dashboard"
              onClick={() => setIsOpen(false)}   // ✅ close when clicking menu item
            >
              Dashboard
            </Link>
          </div>

          <div className={styles["logout-wrapper"]}>
            <Link
              className={[styles.items]}
              onClick={handleLogout}
              isLoading={isLoading}
            >
              {BUTTON_TEXT.signOut}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
