import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import LoadingSpinner from "../../components/common/loadingspinner/LoadingSpinner";
import { VERIFICATION } from "../../utils/Constants";
import styles from "./Verification.module.css";

const Verification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const hasVerified = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState(VERIFICATION.title);
  const [message, setMessage] = useState(VERIFICATION.message);
  const [showResendVerify, setShowResendVerify] = useState(false);
  const timerRef = useRef(null);

  const { makeRequest, data, errorMsg } = useApi({
    method: "get",
    url: `/auth/verify/${token}`,
  });

  const performVerification = useCallback(async () => {
    if (!token || hasVerified.current) return;
    hasVerified.current = true;

    await makeRequest();
  }, [token, makeRequest]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    performVerification();
  }, [performVerification]);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setTitle("Verified");
      setMessage(data?.message);
      if (data.statusCode == 200) {
        timerRef.current = setTimeout(() => navigate("/"), 3000);
      }
      if (data.statusCode == 403) setShowResendVerify(true);
    }
  }, [data, navigate]);

  useEffect(() => {
    if (errorMsg) {
      setIsLoading(false);
      setTitle("Error");
      setMessage(errorMsg);
    }
  }, [errorMsg]);

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
        {showResendVerify && (
          <p>
            <Link to="/resend-verification">Click here</Link> to resend
            verification link
          </p>
        )}
      </div>
    </div>
  );
};

export default Verification;
