import { useContext } from "react";
import styles from "./ProfileInfo.module.css";
import UserInfo from "../userinfo/UserInfo";
import ChangePassword from "../changepassword/ChangePassword";
import SettingCard from "../settings/SettingCard";
import CurrentPlan from "../currentplan/CurrentPlan";
import { UserContext } from "../../contexts/Contexts";

export default function ProfileInfo() {
  const { userData } = useContext(UserContext);
  const isGuest = userData?.isGuest || false;

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        {/* User Info Section */}
        <div className={styles.card}>
          <h2 className={styles.heading}>User Info</h2>
          {userData && (
            <UserInfo
              name={userData.name}
              email={userData.email}
              isGuest={isGuest}
            />
          )}
        </div>

        {/* Security Section (Change Password) */}
        <div className={styles.card}>
          <h2 className={styles.heading}>Change Password</h2>
          <div className={styles.section}>
            <ChangePassword isGuest={isGuest} />
          </div>
        </div>
      </div>

      {/* Data Management + Plan Row */}
      <div className={styles.bottomRow}>
        <div className={styles.card}>
          <h2 className={styles.heading}>Setting</h2>
          <div className={styles.section}>
            <SettingCard isGuest={isGuest} />
          </div>
        </div>

        {/* Plan Section */}
        <div className={styles.card}>
          <h2 className={styles.heading}>Plan</h2>
          <div className={styles.section}>
            <CurrentPlan isGuest={isGuest} />
          </div>
        </div>
      </div>
    </div>
  );
}
