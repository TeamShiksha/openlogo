import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useApi } from "../../hooks/useApi";
import LoadingSpinner from "../../components/common/loadingspinner/LoadingSpinner";
import "./VerifyEmail.css";

const REDIRECT_DELAY = 3000;

const VerificationCard = ({ children }) => (
  <div className="verification-page-container">
    <div className="verification-card">{children}</div>
  </div>
);

VerificationCard.propTypes = {
  children: PropTypes.node.isRequired,
};

const LoadingState = () => (
  <VerificationCard>
    <div className="loading-container">
      <LoadingSpinner size={40} color="var(--primary)" />
    </div>
    <h2 className="verify-title">Verifying</h2>
    <p>Please wait, while we verify your email.</p>
  </VerificationCard>
);

const ResultState = ({ title, message }) => (
  <VerificationCard>
    <h2 className="verify-title">{title}</h2>
    <p>{message}</p>
  </VerificationCard>
);

ResultState.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(true);
  const hasVerified = useRef(false);

  const { makeRequest, data, errorMsg, isSuccess } = useApi({
    url: `/auth/verify/${token}`,
    method: "GET",
  });

  const performVerification = useCallback(async () => {
    if (!token) {
      navigate("/");
      return;
    }

    if (hasVerified.current) return;

    hasVerified.current = true;
    setIsLoading(true);

    try {
      await makeRequest();
    } finally {
      setIsLoading(false);
    }
  }, [token, makeRequest, navigate]);

  useEffect(() => {
    performVerification();
  }, [performVerification]);

  useEffect(() => {
    if (isSuccess && data?.success && !data?.alreadyVerified) {
      const timer = setTimeout(() => navigate("/"), REDIRECT_DELAY);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, data, navigate]);

  if (isLoading) return <LoadingState />;

  const title = data?.title || (errorMsg ? "Error" : "Processing...");
  const message =
    data?.message ||
    errorMsg ||
    "Please wait while we process your verification.";

  return <ResultState title={title} message={message} />;
};

export default VerifyEmail;
