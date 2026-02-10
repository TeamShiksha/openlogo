import { useState } from "react";
import styles from "./TwoFactorAuth.module.css";
import Button from "../common/button/Button";
import { Copy, ShieldCheck, QrCode, AlertTriangle } from "lucide-react";

export default function TwoFactorAuth() {
  const [mode, setMode] = useState("INITIAL"); // INITIAL, SETUP, VERIFIED
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleEnableClick = () => {
    setMode("SETUP");
  };

  const handleCancelSetup = () => {
    setMode("INITIAL");
    setVerificationCode("");
  };

  const handleVerify = () => {
    if (verificationCode.length !== 6) return;

    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setMode("VERIFIED");
    }, 1000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add toast here
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerGroup}>
          <div className={styles.iconBox}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className={styles.title}>Two-Factor Authentication</h2>
            <p className={styles.description}>
              Add an extra layer of security to your account.
            </p>
          </div>
        </div>
        <span
          className={`${styles.statusBadge} ${mode === "VERIFIED" ? styles.successBadge : styles.pendingBadge}`}
        >
          {mode === "VERIFIED"
            ? "Active"
            : mode === "SETUP"
              ? "Setup Required"
              : "Not Configured"}
        </span>
      </div>

      <div className={styles.cardBody}>
        {mode === "INITIAL" && (
          <div className={styles.initialState}>
            <div className={styles.qrPlaceholderIcon}>
              <QrCode size={48} className={styles.textMuted} />
            </div>
            <h3 className={styles.heading}>Secure your account</h3>
            <p className={styles.subtext}>
              Generate a unique QR code to link your account with an
              authenticator app like Google Authenticator or Authy.
            </p>
            <Button
              variant="primary"
              onClick={handleEnableClick}
              className={styles.actionBtn}
            >
              Generate QR Code
            </Button>
          </div>
        )}

        {mode === "SETUP" && (
          <div className={styles.setupContent}>
            <div className={styles.setupGrid}>
              {/* Step 1 */}
              <div>
                <h3 className={styles.stepTitle}>Step 1: Scan QR Code</h3>
                <div className={styles.qrContainer}>
                  {/* Mock QR Code Pattern */}
                  <div className={styles.qrPattern}>
                    <div className={styles.qrInner} />
                  </div>
                </div>
                <p className={styles.helperText}>
                  Scan this code using an authenticator app like Google
                  Authenticator or Authy.
                </p>
              </div>

              {/* Step 2 */}
              <div className={styles.stepTwoColumn}>
                {/* Manual Key */}
                <div>
                  <h3 className={styles.stepTitle}>Manual Entry Key</h3>
                  <div className={styles.manualKeyBox}>
                    <code className={styles.manualKey}>
                      JK2X 9PL0 MZ5W 1A9B
                    </code>
                    <button
                      className={styles.copyBtn}
                      onClick={() => copyToClipboard("JK2X 9PL0 MZ5W 1A9B")}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <p className={styles.helperTextSmall}>
                    If you can&apos;t scan the QR code, enter this secret key
                    manually.
                  </p>
                </div>

                {/* Verification Input */}
                <div>
                  <h3 className={styles.stepTitle}>
                    Step 2: Enter Verification Code
                  </h3>
                  <div className={styles.verificationRow}>
                    <input
                      type="text"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      className={styles.codeInput}
                      placeholder="000000"
                    />
                    <Button
                      variant="primary"
                      onClick={handleVerify}
                      isLoading={isVerifying}
                      disabled={verificationCode.length !== 6}
                      className={styles.verifyBtn}
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.recoverySection}>
              <div className={styles.recoveryHeader}>
                <div>
                  <h3 className={styles.headingSmall}>Recovery Codes</h3>
                  <p className={styles.subtextSmall}>
                    Recovery codes can be used to access your account if you
                    lose your device.
                  </p>
                </div>
                <div className={styles.actionGroup}>
                  <Button variant="secondary" className={styles.smallBtn}>
                    Print
                  </Button>
                  <Button variant="secondary" className={styles.smallBtn}>
                    Download
                  </Button>
                </div>
              </div>

              <div className={styles.recoveryGrid}>
                {[
                  "A1B2-C3D4",
                  "E5F6-G7H8",
                  "I9J0-K1L2",
                  "M3N4-O5P6",
                  "Q7R8-S9T0",
                  "U1V2-W3X4",
                  "Y5Z6-A7B8",
                  "C9D0-E1F2",
                ].map((code, i) => (
                  <div key={i} className={styles.recoveryCode}>
                    {code}
                  </div>
                ))}
              </div>

              <div className={styles.warningBox}>
                <AlertTriangle size={18} className={styles.warningIcon} />
                <p className={styles.warningText}>
                  Keep these codes safe! They are the only way to recover your
                  account if you lose your phone.
                </p>
              </div>
            </div>
          </div>
        )}

        {mode === "VERIFIED" && (
          <div className={styles.verifiedState}>
            <div className={styles.successIconWrapper}>
              <ShieldCheck size={64} className={styles.successIcon} />
            </div>
            <h3 className={styles.heading}>2FA is Active</h3>
            <p className={styles.subtext}>
              Your account is secured with two-factor authentication.
            </p>
            <div className={styles.recoverySection}>
              {/* Reuse recovery section if needed or show a simplified version */}
              <p className={styles.subtextSmall}>
                You can regenerate recovery codes if you&apos;ve lost them.
              </p>
            </div>
          </div>
        )}
      </div>

      {mode === "SETUP" && (
        <div className={styles.footer}>
          <Button variant="secondary" onClick={handleCancelSetup}>
            Cancel Setup
          </Button>
          <Button variant="primary" disabled>
            Finish Configuration
          </Button>
        </div>
      )}

      {mode === "VERIFIED" && (
        <div className={styles.footer}>
          <Button variant="danger" onClick={() => setMode("INITIAL")}>
            Disable 2FA
          </Button>
        </div>
      )}
    </div>
  );
}
