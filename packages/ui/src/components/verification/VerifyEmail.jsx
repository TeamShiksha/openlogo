import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    console.log("Token received:", token);
  }, [token]);

  return (
    <div className="verification-page-container">
      <div className="verification-container">
        <div className="verification-card">
          <div className="verification-content">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <h2 className="verify-title">Verifying</h2>
            <p>Please wait, while we verify your email.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
