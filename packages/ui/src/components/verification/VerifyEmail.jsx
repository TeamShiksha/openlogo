import "./VerifyEmail.css";
import { VERIFICATION } from "../../utils/Constants";

const VerifyEmail = () => {
  return (
    <div className="verification-page-container">
      <div className="verification-card">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <h2 className="verify-title">{VERIFICATION.title}</h2>
        <p>{VERIFICATION.message}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
