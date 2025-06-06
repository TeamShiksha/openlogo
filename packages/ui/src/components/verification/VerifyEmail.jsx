import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { VERIFICATION } from "../../utils/Constants";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [verificationState, setVerificationState] = useState("loading");
  const hasVerified = useRef(false);

  const { errorMsg, makeRequest, setErrorMsg, setIsSuccess, data } = useApi({
    url: `/auth/verify/${token}`,
    method: "GET",
  });

  const performVerification = useCallback(async () => {
    if (!token || hasVerified.current) {
      if (!token) navigate("/");
      return;
    }

    hasVerified.current = true;
    setErrorMsg(null);
    setIsSuccess(false);
    setVerificationState("loading");

    try {
      const success = await makeRequest();

      if (success) {
        if (data?.alreadyVerified) {
          setVerificationState("already-verified");
        } else {
          setVerificationState("success");
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } else {
        setVerificationState("error");
      }
    } catch {
      setVerificationState("error");
    }
  }, [token, makeRequest, navigate, setErrorMsg, setIsSuccess, data]);

  useEffect(() => {
    performVerification();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stateConfig = {
    loading: {
      title: VERIFICATION.title,
      message: VERIFICATION.message,
      showLoader: true,
    },
    success: {
      title: "Verified",
      message:
        "Your email has been verified successfully. Redirecting to homepage...",
      showLoader: false,
    },
    "already-verified": {
      title: "Already Verified",
      message:
        "This email has already been verified. You can sign in to your account.",
      showLoader: false,
    },
    error: {
      title: "Error",
      message:
        errorMsg ||
        "Invalid verification link. Please try again or request a new verification email.",
      showLoader: false,
    },
  };

  const currentState = stateConfig[verificationState] || stateConfig.loading;

  return (
    <div className="verification-page-container">
      <div className="verification-card">
        {currentState.showLoader && (
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <h2 className="verify-title">{currentState.title}</h2>
        <p>{currentState.message}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
