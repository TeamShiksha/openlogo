import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [verifyData, setVerifyData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const { fetchRequest, errorMsg } = useApi({
    method: "get",
    url: `/auth/verify/${token}`,
  });

  const performVerification = useCallback(async () => {
    if (!token || hasVerified.current) return;
    hasVerified.current = true;

    const { data, success } = await fetchRequest();
    setVerifyData(data);
    setIsVerified(success);
  }, [token, fetchRequest]);

  useEffect(() => {
    performVerification();
  }, [performVerification]);

  useEffect(() => {
    if (!verifyData) return;

    setIsLoading(false);

    if (isVerified) {
      if (!verifyData.source) {
        setTitle("Verified");
        setMessage("Your email has been verified.");
        setTimeout(() => navigate("/"), 3000);
      } else if (
        verifyData.statusCode === 201 &&
        verifyData.source === "resendEmail"
      ) {
        setTitle("Verification Pending");
        setMessage("Verification email sent. \nPlease verify your account.");
        setTimeout(() => navigate("/"), 6000);
      }
    }
  }, [verifyData, isVerified, navigate]);

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
      </div>
    </div>
  );
};

export default Verification;
