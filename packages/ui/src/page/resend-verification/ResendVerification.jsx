import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import CustomInput from "../../components/common/input/CustomInput";
import Button from "../../components/common/button/Button";
import { BUTTON_TEXT } from "../../utils/Constants";
import styles from "./ResendVerification.module.css";

const ResendVerification = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [resendEmail, setResendEmail] = useState("");
  const timerRef = useRef(null);

  const { makeRequest, data, errorMsg } = useApi({
    method: "post",
    url: "/auth/resend-verification",
  });
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  const handleResendEmail = async (e) => {
    e.preventDefault();
    await makeRequest({ data: { email: resendEmail } });
    if (data?.statusCode == 200) {
      toast.success(data.message);
      timerRef.current = setTimeout(() => navigate("/"), 3000);
    }
    if (errorMsg) {
      toast.error(errorMsg);
    }
  };
  return (
    <div className={styles.resendVerficationContainer}>
      <h1>Resend Verification</h1>
      <form onSubmit={handleResendEmail} className={styles.resendForm}>
        <CustomInput
          key="resendEmail"
          type="email"
          name="resendEmail"
          label="resend Verifaction Email"
          value={resendEmail}
          onChange={(e) => setResendEmail(e.target.value)}
          disabled={false}
          required={true}
        />
        <div className={styles.btnDiv}>
          <Button
            type="submit"
            variant="primary"
            disabled={false}
            isLoading={false}
            className="btn-resend"
          >
            {BUTTON_TEXT.resendEmail}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default ResendVerification;
