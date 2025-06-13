import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import LoadingSpinner from "../../components/common/loadingspinner/LoadingSpinner";
import styles from "./Verification.module.css";

const Verification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const hasVerified = useRef(false);
  const [uiState, setUiState] = useState(null);

  const { makeRequest, data } = useApi({
    url: `/auth/verify/${token}`,
    method: "GET",
  });

  const performVerification = useCallback(async () => {
    if (!token || hasVerified.current) return;
    hasVerified.current = true;
    await makeRequest();
  }, [token, makeRequest]);

  useEffect(() => {
    if (data?.ui) {
      setUiState(data.ui);
    }
  }, [data]);

  useEffect(() => {
    if (uiState?.redirectAfter) {
      const timer = setTimeout(() => navigate("/"), uiState.redirectAfter);
      return () => clearTimeout(timer);
    }
  }, [uiState?.redirectAfter, navigate]);

  useEffect(() => {
    performVerification();
  }, [performVerification]);

  const currentState = uiState || {
    title: "Verifying",
    message: "Please wait, while we verify your email.",
    showLoader: true,
  };

  return (
    <div className={styles.verificationPageContainer}>
      <div className={styles.verificationCard}>
        {currentState.showLoader && (
          <div className={styles.loadingContainer}>
            <LoadingSpinner size={40} border={4} color="var(--primary)" />
          </div>
        )}
        <h2 className={styles.verifyTitle}>{currentState.title}</h2>
        <p className={styles.verifyMessage}>{currentState.message}</p>
      </div>
    </div>
  );
};

export default Verification;
