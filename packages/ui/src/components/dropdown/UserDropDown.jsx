import { useState, useContext, useEffect, useRef } from "react";
import styles from "./UserDropDown.module.css";
import { AuthContext, UserContext } from "../../contexts/Contexts";
import { BUTTON_TEXT } from "../../utils/Constants";
import { Link } from "react-router-dom";
import { LogOut, LayoutDashboard } from "lucide-react";

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
    setIsOpen(false);
  };

  useEffect(() => {
    if (isAuthenticated && !userData) {
      fetchUserData();
    }
  }, [userData, isAuthenticated, fetchUserData]);

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
    <div ref={dropdownRef} className={styles.wrapper}>
      <button className={styles["profile-button"]} onClick={toggleDropdown}>
        {initial}
      </button>

      {isOpen && (
        <div className={styles["dropdown-menu"]}>
          <div>
            <Link
              className={`${styles.items} ${isActive ? styles.active : ""}`}
              to="/dashboard"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          </div>

          <div>
            <button
              className={styles.items}
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOut size={16} />
              {isLoading ? "Signing out..." : BUTTON_TEXT.signOut}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
