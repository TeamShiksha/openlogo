import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import LoadingSpinner from "../../components/common/loadingspinner/LoadingSpinner";
import { VERIFICATION } from "../../utils/Constants";
import CustomInput from "../../components/common/input/CustomInput";
import { useToast } from "../../hooks/useToast";
import Button from "../../components/common/button/Button";
import { BUTTON_TEXT } from "../../utils/Constants";
import styles from "./Verification.module.css";

const Verification = () => {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const hasVerified = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState(VERIFICATION.title);
  const [message, setMessage] = useState(VERIFICATION.message);
  const [resendEmail, setResendEmail] = useState("");
  const { makeRequest, data, errorMsg } = useApi({
    method: "get",
    url: `/auth/verify/${token}`,
  });

  const resendVerifyEmail = useApi({
    method: "post",
    url: "/auth/resend-verification",
  });

  const performVerification = useCallback(async () => {
    if (!token || hasVerified.current) return;
    hasVerified.current = true;

    await makeRequest();
  }, [token, makeRequest]);

  useEffect(() => {
    performVerification();
  }, [performVerification]);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setTitle("Verified");
      setMessage(data?.message);
      if (data.statusCode == 200) setTimeout(() => navigate("/"), 3000);
    }
  }, [data, navigate]);

  useEffect(() => {
    if (errorMsg) {
      setIsLoading(false);
      setTitle("Error");
      setMessage(errorMsg);
    }
  }, [errorMsg]);

  const handleResendEmail = async (e) => {
    e.preventDefault();
    await resendVerifyEmail.makeRequest({ data: { email: resendEmail } });
    if (resendVerifyEmail.data?.statusCode == 200) {
      toast.success(resendVerifyEmail.data.message);
      setTimeout(() => navigate("/"), 3000);
    }
    if (resendVerifyEmail.errorMsg) {
      toast.error(resendVerifyEmail.errorMsg);
    }
  };

  return (
    <div className={styles.verificationPageContainer}>
      <div className={styles.verificationCard}>
        {isLoading && (
          <div className={styles.loadingContainer}>
            <LoadingSpinner size={40} border={4} color="var(--primary)" />
          </div>
        )}
        <h2 className={styles.verifyTitle}>{title}</h2>
        <p className={styles.verifyMessage}>{message}</p>
      </div>
      <form
        onSubmit={(e) => handleResendEmail(e)}
        className={styles.resendVerficationContainer}
      >
        <CustomInput
          key="resendEmail"
          type="email"
          name="resendEmail"
          label="resend Verifaction Email"
          value={resendEmail}
          onChange={(e) => setResendEmail(e.target.value)}
          disabled={isLoading}
          required={true}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          isLoading={isLoading}
        >
          {BUTTON_TEXT.resendEmail}
        </Button>
      </form>
    </div>
  );
};

export default Verification;
