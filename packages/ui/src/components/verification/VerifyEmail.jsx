import "./VerifyEmail.css";

const VerifyEmail = () => {
  return (
    <div className="verification-page-container">
      <div className="verification-card">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <h2 className="verify-title">Verifying</h2>
        <p>Please wait, while we verify your email.</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
