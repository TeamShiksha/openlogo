import { useContext, useState } from "react";
import styles from "./UserSettings.module.css";
import { Monitor, Shield, User } from "lucide-react";
import TwoFactorAuth from "../twofactorauth/TwoFactorAuth";
import ProfileInfo from "../profileinfo/ProfileInfo";
import DeviceSessionCard from "../devicesession/DeviceSessionCard";
import { UserContext } from "../../contexts/Contexts";

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { userData } = useContext(UserContext);
  const isGuest = userData?.role === "GUEST";

  const menuItems = [
    { id: "profile", label: "Profile Info", icon: <User size={20} /> },
    { id: "2fa", label: "2FA Settings", icon: <Shield size={20} /> },
    { id: "sessions", label: "Sessions", icon: <Monitor size={20} /> },
  ];

  const headerTitle = () => {
    if (activeTab === "profile") return "Profile Info";
    if (activeTab === "sessions") return "Active Sessions";
    return "Security Settings";
  };

  const headerSubtitle = () => {
    if (activeTab === "profile")
      return "Manage your personal details and account security preferences.";
    if (activeTab === "sessions")
      return "View and manage your active sessions across all devices.";
    return "Manage your account security and two-factor authentication.";
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>{headerTitle()}</h1>
          <p>{headerSubtitle()}</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`${styles.navItem} ${
                activeTab === item.id ? styles.navItemActive : ""
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className={styles.content}>
          {activeTab === "profile" && <ProfileInfo />}
          {activeTab === "2fa" && <TwoFactorAuth />}
          {activeTab === "sessions" && <DeviceSessionCard isGuest={isGuest} />}
        </div>
      </div>
    </div>
  );
}
