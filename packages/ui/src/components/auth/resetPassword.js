import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import styles from "../auth/SignForm.module.css";
import { BUTTON_TEXT, DASHBOARD_CARDS_TITLE } from "../../utils/Constants";
import { validate } from "../../utils/Helpers.js";

import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast.js";

const initialValues = {
  newPassword: "",
  confirmPassword: "",
};

const ResetPassword = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [localErrorMsg, setLocalErrorMsg] = useState("");
  const [tokenValid, setTokenValid] = useState(false);

  const token = searchParams.get("token");
  const {
    makeRequest: validateTokenRequest,
    errorMsg: tokenErrorMsg,
    loading: tokenLoading,
  } = useApi({
    method: "get",
    url: `/auth/password/forgot/${token}`,
    withCredentials: true,
  });

  const {
    makeRequest: resetPasswordRequest,
    errorMsg: resetErrorMsg,
    loading: resetLoading,
  } = useApi({
    method: "patch",
    url: "/auth/password/reset",
    data: {
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
      token: token,
    },
    withCredentials: true,
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLocalErrorMsg("Invalid or missing token.");
        return;
      }
      const success = await validateTokenRequest();
      if (success) {
        setTokenValid(true);
      } else {
        setLocalErrorMsg(tokenErrorMsg || "Invalid or expired token.");
      }
    };
    validateToken();
  }, [token]);

  useEffect(() => {
    const errors = validate({
      password: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });
    setFormErrors({
      newPassword: errors.password,
      confirmPassword: errors.confirmPassword,
    });
    setIsFormValid(Object.keys(errors).length === 0);
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErrorMsg("");
    const success = await resetPasswordRequest();
    if (success) {
      toast.success("Password reset successful! Please sign in.");
      navigate("/");
    } else {
      setLocalErrorMsg(resetErrorMsg || "Failed to reset password.");
      toast.error(resetErrorMsg || "Failed to reset password.");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <form className={styles["reset-password-form"]} onSubmit={handleSubmit}>
          <img src="/logo-images.png" alt="openlogo" className={styles.logo} />
          <h2 className={styles.title}>{DASHBOARD_CARDS_TITLE[4]}</h2>

          <div
            className={`"error-container" ${localErrorMsg ? "has-error" : ""}`}
          >
            <p className="input-error">{localErrorMsg}</p>
          </div>

          {tokenValid ? (
            <div className={styles["form-width"]}>
              <CustomInput
                error={formErrors.newPassword}
                type="password"
                name="newPassword"
                label="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={resetLoading || tokenLoading}
                required
              />
              <CustomInput
                error={formErrors.confirmPassword}
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={resetLoading || tokenLoading}
                required
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!isFormValid || resetLoading || tokenLoading}
                >
                  {BUTTON_TEXT.submit}
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles["form-width"]}>
              <p className={styles["error-message"]}>
                {localErrorMsg || "Invalid or expired token."}
              </p>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
