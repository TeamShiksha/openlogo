import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { instance } from "../../api/api_instance";
import LoadingSpinner from "../../components/common/loadingspinner/LoadingSpinner";
import styles from "./Verification.module.css";

const Verification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const hasVerified = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("Verifying");
  const [message, setMessage] = useState(
    "Please wait, while we verify your email."
  );

  const performVerification = useCallback(async () => {
    if (!token || hasVerified.current) return;
    hasVerified.current = true;

    try {
      const response = await instance.get(`/auth/verify/${token}`);
      setIsLoading(false);

      if (response.status === 200) {
        setTitle("Verified");
        setMessage(response.data?.message || "Email verified successfully");
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error.response?.data?.message || "Verification failed";

      setTitle("Error");
      setMessage(errorMessage);
    }
  }, [token, navigate]);

  useEffect(() => {
    performVerification();
  }, [performVerification]);

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
    </div>
  );
};

export default Verification;
