import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./SettingCard.module.css";

function SettingCard({
  type,
  username,
  email,
  title,
  subtitle,
  buttontitle,
  index,
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const buttonClass =
    type === "setting" && index === 0
      ? styles.primaryButton
      : styles.secondaryButton;

  return (
    <div className={styles.card}>
      {type === "profile" && (
        <>
          <h2 className={styles.title}>Your profile</h2>
          <div className={styles.userDetails}>
            <div className={styles.username}>{username}</div>
            <div className={styles.email}>{email}</div>
          </div>
        </>
      )}

      {type === "changePassword" && (
        <>
          <h2 className={styles.title}>Change password</h2>
          <form>
            <div className={styles.textfield}>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Current Password"
                label="Current Password"
                required
              />
            </div>
            <div className={styles.textfield}>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="New Password"
                label="New Password"
                required
              />
            </div>
            <div className={styles.textfield}>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm Password"
                label="New Password"
                required
              />
            </div>
            <button type="submit" className={styles.button}>
              Change
            </button>
          </form>
        </>
      )}

      {type === "setting" && (
        <>
          <div className={styles.content}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <div className={styles.buttonContainer}>
            <button className={`${styles.button} ${buttonClass}`}>
              {buttontitle}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

SettingCard.propTypes = {
  type: PropTypes.oneOf(["profile", "changePassword", "setting"]).isRequired,
  username: PropTypes.string,
  email: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  buttontitle: PropTypes.string,
  index: PropTypes.number,
};

export default SettingCard;
