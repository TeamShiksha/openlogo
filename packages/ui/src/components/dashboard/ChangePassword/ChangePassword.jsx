import React, { useState } from "react";
import axios from "axios";
import CustomInput from "../../common/input/CustomInput";
import Button from "../../common/button/Button";
import { isValidPassword } from "../../../utils/helpers";
import styles from "./ChangePassword.module.css";

function ChangePassword() {
  const [formValues, setFormValues] = useState({
    currPassword: "",
    newPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const validateCurrentPassword = (currPassword) => {
    if (!currPassword) return "Current password is required.";
    return "";
  };

  const validateNewPassword = (newPassword) => {
    const passwordErrors = isValidPassword(newPassword);
    return passwordErrors.password || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setErrorMessage("");

    // const currPasswordError = validateCurrentPassword(formValues.currPassword);
    // if (currPasswordError) return setErrorMessage(currPasswordError);

    // const newPasswordError = validateNewPassword(formValues.newPassword);
    // if (newPasswordError) return setErrorMessage(newPasswordError);

    // setIsSubmitting(true);
    // try {
    //   const response = await axios.post("/api/user/update-password", formValues);
    //   if (response.status === 200) {
    //     setSuccessMessage("Password updated successfully.");
    //     setFormValues({ currPassword: "", newPassword: "" });
    //   }
    // } catch (error) {
    //   setErrorMessage(
    //     error.response?.data?.message || "An error occurred while updating the password."
    //   );
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className={styles.dashboardContentItem}>
      <h6 className={styles.contentItemHeading}>Change Password</h6>
      <form 
      onSubmit={handleSubmit}
      >
        {/* <div className={styles.alertMessage}>
          {successMessage && (
            <p className={styles.successMessage}>{successMessage}</p>
          )}
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
        </div> */}

        <CustomInput
          type="password"
          name="currPassword"
          label="Current Password"
          value={formValues.currPassword}
          onChange={handleChange}
          required
        />
        <CustomInput
          type="password"
          name="newPassword"
          label="New Password"
          value={formValues.newPassword}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className={styles.changePasswordButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
}

export default ChangePassword;
