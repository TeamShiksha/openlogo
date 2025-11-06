import { useState, useContext } from "react";
import styles from "./UserDropDown.module.css";
import { AuthContext, UserContext } from "../../contexts/Contexts";
import Button from "../common/button/Button";
import { BUTTON_TEXT } from "../../utils/Constants";
import { Link } from "react-router-dom";

export default function UserDropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useContext(AuthContext);
  const { userData, setUserData } = useContext(UserContext);

  const initial = userData?.email ? userData?.email[0].toUpperCase() : "U";

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setIsLoading(true);
    logout();
    setUserData(null);
    setIsLoading(false);
  };
  return (
    <div>
      <button className={styles["profile-button"]} onClick={toggleDropdown}>
        {initial}
      </button>
      {isOpen && (
        <div>
          <div>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div className={styles["logout-wrapper"]}>
            <Button
              variant="danger"
              className={styles["logout-btn"]}
              onClick={handleLogout}
              isLoading={isLoading}
            >
              {BUTTON_TEXT.signOut}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
