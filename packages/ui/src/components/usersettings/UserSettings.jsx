import { useState } from "react";
import styles from "./UserSettings.module.css";
import { Shield, User, Lock, Bell } from "lucide-react";
import TwoFactorAuth from "../twofactorauth/TwoFactorAuth";
import ProfileInfo from "../profileinfo/ProfileInfo";

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  const menuItems = [
    { id: "profile", label: "Profile Info", icon: <User size={20} /> },
    { id: "2fa", label: "2FA Settings", icon: <Shield size={20} /> },
    { id: "password", label: "Password", icon: <Lock size={20} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={20} /> },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>
            {activeTab === "profile" ? "Profile Info" : "Security Settings"}
          </h1>
          <p>
            {activeTab === "profile"
              ? "Manage your personal details and account security preferences."
              : "Manage your account security and two-factor authentication."}
          </p>
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
          {activeTab !== "2fa" && activeTab !== "profile" && (
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <div className={styles.initialState}>
                  <h3 className={styles.heading}>Coming Soon</h3>
                  <p className={styles.subtext}>
                    The {menuItems.find((i) => i.id === activeTab)?.label}{" "}
                    settings are currently under development.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
