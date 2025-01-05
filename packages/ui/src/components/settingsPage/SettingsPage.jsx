import React from "react";
import SettingCard from "./SettingCard";
import styles from "./SettingsPage.module.css";
import { SETTING } from "../../utils/constants";

const SettingsPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <SettingCard
          type="profile"
          username="John Doe"
          email="johndoe@gmail.com"
        />

        <SettingCard type="changePassword" />

        <div className={styles.fullWidth}>
          <h6 className={styles.sectionTitle}>Settings</h6>
        </div>

        {SETTING.map(({ title, subtitle, buttontitle }, index) => (
          <SettingCard
            key={index}
            type="setting"
            title={title}
            subtitle={subtitle}
            index={index}
            buttontitle={buttontitle}
          />
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
